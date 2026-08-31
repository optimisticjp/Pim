import Link from "next/link";
import { ArrowRight, Banknote, BarChart3, BedDouble, BookOpenText, FileText, FolderOpen, HeartHandshake, Inbox, Landmark, Radio, ShieldCheck, Users } from "lucide-react";

const links=[
["/admin/inbox","આવેલ અરજીઓ","બધી applications અને કામની queue",Inbox],
["/admin/reports","રિપોર્ટ અને Export","યાત્રિક, રસોડું, રૂમ, સભ્યો, cash અને CSV",BarChart3],
["/admin/members","સભ્યો અને પરિવાર","સભ્યપદ અરજી, પરિવાર અને અધિકૃત સભ્ય રેકોર્ડ",Users],
["/admin/programmes","સત્સંગ અને કાર્યક્રમો","બાળ શિબિર, circular, તિથિ, પૂનમ અને જાહેર કાર્યક્રમો",Radio],
["/admin/seva","સેવા અને સ્વયંસેવક","સેવા ક્ષેત્ર, પ્રવૃત્તિ અને volunteer queue",HeartHandshake],
["/admin/stays","ઉતારા અને રૂમ","રહેવાની અરજી, રૂમ, ખાનગી દસ્તાવેજ અને ભોજન",BedDouble],
["/admin/veda","વેદ રહસ્ય અને પ્રકાશનો","સભ્યપદ, subscriber services, લેખ અને PDF archive",BookOpenText],
["/admin/cash","નકદ અને રસીદ","Cash Pending, received cash અને સત્તાવાર receipts",Banknote],
["/admin/heritage","ગુરુ અને હેરિટેજ","ગુરુ પરંપરા chapters અને ઐતિહાસિક દસ્તાવેજ",BookOpenText],
["/admin/media","મીડિયા લાઇબ્રેરી","Audio, photo, PDF અને YouTube folder management",FolderOpen],
["/admin/ashrams","આશ્રમો","આશ્રમ માહિતી, સંપર્ક, નિયમો અને પ્રકાશન",Landmark],
["/admin/team","એડમિન ટીમ","Invite, admin અને verified Ashram scope/role વ્યવસ્થા",Users],
["/admin/roles","ભૂમિકા અને પરવાનગીઓ","View, edit, approve, archive વગેરે નિયંત્રણ",ShieldCheck],
["/admin/ops","સિસ્ટમ સુરક્ષા અને બેકઅપ","Private document retention, cleanup અને backup operations",ShieldCheck],
["/admin/audit","ઓડિટ લોગ","બદલાવનો ઇતિહાસ",FileText],] as const;

export default function AdminMorePage(){return <div><p className="text-xs font-bold text-gold-deep">MODULES & SETTINGS</p><h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">વધુ</h1><div className="mt-5 overflow-hidden rounded-2xl border border-[#dfd9d0] bg-white">{links.map(([href,title,subtitle,Icon])=><Link key={href} href={href} className="flex min-h-[4.8rem] items-center gap-3 border-b border-[#eee9e2] px-4 py-3 last:border-0"><div className="flex size-10 items-center justify-center rounded-xl bg-[#f3eee7] text-primary"><Icon className="size-[18px]"/></div><div className="min-w-0 flex-1"><p className="font-bold">{title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p></div><ArrowRight className="size-4 text-[#a99a8d]"/></Link>)}</div></div>}
