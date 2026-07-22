/**
 * @typedef {'EMPLOYEE' | 'ADMIN' | 'HR' | 'SUPER_ADMIN'} Role
 */

/**
 * @typedef {'VIEW_EMPLOYEE' | 'CREATE_EMPLOYEE' | 'UPDATE_EMPLOYEE' | 'DELETE_EMPLOYEE' | 'VIEW_ATTENDANCE' | 'MANAGE_ATTENDANCE' | 'VIEW_LEAVE' | 'APPROVE_LEAVE' | 'VIEW_REPORTS' | 'MANAGE_DEPARTMENTS' | 'MANAGE_SHIFTS' | 'MANAGE_SETTINGS' | 'MANAGE_SYSTEM'} Permission
 */

/**
 * @typedef {Record<Role, Permission[]>} RolePermissionMap
 */

/**
 * @typedef {Object} NavigationNode
 * @property {string} name
 * @property {string} label
 * @property {string} icon
 * @property {string} [path]
 * @property {NavigationNode[]} [children]
 */

/**
 * @typedef {Object} SidebarItem
 * @property {string} name
 * @property {string} label
 * @property {string} icon
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} AuthorizationResult
 * @property {boolean} authorized
 * @property {string} [reason]
 */

export const TypesPlaceholder = {};
