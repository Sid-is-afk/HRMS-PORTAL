/**
 * @typedef {Object} ApplicationSetting
 * @property {string} key
 * @property {string} category - e.g., 'general', 'localization', 'appearance'
 * @property {string} label
 * @property {any} value
 * @property {'string'|'number'|'boolean'|'json'} type
 */

/**
 * @typedef {Object} FeatureFlag
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {boolean} is_enabled
 * @property {string} category
 */

/**
 * @typedef {Object} AuditLog
 * @property {string} id
 * @property {string} action
 * @property {string} actor_id - Employee UUID
 * @property {string} target_id
 * @property {string} module - e.g., 'IAM', 'Workflow', 'System'
 * @property {string} created_at
 * @property {Object} details - JSON payload of the action
 */

/**
 * @typedef {Object} ActivityLog
 * @property {string} id
 * @property {string} description
 * @property {string} type - e.g., 'auth', 'config', 'attendance'
 * @property {string} timestamp
 */

/**
 * @typedef {Object} HealthMetric
 * @property {string} service_name
 * @property {'healthy'|'degraded'|'down'} status
 * @property {number} latency_ms
 * @property {string} last_checked
 */

export {};
