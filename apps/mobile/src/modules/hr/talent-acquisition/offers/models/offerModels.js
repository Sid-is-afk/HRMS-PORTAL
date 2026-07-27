/**
 * @typedef {Object} CompensationSummary
 * @property {number} base_salary
 * @property {number} bonus
 * @property {number} equity
 * @property {string} currency
 */

/**
 * @typedef {Object} Offer
 * @property {string} id
 * @property {string} candidate_id
 * @property {string} candidate_name
 * @property {string} requisition_id
 * @property {string} job_title
 * @property {string} department
 * @property {string} location
 * @property {string} employment_type
 * @property {CompensationSummary} compensation
 * @property {string} joining_date
 * @property {string} reporting_manager
 * @property {number} validity_days
 * @property {string} status - Draft, Pending Approval, Approved, Sent, Accepted, Declined, Expired, Withdrawn
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} HiringDecision
 * @property {string} id
 * @property {string} candidate_id
 * @property {string} requisition_id
 * @property {string} decision - Approve, Reject, Hold, Escalate
 * @property {string} notes
 * @property {string} decided_by
 * @property {string} decided_at
 */

/**
 * @typedef {Object} OfferActivity
 * @property {string} id
 * @property {string} offer_id
 * @property {string} action
 * @property {string} actor
 * @property {string} timestamp
 */
