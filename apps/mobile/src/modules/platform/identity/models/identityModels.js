/**
 * @typedef {Object} IdentityDashboardSummary
 * @property {number} activeUsers
 * @property {number} globalRoles
 * @property {number} activeSessions
 * @property {number} suspiciousLogins
 */

/**
 * @typedef {Object} PlatformUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {string} status - Active, Suspended
 * @property {string} lastLogin
 */

/**
 * @typedef {Object} PlatformRole
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} assignedUsers
 * @property {string} status
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {string} device
 * @property {string} ipAddress
 * @property {string} startedAt
 * @property {string} status - Active, Revoked
 */
