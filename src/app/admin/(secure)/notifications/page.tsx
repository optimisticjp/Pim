import Link from "next/link";
import { Archive, Bell, CheckCheck, Mail } from "lucide-react";

import { markAllNotificationsReadAction, setNotificationStatusAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  href: string | null;
  status: "unread" | "read" | "archived";
  created_at: string;
};

export default async function AdminNotificationsPage() {
  await requireAdminSession();
  const token = await getAdminAccessToken();
  const notifications = token
    ? await supabaseRest<Notification[]>(
        "notifications?select=id,title,body,href,status,created_at&status=neq.archived&order=created_at.desc&limit=60",
        token,
      )
    : [];
  const unreadCount = notifications.filter((item) => item.status === "unread").length;

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-xs font-bold text-gold-deep">IN-APP</p><h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">સૂચનાઓ</h1><p className="mt-2 text-sm text-muted-foreground">નવી ઇનબોક્સ અરજી તમારી role અને Ashram scope પ્રમાણે અહીં દેખાશે.</p></div>
      {unreadCount ? <form action={markAllNotificationsReadAction}><button className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-bold text-primary"><CheckCheck className="size-4" />બધી વાંચેલી કરો ({unreadCount})</button></form> : null}
    </div>

    <div className="mt-5 overflow-hidden rounded-2xl border border-[#dfd9d0] bg-white">
      {notifications.length ? notifications.map((item) => <article key={item.id} className={`border-b border-[#eee9e2] p-4 last:border-0 ${item.status === "unread" ? "bg-[#fffaf0]" : "bg-white"}`}>
        <div className="flex gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f3eee7] text-primary"><Bell className="size-4" /></div>
          <div className="min-w-0 flex-1">
            {item.href ? <Link href={item.href} className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"><p className="text-sm font-bold text-primary">{item.title}</p>{item.body ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.body}</p> : null}<p className="mt-1 text-[11px] text-[#9a8f85]">{new Intl.DateTimeFormat("gu-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.created_at))}</p></Link> : <><p className="text-sm font-bold text-primary">{item.title}</p>{item.body ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.body}</p> : null}<p className="mt-1 text-[11px] text-[#9a8f85]">{new Intl.DateTimeFormat("gu-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.created_at))}</p></>}
            <div className="mt-3 flex flex-wrap gap-2">
              <form action={setNotificationStatusAction}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="status" value={item.status === "unread" ? "read" : "unread"}/><button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-bold text-primary"><Mail className="size-3.5" />{item.status === "unread" ? "વાંચેલી" : "ન વાંચેલી"}</button></form>
              <form action={setNotificationStatusAction}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="status" value="archived"/><button className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-bold text-muted-foreground"><Archive className="size-3.5" />આર્કાઇવ</button></form>
            </div>
          </div>
        </div>
      </article>) : <p className="p-8 text-center text-sm text-muted-foreground">હજુ સૂચના નથી. નવી ઇનબોક્સ અરજી આવ્યા પછી scope પ્રમાણે અહીં દેખાશે.</p>}
    </div>
  </div>;
}
