import { PublicFormTurnstileEnhancer } from "@/components/forms/public-form-turnstile-enhancer";
import { Footer } from "@/components/layout/footer";
import { MobileQuickNav } from "@/components/layout/mobile-quick-nav";
import { Navbar } from "@/components/layout/navbar";
import { SacredTopline } from "@/components/layout/sacred-topline";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SacredTopline />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MobileQuickNav />
      <PublicFormTurnstileEnhancer />
    </div>
  );
}
