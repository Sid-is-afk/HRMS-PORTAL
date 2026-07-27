/**
 * @typedef {Object} HiringManager
 * @property {string} id - Manager employee ID
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 */

/**
 * @typedef {Object} JobRequisition
 * @property {string} id - UUID
 * @property {string} title - Job Title
 * @property {string} departmentId - Department reference
 * @property {string} departmentName - Department display name
 * @property {string} hiringManagerId - Hiring Manager employee ID
 * @property {HiringManager} hiringManager - Hiring Manager details
 * @property {string} employmentType - FULL_TIME, PART_TIME, CONTRACT, INTERN
 * @property {string} locationId - Location reference
 * @property {string} locationName - Location display name
 * @property {string} priority - LOW, MEDIUM, HIGH
 * @property {number} openPositions - Number of slots to fill
 * @property {string[]} requiredSkills - Skill tags required
 * @property {number} experienceMin - Minimum years of experience
 * @property {number} experienceMax - Maximum years of experience
 * @property {number} [salaryMin] - Optional lower salary range (placeholder)
 * @property {number} [salaryMax] - Optional upper salary range (placeholder)
 * @property {string} approvalStatus - PENDING, APPROVED, REJECTED (Workflow status)
 * @property {string} status - ACTIVE, ARCHIVED, DEACTIVATED
 * @property {string} createdAt - ISO Date string
 */

/**
 * @typedef {Object} JobPosting
 * @property {string} id - UUID
 * @property {string} requisitionId - Job Requisition UUID link
 * @property {string} title - Job Title
 * @property {string} description - HTML/Text Markdown description
 * @property {string} type - INTERNAL, EXTERNAL
 * @property {string} status - DRAFT, PUBLISHED, PAUSED, CLOSED, ARCHIVED
 * @property {string} [expirationDate] - ISO Date string
 * @property {string} visibility - PUBLIC, PRIVATE
 * @property {string} createdAt - ISO Date string
 */

/**
 * @typedef {Object} HiringActivity
 * @property {string} id
 * @property {string} requisitionId
 * @property {string} type - REQUISITION_CREATED, REQUISITION_APPROVED, JOB_DRAFTED, JOB_PUBLISHED, JOB_CLOSED
 * @property {string} description
 * @property {string} timestamp - ISO Date string
 * @property {string} performedBy
 */

/**
 * @typedef {Object} HiringSummary
 * @property {number} openRequisitions
 * @property {number} publishedJobs
 * @property {number} pendingApprovals
 * @property {number} hiringManagersCount
 * @property {number} departmentsHiringCount
 * @property {number} upcomingActivitiesCount
 * @property {number} pendingTasksCount
 */

/**
 * @typedef {Object} RecruitmentFilter
 * @property {string} [departmentId]
 * @property {string} [hiringManagerId]
 * @property {string} [employmentType]
 * @property {string} [priority]
 * @property {string} [status]
 * @property {string} [search]
 */

export {};
