/**
 * @typedef {Object} PlatformDashboardSummary
 * @property {number} totalOrganizations
 * @property {number} activeOrganizations
 * @property {number} inactiveOrganizations
 * @property {number} platformUsers
 * @property {string} systemHealth - e.g., 'Healthy', 'Degraded', 'Offline'
 * @property {string} apiHealth - e.g., 'Operational'
 * @property {string} platformVersion
 */

/**
 * @typedef {Object} PlatformActivity
 * @property {string} id
 * @property {string} description
 * @property {string} timestamp
 * @property {string} severity
 */

/**
 * @typedef {Object} PlatformNotification
 * @property {string} id
 * @property {string} title
 * @property {string} message
 * @property {string} date
 * @property {boolean} read
 * @property {string} type - e.g., 'Update', 'Alert', 'System'
 */

/**
 * @typedef {Object} PlatformQuickAction
 * @property {string} id
 * @property {string} label
 * @property {string} route
 * @property {string} iconName
 */
