create sequence public.donation_intent_number_seq;
create sequence public.receipt_number_seq;

create or replace function private.next_donation_intent_number()
returns text language sql security definer set search_path='' as $$
  select 'DON-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('public.donation_intent_number_seq')::text,6,'0');
$$;
create or replace function private.next_receipt_number()
returns text language sql security definer set search_path='' as $$
  select 'RCPT-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('public.receipt_number_seq')::text,7,'0');
$$;

create table public.donation_intents (
  id uuid primary key default gen_random_uuid(),
  intent_number text not null unique default private.next_donation_intent_number(),
  donor_name text not null,
  mobile text not null,
  purpose_gu text,
  pledged_amount numeric(12,2) check (pledged_amount is null or pledged_amount > 0),
  preferred_ashram_id uuid references public.ashram_profiles(id) on delete set null,
  status text not null default 'cash_pending' check (status in ('cash_pending','cash_received','receipt_issued','cancelled','archived')),
  admin_note text,
  assigned_to uuid references public.admin_profiles(id) on delete set null,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index donation_intents_status_idx on public.donation_intents(status,submitted_at desc);
create trigger donation_intents_updated before update on public.donation_intents for each row execute function public.set_updated_at();

create table public.cash_transactions (
  id uuid primary key default gen_random_uuid(),
  reference_type text not null check (reference_type in ('donation','veda_subscription','membership','other')),
  reference_id text,
  payer_name text not null,
  mobile text,
  amount numeric(12,2) not null check (amount > 0),
  purpose_gu text not null,
  ashram_id uuid references public.ashram_profiles(id) on delete set null,
  received_at timestamptz not null default now(),
  received_by uuid not null references public.admin_profiles(id) on delete restrict,
  note text,
  voided_at timestamptz,
  voided_by uuid references public.admin_profiles(id) on delete set null,
  void_reason text,
  created_at timestamptz not null default now()
);
create index cash_transactions_reference_idx on public.cash_transactions(reference_type,reference_id);
create index cash_transactions_received_idx on public.cash_transactions(received_at desc);

create table public.receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique default private.next_receipt_number(),
  cash_transaction_id uuid not null unique references public.cash_transactions(id) on delete restrict,
  payer_name text not null,
  amount numeric(12,2) not null check (amount > 0),
  purpose_gu text not null,
  ashram_name_snapshot text,
  status text not null default 'issued' check (status in ('issued','void')),
  issued_at timestamptz not null default now(),
  issued_by uuid not null references public.admin_profiles(id) on delete restrict,
  voided_at timestamptz,
  voided_by uuid references public.admin_profiles(id) on delete set null,
  void_reason text,
  created_at timestamptz not null default now()
);
create index receipts_issued_idx on public.receipts(issued_at desc);

alter table public.donation_intents enable row level security;
alter table public.cash_transactions enable row level security;
alter table public.receipts enable row level security;
create policy donation_admin_select on public.donation_intents for select to authenticated using(private.has_permission('cash.record') or private.has_permission('inbox.view'));
create policy donation_admin_update on public.donation_intents for update to authenticated using(private.has_permission('cash.record')) with check(private.has_permission('cash.record'));
create policy donation_super_delete on public.donation_intents for delete to authenticated using(private.is_super_admin());
create policy cash_admin_select on public.cash_transactions for select to authenticated using(private.has_permission('cash.record') or private.has_permission('receipts.issue'));
create policy cash_admin_insert on public.cash_transactions for insert to authenticated with check(private.has_permission('cash.record') and received_by=auth.uid());
create policy cash_super_update on public.cash_transactions for update to authenticated using(private.is_super_admin()) with check(private.is_super_admin());
create policy cash_super_delete on public.cash_transactions for delete to authenticated using(private.is_super_admin());
create policy receipts_admin_select on public.receipts for select to authenticated using(private.has_permission('receipts.issue') or private.has_permission('cash.record'));
create policy receipts_admin_insert on public.receipts for insert to authenticated with check(private.has_permission('receipts.issue') and issued_by=auth.uid());
create policy receipts_super_update on public.receipts for update to authenticated using(private.is_super_admin()) with check(private.is_super_admin());
create policy receipts_super_delete on public.receipts for delete to authenticated using(private.is_super_admin());

revoke all on public.donation_intents,public.cash_transactions,public.receipts from anon;
revoke all on public.donation_intents,public.cash_transactions,public.receipts from authenticated;
grant select,update,delete on public.donation_intents to authenticated;
grant select,insert,update,delete on public.cash_transactions,public.receipts to authenticated;

create trigger audit_donation_intents after insert or update or delete on public.donation_intents for each row execute function public.audit_admin_row_change();
create trigger audit_cash_transactions after insert or update or delete on public.cash_transactions for each row execute function public.audit_admin_row_change();
create trigger audit_receipts after insert or update or delete on public.receipts for each row execute function public.audit_admin_row_change();
