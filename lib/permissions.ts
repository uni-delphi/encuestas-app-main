// lib/permissions.ts
// Helper centralizado de permisos por rol

import { RoleType } from "@/generated/prisma";

// Jerarquía: ADMIN > RESEARCHER > USER
export const ROLE_HIERARCHY: Record<RoleType, number> = {
  ADMIN:      3,
  RESEARCHER: 2,
  USER:       1,
};

/**
 * Verifica si un rol tiene al menos el nivel requerido.
 * hasRole("RESEARCHER", "RESEARCHER") → true
 * hasRole("USER", "RESEARCHER")       → false
 * hasRole("ADMIN", "RESEARCHER")      → true
 */
export function hasRole(userRole: RoleType, requiredRole: RoleType): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const Permissions = {
  survey: {
    /** ADMIN y RESEARCHER pueden crear encuestas */
    canCreate: (role: RoleType) =>
      hasRole(role, RoleType.RESEARCHER),

    /** ADMIN edita cualquier encuesta. RESEARCHER solo las suyas. */
    canEdit: (role: RoleType, isOwner: boolean) =>
      role === RoleType.ADMIN || (hasRole(role, RoleType.RESEARCHER) && isOwner),

    /** ADMIN elimina cualquier encuesta */
    canDelete: (role: RoleType) =>
      role === RoleType.ADMIN,

    /** ADMIN cierra cualquier encuesta. RESEARCHER solo las suyas. */
    canClose: (role: RoleType, isOwner: boolean) =>
      role === RoleType.ADMIN || (hasRole(role, RoleType.RESEARCHER) && isOwner),

    /** Todos los autenticados pueden ver encuestas activas */
    canView: (_role: RoleType) => true,

    /** ADMIN ve todos los resultados. RESEARCHER solo los de sus encuestas. */
    canViewResults: (role: RoleType, isOwner: boolean) =>
      role === RoleType.ADMIN || (hasRole(role, RoleType.RESEARCHER) && isOwner),

    /** Solo USER puede responder — evita contaminar datos */
    canAnswer: (role: RoleType) =>
      role === RoleType.USER,
  },

  user: {
    /** Solo ADMIN puede gestionar usuarios */
    canManage: (role: RoleType) =>
      role === RoleType.ADMIN,
  },
} as const;