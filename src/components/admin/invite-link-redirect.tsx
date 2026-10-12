"use client";

import { useEffect } from "react";

export function InviteLinkRedirect() {
  useEffect(() => {
    if (window.location.pathname === "/admin/setup") return;

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const inviteType = hash.get("type") === "invite" || query.get("type") === "invite";
    const hasInviteToken = Boolean(hash.get("access_token") || query.get("token_hash"));

    if (inviteType && hasInviteToken) {
      window.location.replace("/admin/setup" + window.location.search + window.location.hash);
    }
  }, []);

  return null;
}
