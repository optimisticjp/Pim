import { EventManager } from "@/components/admin/event-manager";
export const metadata = { title: "Manage Events" };
export default function AdminEventsPage(){ return <div className="mx-auto max-w-7xl"><div className="text-[12px] font-bold text-gold-deep">EVENT MANAGER</div><h1 className="mt-1 font-serif text-3xl font-bold text-primary">કાર્યક્રમો સંભાળો</h1><p className="mt-2 text-[13px] text-muted-foreground">Create/delete preview workflow browserમાં તરત અજમાવી શકાય.</p><div className="mt-7"><EventManager /></div></div>; }
