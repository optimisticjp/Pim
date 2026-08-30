import { Bell } from "lucide-react";
import { requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

type Notification = { id: string; title: string; body: string | null; href: string | null; status: string; created_at: string };

export default async function AdminNotificationsPage() {
  await requireAdminSession();
  const token = await getAdminAccessToken();
  const notifications = token ? await supabaseRest<Notification[]>("notifications?select=id,title,body,href,status,created_at&order=created_at.desc&limit=60", token) : [];
  return <div><p className="text-xs font-bold text-gold-deep">IN-APP</p><h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">સૂચનાઓ</h1><div className="mt-5 overflow-hidden rounded-2xl border border-[#dfd9d0] bg-white">{notifications.length ? notifications.map((item) => <article key={item.id} className="flex gap-3 border-b border-[#eee9e2] p-4 last:border-0"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f3eee7] text-primary"><Bell className="size-4" /></div><div><p className="text-sm font-bold">{item.title}</p>{item.body ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.body}</p> : null}<p className="mt-1 text-[11px] text-[#9a8f85]">{new Intl.DateTimeFormat("gu-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.created_at))}</p></div></article>) : <p className="p-8 text-center text-sm text-muted-foreground">હજુ સૂચના નથી.</p>}</div></div>;
}
