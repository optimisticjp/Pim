import type { SVGProps } from "react";

export function YouTubeMark({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect
        x="2.5"
        y="5.5"
        width="19"
        height="13"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M10 9L15.5 12L10 15V9Z" fill="currentColor" />
    </svg>
  );
}
