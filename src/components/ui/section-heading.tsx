import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <div className={cn("eyebrow", align === "center" && "justify-center before:hidden")}>{eyebrow}</div>
      <h2 className="section-title mt-4 text-primary-strong">{title}</h2>
      {description ? <p className="body-large mt-5">{description}</p> : null}
    </div>
  );
}
