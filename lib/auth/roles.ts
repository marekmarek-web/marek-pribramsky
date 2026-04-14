/** Role values stored in public.profiles.role (synced with DB check constraint). */
export type UserRole = "admin" | "editor";

function normalizeRole(role: string | undefined | null): string | undefined {
  if (role == null) return undefined;
  const t = role.trim();
  return t === "" ? undefined : t;
}

export function isCmsStaffRole(role: string | undefined | null): role is UserRole {
  const r = normalizeRole(role);
  return r === "admin" || r === "editor";
}

export function canManageBlog(role: string | undefined | null): boolean {
  return isCmsStaffRole(role);
}

export function isAdminRole(role: string | undefined | null): boolean {
  return normalizeRole(role) === "admin";
}
