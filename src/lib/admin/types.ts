import type { SupabaseAuthUser } from "@/lib/supabase/server";

export type AdminProfile = {
  id: string;
  display_name: string;
  mobile: string | null;
  is_super_admin: boolean;
  status: "invited" | "active" | "suspended";
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminSession = {
  configured: boolean;
  authenticated: boolean;
  user: SupabaseAuthUser | null;
  profile: AdminProfile | null;
  permissions: string[];
};

export type InboxItem = {
  id: string;
  source_type: string;
  source_id: string | null;
  category: string;
  title: string;
  subtitle: string | null;
  contact_name: string | null;
  contact_mobile: string | null;
  ashram_key: string | null;
  assigned_to: string | null;
  status: string;
  priority: "low" | "normal" | "high" | "urgent";
  payload: Record<string, unknown>;
  archived_at: string | null;
  trashed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RoleRecord = {
  id: string;
  code: string;
  name_gu: string;
  name_en: string;
  description_gu: string | null;
  is_system: boolean;
  is_archived: boolean;
};

export type PermissionRecord = {
  code: string;
  module: string;
  action: string;
  name_gu: string;
  description_gu: string | null;
  dangerous: boolean;
};

export type AuditLog = {
  id: number;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  created_at: string;
};
