/**
 * @typedef {'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'CANCELLED'} ApprovalStatus
 */

/**
 * @typedef {Object} Approver
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} [role] - e.g. MANAGER, HR, ADMIN
 */

/**
 * @typedef {Object} WorkflowStep
 * @property {string} id
 * @property {number} sequence - Step number (1, 2, 3, etc.)
 * @property {string} name - e.g. Manager Review, HR Approval
 * @property {Approver[]} approvers
 * @property {ApprovalStatus} status
 * @property {string} [completedAt] - ISO Date String
 * @property {string} [completedBy] - Approver ID
 */

/**
 * @typedef {Object} Workflow
 * @property {string} id
 * @property {string} name
 * @property {string} type - e.g. LEAVE_APPROVAL, ATTENDANCE_REGULARIZATION
 * @property {WorkflowStep[]} steps
 * @property {ApprovalStatus} status
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ApprovalComment
 * @property {string} id
 * @property {string} authorName
 * @property {string} comment
 * @property {string} timestamp
 */

/**
 * @typedef {Object} ApprovalHistory
 * @property {string} id
 * @property {string} action - e.g. SUBMITTED, APPROVED, REJECTED, RETURNED
 * @property {string} performedBy
 * @property {string} timestamp
 * @property {string} [comment]
 */

/**
 * @typedef {Object} ApprovalRequest
 * @property {string} id
 * @property {string} requesterName
 * @property {string} requesterId
 * @property {string} module - e.g. LEAVE, ATTENDANCE, PROFILE
 * @property {string} details - JSON or readable summary
 * @property {Workflow} workflow
 * @property {ApprovalStatus} status
 * @property {string} createdAt
 * @property {ApprovalComment[]} comments
 * @property {ApprovalHistory[]} history
 */

/**
 * @typedef {Object} WorkflowTemplate
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} type
 * @property {number} totalSteps
 * @property {boolean} active
 */

/**
 * @typedef {Object} WorkflowConfiguration
 * @property {string} id
 * @property {string} name
 * @property {boolean} isSequential
 * @property {number} escalationHours
 */

export const TypesPlaceholder = {};
