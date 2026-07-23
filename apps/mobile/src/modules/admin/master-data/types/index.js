/**
 * @typedef {Object} MasterCategory
 * @property {string} id - Unique identifier (e.g. 'employment-types', 'leave-types')
 * @property {string} name - Display name (e.g. 'Employment Types')
 * @property {string} description - Brief summary
 * @property {string} icon - Lucide icon identifier
 * @property {boolean} isReadonly - True if data is owned by another module (e.g. Organization) and consumed as reference
 * @property {number} count - Total reference values in category
 */

/**
 * @typedef {Object} ReferenceValue
 * @property {string} id - Unique primary key UUID or identifier
 * @property {string} code - Business key code (e.g. 'FULL_TIME', 'SICK_LEAVE')
 * @property {string} name - Human readable display name
 * @property {string} description - Additional metadata
 * @property {'ACTIVE' | 'INACTIVE' | 'ARCHIVED'} status - Reference status
 * @property {boolean} isSystem - True if standard seed data (read-only)
 * @property {Object} [metadata] - Custom field values or configurations
 */

/**
 * Specific Reference Types (extending ReferenceValue structure for consumption)
 * @typedef {ReferenceValue} EmploymentType
 * @typedef {ReferenceValue} LeaveType
 * @typedef {ReferenceValue} AttendanceStatus
 * @typedef {ReferenceValue} HolidayType
 * @typedef {ReferenceValue} DocumentType
 * @typedef {ReferenceValue} AssetCategory
 * @typedef {ReferenceValue} EducationLevel
 * @typedef {ReferenceValue} Nationality
 * @typedef {ReferenceValue} ReasonCode
 * @typedef {ReferenceValue} CustomField
 */

export const TypesPlaceholder = {};
