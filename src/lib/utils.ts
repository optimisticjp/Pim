import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind-aware conflict resolution.
 *
 * `clsx` handles conditional/array/object class inputs, and `twMerge`
 * dedupes conflicting Tailwind utilities so the last one wins
 * (e.g. `cn("px-2", "px-4")` -> `"px-4"`).
 *
 * This is the same `cn` helper shadcn/ui and 21st.dev components expect
 * to import from `@/lib/utils`, so pasted components work unchanged.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
