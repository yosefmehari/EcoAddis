import { redirect } from "next/navigation";
import { getSession, SessionPayload } from "./auth";
import { Role } from "@prisma/client";

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: Role[]): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    redirect("/unauthorized");
  }
  return session;
}

export function getDashboardPathForRole(role: Role): string {
  switch (role) {
    case "CUSTOMER":
      return "/customer";
    case "COLLECTOR":
      return "/collector";
    case "PARTNER":
      return "/partner";
    case "ADMIN":
      return "/admin";
    default:
      return "/";
  }
}
