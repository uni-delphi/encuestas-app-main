// lib/permissions.ts
// Helper centralizado de permisos por rol

import { RoleType } from "@/generated/prisma";

// Jerarquía: ADMIN > RESEARCHER > USER
const ROLE_HIERARCHY: Record<RoleType, number> = {
  ADMIN: 3,
  RESEARCHER: 2,
  USER: 1,
};

/**
 * Verifica si un rol tiene al menos el nivel requerido.
 * Ejemplo: hasRole("RESEARCHER", "RESEARCHER") → true
 *          hasRole("USER", "RESEARCHER") → false
 *          hasRole("ADMIN", "RESEARCHER") → true
 */
export function hasRole(userRole: RoleType, requiredRole: RoleType): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Permisos específicos por entidad
 */
export const Permissions = {
  survey: {
    /** ADMIN y RESEARCHER pueden crear encuestas */
    canCreate: (role: RoleType) => hasRole(role, RoleType.RESEARCHER),

    /** ADMIN puede editar cualquier encuesta.
     *  RESEARCHER solo puede editar las suyas (verificar createdById en la app). */
    canEdit: (role: RoleType, isOwner: boolean) =>
      role === RoleType.ADMIN || (hasRole(role, RoleType.RESEARCHER) && isOwner),

    /** Solo ADMIN puede eliminar encuestas */
    canDelete: (role: RoleType) => role === RoleType.ADMIN,

    /** Todos pueden ver encuestas activas */
    canView: (_role: RoleType) => true,
  },

  response: {
    /** Cualquier usuario autenticado puede responder */
    canCreate: (role: RoleType) => hasRole(role, RoleType.USER),

    /** ADMIN puede ver todas las respuestas; RESEARCHER solo las de sus encuestas */
    canViewAll: (role: RoleType) => hasRole(role, RoleType.RESEARCHER),
  },

  user: {
    /** Solo ADMIN puede gestionar usuarios */
    canManage: (role: RoleType) => role === RoleType.ADMIN,
  },
} as const;