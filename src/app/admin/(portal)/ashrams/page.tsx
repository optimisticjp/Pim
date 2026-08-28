import { AshramManager } from "@/components/admin/ashram-manager";
export const metadata={title:"Manage Ashrams"};
export default function AdminAshramsPage(){return <div className="mx-auto max-w-7xl"><div className="text-[12px] font-bold text-gold-deep">BRANCH DIRECTORY</div><h1 className="mt-1 font-serif text-3xl font-bold text-primary">આશ્રમ શાખાઓ</h1><p className="mt-2 text-[13px] text-muted-foreground">Legacy directory coverage અને verified contact status એક જ viewમાં.</p><div className="mt-7"><AshramManager/></div></div>}
