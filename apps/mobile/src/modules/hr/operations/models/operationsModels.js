/**
 * @typedef {Object} ServiceRequest
 * @property {string} id
 * @property {string} employee_id
 * @property {string} category - Employment Verification, Document Request, Policy Clarification
 * @property {string} priority - Low, Medium, High, Critical
 * @property {string} status - Open, In Progress, Resolved, Closed
 * @property {string} created_at
 */

/**
 * @typedef {Object} HRCase
 * @property {string} id
 * @property {string} title
 * @property {string} assignee_id
 * @property {string} status - New, Assigned, Escalated, Closed
 * @property {string} priority - Standard, Urgent
 */

/**
 * @typedef {Object} AutomationRule
 * @property {string} id
 * @property {string} name
 * @property {string} trigger
 * @property {string} action
 * @property {boolean} is_active
 */

/**
 * @typedef {Object} Reminder
 * @property {string} id
 * @property {string} title
 * @property {string} type - One-Time, Recurring
 * @property {string} due_date
 * @property {string} status - Pending, Sent
 */

/**
 * @typedef {Object} ApprovalQueueItem
 * @property {string} id
 * @property {string} source_module
 * @property {string} requested_by
 * @property {string} summary
 * @property {string} status - Pending
 */
