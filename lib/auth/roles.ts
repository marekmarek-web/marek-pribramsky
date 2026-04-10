/** Role values stored in public.profiles.role (synced with DB check constraint). */
export type UserRole = "admin" | "editor";

export function isCmsStaffRole(role: string | undefined | null): role is UserRole {
  return role === "admin" || role === "editor";
}

export function canManageBlog(role: string | undefined | null): boolean {
  return isCmsStaffRole(role);
}

export function isAdminRole(role: string | undefined | null): boolean {
  return role === "admin";
}
