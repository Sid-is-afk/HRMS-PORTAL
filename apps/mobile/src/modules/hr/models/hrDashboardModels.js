/**
 * @typedef {Object} HRDashboardSummary
 * @property {number} openPositions
 * @property {number} candidates
 * @property {number} upcomingInterviews
 * @property {number} pendingOnboarding
 * @property {number} pendingConfirmations
 * @property {number} employeesOnProbation
 * @property {number} upcomingReviews
 * @property {number} expiringDocuments
 * @property {number} trainingStatus - Percentage completed or count
 * @property {number} recentActivitiesCount
 * @property {number} pendingWorkflowApprovals
 * @property {number} upcomingBirthdays
 * @property {number} upcomingWorkAnniversaries
 */

/**
 * @typedef {Object} HRTask
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} dueDate - ISO Date string
 * @property {string} status - PENDING, IN_PROGRESS, COMPLETED
 * @property {string} priority - LOW, MEDIUM, HIGH
 * @property {string} category - RECRUITMENT, ONBOARDING, PERFORMANCE, DOCUMENTS, TRAINING, SYSTEM
 */

/**
 * @typedef {Object} HRActivity
 * @property {string} id
 * @property {string} type - RECRUITMENT, ONBOARDING, PERFORMANCE, TRAINING, DOCUMENT, GENERAL
 * @property {string} description
 * @property {string} timestamp - ISO Date string
 * @property {string} performedBy
 */

/**
 * @typedef {Object} HRNotification
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {boolean} isRead
 * @property {string} createdAt - ISO Date string
 * @property {string} type - SYSTEM, WORKFLOW, ALERT
 */

/**
 * @typedef {Object} HRQuickAction
 * @property {string} id
 * @property {string} label
 * @property {string} icon
 * @property {string} route
 * @property {string} [permission] - RBAC permission required
 * @property {boolean} isConfigurable
 */

/**
 * @typedef {Object} HREvent
 * @property {string} id
 * @property {string} title
 * @property {string} date - ISO Date string
 * @property {string} type - BIRTHDAY, ANNIVERSARY, INTERVIEW, MEETING, TRAINING
 * @property {string} description
 * @property {string} associatedUser - Name or profile details
 */

/**
 * @typedef {Object} HRWidget
 * @property {string} id
 * @property {string} title
 * @property {boolean} visible
 * @property {number} order
 * @property {string} size - small, medium, large
 */

export {};
