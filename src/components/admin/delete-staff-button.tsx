"use client";

import { Trash2 } from "lucide-react";

import { deleteAdminAction } from "@/app/admin/team-actions";

export function DeleteStaffButton({ adminId, displayName }: { adminId: string; displayName: string }) {
  return (
    <form
      action={deleteAdminAction}
      onSubmit={(event) => {
        if (!window.confirm(displayName + " ને કાયમ માટે સ્ટાફમાંથી દૂર કરશો? તેમનું લૉગિન તરત બંધ થઈ જશે.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="admin_id" value={adminId} />
      <button className="flex min-h-10 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-800" type="submit">
        <Trash2 className="size-3.5" /> દૂર કરો
      </button>
    </form>
  );
}
