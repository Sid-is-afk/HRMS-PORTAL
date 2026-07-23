/**
 * @typedef {Object} Permission
 * @property {string} code - Unique permission code (e.g. VIEW_ROLE)
 * @property {string} name - Human readable name (e.g. View Roles)
 * @property {string} description - Brief description of what the permission allows
 * @property {string} category - Category grouping (e.g. IAM, Employee, Workflow)
 */

/**
 * @typedef {Object} Role
 * @property {string} id - Unique UUID identifier
 * @property {string} name - Name of the role (e.g. Finance Admin)
 * @property {string} code - Code for role (e.g. ROLE_FINANCE_ADMIN)
 * @property {string} description - Role purpose description
 * @property {'ACTIVE' | 'INACTIVE' | 'ARCHIVED'} status - Operational status
 * @property {boolean} isCustom - True if created by tenant/admin
 * @property {string} [parentRoleId] - Direct ancestor in role hierarchy
 * @property {string[]} permissions - List of permission codes assigned to this role
 * @property {string} createdAt - Creation ISO timestamp
 * @property {string} updatedAt - Last updated ISO timestamp
 */

/**
 * @typedef {Object} PermissionGroup
 * @property {string} id - Unique ID (category identifier)
 * @property {string} name - Display name of the group
 * @property {string} description - Group purpose description
 * @property {Permission[]} permissions - List of permissions in this group
 */

/**
 * @typedef {Object} RoleAssignment
 * @property {string} id - Assignment UUID
 * @property {string} employeeId - ID of the employee
 * @property {string} employeeName - Display name of employee
 * @property {string} employeeEmail - Email of employee
 * @property {string} roleId - Assigned role UUID
 * @property {string} roleName - Assigned role name
 * @property {string} assignedAt - Date assignment occurred
 * @property {string} assignedBy - Actor who performed assignment
 */

/**
 * @typedef {Object} AccessPolicy
 * @property {string} id - Unique UUID
 * @property {string} name - Policy name
 * @property {string} description - Policy description
 * @property {number} priority - Application priority (higher overrides lower)
 * @property {Object} conditions - Dynamic rules (e.g., Office IP Range, Work hours)
 * @property {'ACTIVE' | 'INACTIVE'} status - Policy activation state
 */

/**
 * @typedef {Object} PermissionMatrix
 * @property {Object.<string, Object.<string, boolean>>} matrix - Nested map of roleCode -> permissionCode -> isAssigned
 */

/**
 * @typedef {Object} EffectivePermission
 * @property {string} code - Permission code
 * @property {string} name - Permission name
 * @property {string} description - Permission description
 * @property {boolean} granted - Whether granted or not
 * @property {string[]} sources - Roles/policies that grant this permission
 */

/**
 * @typedef {Object} RoleHierarchyNode
 * @property {string} id - Role ID
 * @property {string} name - Role name
 * @property {string} code - Role code
 * @property {RoleHierarchyNode[]} children - Sub-roles inheriting permissions
 */

export const TypesPlaceholder = {};
