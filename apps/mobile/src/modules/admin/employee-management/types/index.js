/**
 * @typedef {Object} Department
 * @property {string} id
 * @property {string} name
 * @property {string} code
 */

/**
 * @typedef {Object} Designation
 * @property {string} id
 * @property {string} title
 * @property {string} departmentId
 */

/**
 * @typedef {Object} Manager
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 */

/**
 * @typedef {'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'ON_LEAVE'} EmployeeStatus
 */

/**
 * @typedef {'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'} EmploymentType
 */

/**
 * @typedef {Object} EmploymentDetails
 * @property {string} employeeId
 * @property {EmploymentType} type
 * @property {string} joiningDate - ISO Date string
 * @property {Department} department
 * @property {Designation} designation
 * @property {Manager} [manager]
 * @property {string} [role] - User role (e.g. EMPLOYEE, ADMIN)
 */

/**
 * @typedef {Object} EmergencyContact
 * @property {string} name
 * @property {string} relationship
 * @property {string} phone
 */

/**
 * @typedef {Object} ReportingStructure
 * @property {Manager} manager
 * @property {Manager[]} directReports
 */

/**
 * @typedef {Object} Employee
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone
 * @property {EmployeeStatus} status
 * @property {EmploymentDetails} employment
 * @property {EmergencyContact} emergencyContact
 * @property {string} [photoUrl]
 */

/**
 * @typedef {Object} EmployeeSummary
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} employeeId
 * @property {string} departmentName
 * @property {string} designationTitle
 * @property {EmployeeStatus} status
 */

/**
 * @typedef {Object} EmployeeStatistics
 * @property {number} total
 * @property {number} active
 * @property {number} inactive
 * @property {number} onLeave
 * @property {Record<string, number>} departmentDistribution
 */

export const TypesPlaceholder = {};
