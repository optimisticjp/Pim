import { createClient } from "npm:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const auth = req.headers.get("authorization") ?? "";
  if (!url || !anonKey || !serviceKey || !auth.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
  let payload: { document_id?: string; action?: "view" | "delete" };
  try { payload = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  if (!payload.document_id || !payload.action) return json({ error: "document_id and action are required" }, 400);
  const userClient = createClient(url, anonKey, { global: { headers: { Authorization: auth } }, auth: { persistSession: false, autoRefreshToken: false } });
  const serviceClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: doc, error: docError } = await userClient.from("booking_documents").select("id,storage_provider,storage_key,original_filename,deleted_at").eq("id", payload.document_id).maybeSingle();
  if (docError || !doc || doc.deleted_at) return json({ error: "Document not found or access denied" }, 403);
  if (doc.storage_provider !== "supabase") return json({ error: "Unsupported storage provider" }, 409);
  if (payload.action === "view") {
    const { data, error } = await serviceClient.storage.from("booking-documents-private").createSignedUrl(doc.storage_key, 300);
    if (error || !data?.signedUrl) return json({ error: "Could not create secure document link" }, 500);
    return json({ url: data.signedUrl, expires_in: 300, filename: doc.original_filename });
  }
  const { data: authUser } = await userClient.auth.getUser();
  if (!authUser.user) return json({ error: "Unauthorized" }, 401);
  const { data: profile } = await userClient.from("admin_profiles").select("is_super_admin,status").eq("id", authUser.user.id).maybeSingle();
  if (!profile?.is_super_admin || profile.status !== "active") return json({ error: "Super Admin required" }, 403);
  const { error: removeError } = await serviceClient.storage.from("booking-documents-private").remove([doc.storage_key]);
  if (removeError) return json({ error: "Stored file could not be deleted" }, 500);
  const { error: deleteError } = await serviceClient.from("booking_documents").delete().eq("id", doc.id);
  if (deleteError) return json({ error: "Document record could not be deleted" }, 500);
  return json({ ok: true });
});
