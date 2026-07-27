/**
 * @typedef {Object} OperationsDashboardSummary
 * @property {number} healthyServices
 * @property {number} warningServices
 * @property {number} openIncidents
 * @property {number} pendingJobs
 * @property {number} uptimePercentage
 */

/**
 * @typedef {Object} ServiceHealth
 * @property {string} id
 * @property {string} name
 * @property {string} status - Healthy, Warning, Critical, Maintenance
 * @property {string} lastChecked
 * @property {number} responseTimeMs
 */

/**
 * @typedef {Object} Incident
 * @property {string} id
 * @property {string} title
 * @property {string} status - Open, Investigating, Resolved
 * @property {string} severity - Low, Medium, High, Critical
 * @property {string} createdAt
 * @property {string[]} affectedServices
 */

/**
 * @typedef {Object} PlatformLog
 * @property {string} id
 * @property {string} timestamp
 * @property {string} level - INFO, WARN, ERROR
 * @property {string} source - API, Worker, Auth
 * @property {string} message
 */
