import { hasAdminPermission, requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

export type VedaApp = {
  id: string;
  application_number: string;
  full_name: string;
  mobile: string;
  village: string | null;
  status: string;
  cash_transaction_id: string | null;
  subscriber_id: string | null;
  submitted_at: string;
};

export type VedaChange = {
  id: string;
  request_number: string;
  subscriber_number: string | null;
  mobile: string;
  change_type: string;
  requested_name: string | null;
  requested_address: string | null;
  requested_pincode: string | null;
  status: string;
  submitted_at: string;
};

export type VedaArticle = {
  id: string;
  submission_number: string;
  author_name: string;
  mobile: string;
  title: string;
  body_text: string | null;
  status: string;
  submitted_at: string;
};

export type AdminVedaIssue = {
  id: string;
  issue_date: string;
  issue_year: number;
  issue_month: number;
  title_gu: string;
  pdf_url: string | null;
  cover_url: string | null;
  source_url: string | null;
  published: boolean;
  archived_at: string | null;
};

export async function getVedaAdminData() {
  const session = await requireAdminSession();
  if (!hasAdminPermission(session, "veda.view") && !session.profile?.is_super_admin) {
    return { session, s: session, apps: [], changes: [], articles: [], issues: [] };
  }
  const token = await getAdminAccessToken();
  if (!token) return { session, s: session, apps: [], changes: [], articles: [], issues: [] };

  const [apps, changes, articles, issues] = await Promise.all([
    supabaseRest<VedaApp[]>("veda_subscription_applications?select=*&order=submitted_at.desc&limit=100", token),
    supabaseRest<VedaChange[]>("veda_subscriber_change_requests?select=*&order=submitted_at.desc&limit=100", token),
    supabaseRest<VedaArticle[]>("veda_article_submissions?select=*&order=submitted_at.desc&limit=100", token),
    supabaseRest<AdminVedaIssue[]>("veda_issues?select=*&order=issue_date.desc&limit=120", token),
  ]);

  return { session, s: session, apps, changes, articles, issues };
}
