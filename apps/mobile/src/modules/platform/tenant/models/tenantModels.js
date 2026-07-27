/**
 * @typedef {Object} TenantDashboardSummary
 * @property {number} totalTenants
 * @property {number} activeTenants
 * @property {number} provisioning
 * @property {number} suspended
 * @property {number} archived
 */

/**
 * @typedef {Object} Tenant
 * @property {string} id
 * @property {string} name
 * @property {string} orgCode
 * @property {string} status - Prospect, Provisioning, Active, Maintenance, Suspended, Archived, Deleted
 * @property {string} createdAt
 * @property {string} industry
 * @property {string} primaryContact
 */

/**
 * @typedef {Object} TenantLifecycleEvent
 * @property {string} id
 * @property {string} tenantId
 * @property {string} status
 * @property {string} timestamp
 * @property {string} actor
 * @property {string} notes
 */

/**
 * @typedef {Object} ProvisioningStep
 * @property {string} id
 * @property {string} name
 * @property {string} status - Pending, InProgress, Completed, Failed
 * @property {string} errorDetails
 */
