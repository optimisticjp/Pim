import { PublicationManager } from "@/components/admin/publication-manager";
export const metadata={title:"Manage Publications"};
export default function AdminPublicationsPage(){return <div className="mx-auto max-w-7xl"><div className="text-[12px] font-bold text-gold-deep">DIGITAL LIBRARY</div><h1 className="mt-1 font-serif text-3xl font-bold text-primary">પ્રકાશનો અને PDF</h1><p className="mt-2 text-[13px] text-muted-foreground">Veda Rahasya migrationને legacy hotlinksમાંથી R2-managed archiveમાં ફેરવવાનો admin base.</p><div className="mt-7"><PublicationManager/></div></div>}
