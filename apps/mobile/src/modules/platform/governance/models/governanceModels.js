/**
 * @typedef {Object} GovernanceDashboardSummary
 * @property {number} activeFeatures
 * @property {number} totalModules
 * @property {number} activeSubscriptions
 * @property {number} expiringLicenses
 */

/**
 * @typedef {Object} PlatformFeature
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {boolean} enabled
 * @property {string} category
 * @property {string} rolloutStage - Preview, Beta, GA, Deprecated
 */

/**
 * @typedef {Object} ModuleDefinition
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {boolean} isCore
 * @property {string} status - Available, Beta, Development
 */

/**
 * @typedef {Object} SubscriptionPlan
 * @property {string} id
 * @property {string} name
 * @property {number} userLimit
 * @property {number} storageLimitGb
 * @property {string[]} includedModules
 */
