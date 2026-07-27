/**
 * @typedef {Object} ExecutiveDashboardSummary
 * @property {number} totalOrganizations
 * @property {number} activeOrganizations
 * @property {number} dailyActiveUsers
 * @property {number} monthlyActiveUsers
 * @property {number} systemAvailability
 */

/**
 * @typedef {Object} TrendMetric
 * @property {string} id
 * @property {string} label
 * @property {number} value
 * @property {number} percentageChange
 * @property {string} trend - Up, Down, Flat
 */

/**
 * @typedef {Object} UsageMetric
 * @property {string} feature
 * @property {number} usageCount
 * @property {number} uniqueUsers
 */
