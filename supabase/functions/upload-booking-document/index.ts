import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json", "cache-control": "no-store" },
});
const allowed = new Set(["application/pdf", "image/jpeg", "image/png"]);

type ServiceClient = ReturnType<typeof createClient>;

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function reserveUploadSlot(client: ServiceClient, tokenId: string): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const now = new Date().toISOString();
    const { data: tokenRow, error } = await client
      .from("booking_document_upload_tokens")
      .select("id,expires_at,max_uploads,used_uploads,revoked_at")
      .eq("id", tokenId)
      .maybeSingle();
    if (error || !tokenRow || tokenRow.revoked_at || tokenRow.expires_at <= now || tokenRow.used_uploads >= tokenRow.max_uploads) return false;

    const { data: reserved, error: reserveError } = await client
      .from("booking_document_upload_tokens")
      .update({ used_uploads: tokenRow.used_uploads + 1 })
      .eq("id", tokenRow.id)
      .eq("used_uploads", tokenRow.used_uploads)
      .is("revoked_at", null)
      .gt("expires_at", now)
      .select("id")
      .maybeSingle();
    if (reserveError) return false;
    if (reserved) return true;
  }
  return false;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json({ error: "Server configuration missing" }, 500);

  let form: FormData;
  try { form = await req.formData(); } catch { return json({ error: "Invalid form data" }, 400); }
  const rawToken = String(form.get("token") ?? "").trim();
  const file = form.get("file");
  const guestId = String(form.get("guest_id") ?? "").trim() || null;
  if (!rawToken || !(file instanceof File)) return json({ error: "Token and file are required" }, 400);
  if (rawToken.length !== 64) return json({ error: "Invalid upload token" }, 403);
  if (!allowed.has(file.type)) return json({ error: "Only PDF, JPG and PNG files are accepted" }, 415);
  if (file.size <= 0 || file.size > 5 * 1024 * 1024) return json({ error: "File must be 5 MB or smaller" }, 413);

  const client = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const tokenHash = await sha256(rawToken);
  const now = new Date().toISOString();
  const { data: tokenRow, error: tokenError } = await client
    .from("booking_document_upload_tokens")
    .select("id,stay_request_id,expires_at,max_uploads,used_uploads,revoked_at")
    .eq("token_hash", tokenHash)
    .is("revoked_at", null)
    .gt("expires_at", now)
    .maybeSingle();
  if (tokenError || !tokenRow || tokenRow.used_uploads >= tokenRow.max_uploads) return json({ error: "Upload link is invalid or expired" }, 403);

  const { data: stay } = await client.from("stay_requests").select("id,status").eq("id", tokenRow.stay_request_id).maybeSingle();
  if (!stay || ["checked_out", "rejected", "cancelled"].includes(stay.status)) return json({ error: "This stay request no longer accepts documents" }, 409);
  if (guestId) {
    const { data: guest } = await client.from("stay_guests").select("id").eq("id", guestId).eq("stay_request_id", stay.id).maybeSingle();
    if (!guest) return json({ error: "Guest does not belong to this stay request" }, 400);
  }

  const ext = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
  const storageKey = `${stay.id}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await client.storage.from("booking-documents-private").upload(storageKey, file, { contentType: file.type, upsert: false });
  if (uploadError) return json({ error: "File upload failed" }, 500);

  const { data: doc, error: insertError } = await client.from("booking_documents").insert({
    stay_request_id: stay.id,
    guest_id: guestId,
    document_type: "aadhaar",
    storage_provider: "supabase",
    storage_key: storageKey,
    original_filename: file.name.slice(0, 255),
    mime_type: file.type,
    size_bytes: file.size,
  }).select("id,original_filename,uploaded_at").single();
  if (insertError) {
    await client.storage.from("booking-documents-private").remove([storageKey]);
    return json({ error: "Document record could not be saved" }, 500);
  }

  const reserved = await reserveUploadSlot(client, tokenRow.id);
  if (!reserved) {
    await client.from("booking_documents").delete().eq("id", doc.id);
    await client.storage.from("booking-documents-private").remove([storageKey]);
    return json({ error: "Upload limit reached or upload link expired. Please request a new link." }, 409);
  }

  return json({ ok: true, document: doc }, 201);
});
