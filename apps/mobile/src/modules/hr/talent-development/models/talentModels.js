/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} employee_id
 * @property {string} title
 * @property {string} description
 * @property {number} progress_percentage
 * @property {string} status - Not Started, In Progress, Completed, At Risk
 * @property {string} due_date
 */

/**
 * @typedef {Object} LearningCourse
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {number} duration_minutes
 * @property {boolean} is_mandatory
 * @property {string} status - Not Started, In Progress, Completed
 * @property {number} completion_percentage
 */

/**
 * @typedef {Object} ComplianceRecord
 * @property {string} id
 * @property {string} requirement_name
 * @property {string} status - Compliant, Expiring Soon, Non-Compliant
 * @property {string} expiry_date
 */
