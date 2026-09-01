"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

const value = (fd: FormData, name: string, max = 2000) => {
  const raw = String(fd.get(name) ?? "").trim();
  return raw ? raw.slice(0, max) : null;
};

async function context(permission: string) {
  const session = await requireAdminSession();
  if (!hasAdminPermission(session, permission) && !session.profile?.is_super_admin) {
    throw new Error("Permission denied");
  }
  const token = await getAdminAccessToken();
  if (!token) redirect("/admin/login");
  return { session, token };
}

function revalidateVeda() {
  revalidatePath("/admin/veda");
  revalidatePath("/veda-rahasya");
  revalidatePath("/publications");
  revalidatePath("/");
}

export async function reviewVedaApplicationAction(fd: FormData) {
  const { session, token } = await context("veda.subscriptions.manage");
  const id = value(fd, "id", 40);
  const status = value(fd, "status", 30);
  if (!id || !status) return;
  await supabaseRest(`veda_subscription_applications?id=eq.${encodeURIComponent(id)}`, token, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({
      status,
      review_note: value(fd, "review_note", 1000),
      reviewed_by: session.profile?.id,
      reviewed_at: new Date().toISOString(),
    }),
  });
  revalidatePath("/admin/veda");
}

export async function reviewVedaChangeAction(fd: FormData) {
  const { session, token } = await context("veda.subscriptions.manage");
  const id = value(fd, "id", 40);
  const status = value(fd, "status", 30);
  if (!id || !status) return;
  await supabaseRest(`veda_subscriber_change_requests?id=eq.${encodeURIComponent(id)}`, token, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({
      status,
      review_note: value(fd, "review_note", 1000),
      reviewed_by: session.profile?.id,
      reviewed_at: new Date().toISOString(),
    }),
  });
  revalidatePath("/admin/veda");
}

export async function reviewVedaArticleAction(fd: FormData) {
  const { session, token } = await context("veda.editorial.manage");
  const id = value(fd, "id", 40);
  const status = value(fd, "status", 30);
  if (!id || !status) return;
  await supabaseRest(`veda_article_submissions?id=eq.${encodeURIComponent(id)}`, token, {
    method: "PATCH",
    prefer: "return=minimal",
    body: JSON.stringify({
      status,
      review_note: value(fd, "review_note", 1000),
      reviewed_by: session.profile?.id,
      reviewed_at: new Date().toISOString(),
    }),
  });
  revalidatePath("/admin/veda");
}

export async function activateVedaAction(fd: FormData) {
  const { token } = await context("veda.approve");
  const id = value(fd, "id", 40);
  if (id) {
    await supabaseRest("rpc/activate_veda_subscription", token, {
      method: "POST",
      body: JSON.stringify({ target_application_id: id }),
      prefer: "return=representation",
    });
  }
  revalidatePath("/admin/veda");
}

export async function saveVedaIssueAction(fd: FormData) {
  const { session, token } = await context("veda.issues.manage");
  const id = value(fd, "id", 40);
  const date = value(fd, "issue_date", 10);
  if (!date) return;

  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) throw new Error("Invalid issue date");

  const canPublish = hasAdminPermission(session, "veda.issues.publish") || Boolean(session.profile?.is_super_admin);
  const requestedPublished = fd.get("published") === "on";
  if (requestedPublished && !canPublish) throw new Error("Publish permission required");

  const row: Record<string, unknown> = {
    issue_date: date,
    issue_year: parsed.getUTCFullYear(),
    issue_month: parsed.getUTCMonth() + 1,
    title_gu: value(fd, "title_gu", 200) ?? "વેદ રહસ્ય",
    pdf_url: value(fd, "pdf_url", 1000),
    cover_url: value(fd, "cover_url", 1000),
    source_url: value(fd, "source_url", 1000),
    archived_at: null,
  };

  if (canPublish) row.published = requestedPublished;
  if (!id) row.published = canPublish ? requestedPublished : false;

  if (id) {
    await supabaseRest(`veda_issues?id=eq.${encodeURIComponent(id)}`, token, {
      method: "PATCH",
      body: JSON.stringify(row),
      prefer: "return=minimal",
    });
  } else {
    await supabaseRest("veda_issues", token, {
      method: "POST",
      body: JSON.stringify({ ...row, created_by: session.profile?.id }),
      prefer: "return=minimal",
    });
  }
  revalidateVeda();
}

export async function archiveVedaIssueAction(fd: FormData) {
  const { session, token } = await context("veda.issues.manage");
  if (!hasAdminPermission(session, "veda.issues.publish") && !session.profile?.is_super_admin) {
    throw new Error("Publish permission required");
  }
  const id = value(fd, "id", 40);
  if (id) {
    await supabaseRest(`veda_issues?id=eq.${encodeURIComponent(id)}`, token, {
      method: "PATCH",
      body: JSON.stringify({ archived_at: new Date().toISOString(), published: false }),
      prefer: "return=minimal",
    });
  }
  revalidateVeda();
}

export async function restoreVedaIssueAction(fd: FormData) {
  const { token } = await context("veda.issues.manage");
  const id = value(fd, "id", 40);
  if (id) {
    await supabaseRest(`veda_issues?id=eq.${encodeURIComponent(id)}`, token, {
      method: "PATCH",
      body: JSON.stringify({ archived_at: null, published: false }),
      prefer: "return=minimal",
    });
  }
  revalidateVeda();
}

export async function permanentDeleteVedaIssueAction(fd: FormData) {
  const session = await requireAdminSession();
  if (!session.profile?.is_super_admin) throw new Error("Super Admin required");
  const token = await getAdminAccessToken();
  if (!token) redirect("/admin/login");
  const id = value(fd, "id", 40);
  if (id) {
    await supabaseRest(`veda_issues?id=eq.${encodeURIComponent(id)}`, token, {
      method: "DELETE",
      prefer: "return=minimal",
    });
  }
  revalidateVeda();
}
