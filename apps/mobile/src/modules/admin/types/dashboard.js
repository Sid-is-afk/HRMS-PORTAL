/**
 * @typedef {Object} OrganizationStatistics
 * @property {number} totalEmployees
 * @property {number} activeEmployees
 * @property {number} onLeaveToday
 * @property {number} presentToday
 * @property {number} lateToday
 * @property {number} departmentsCount
 */

/**
 * @typedef {Object} SystemHealth
 * @property {string} status - 'Healthy' | 'Degraded' | 'Down'
 * @property {number} apiLatency - Latency in ms
 * @property {string} lastSyncTime - ISO date string
 * @property {boolean} isOnline
 */

/**
 * @typedef {Object} RecentActivity
 * @property {string} id
 * @property {string} type - 'ATTENDANCE' | 'LEAVE' | 'PROFILE' | 'SYSTEM'
 * @property {string} description
 * @property {string} timestamp - ISO date string
 * @property {string} performedBy - User who performed the action
 */

/**
 * @typedef {Object} QuickAction
 * @property {string} id
 * @property {string} label
 * @property {string} icon
 * @property {string} route
 * @property {string} permission
 */

/**
 * @typedef {Object} DashboardWidget
 * @property {string} id
 * @property {string} title
 * @property {boolean} visible
 * @property {number} order
 * @property {string} size - 'small' | 'medium' | 'large'
 */

/**
 * @typedef {Object} Announcement
 * @property {string} id
 * @property {string} title
 * @property {string} date - ISO date string
 * @property {string} summary
 * @property {string} author
 */

/**
 * @typedef {Object} DashboardSummary
 * @property {OrganizationStatistics} stats
 * @property {SystemHealth} system
 * @property {RecentActivity[]} activities
 * @property {Announcement[]} announcements
 * @property {QuickAction[]} quickActions
 */

export const TypesPlaceholder = {};
