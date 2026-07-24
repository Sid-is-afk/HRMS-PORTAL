/**
 * @typedef {Object} Announcement
 * @property {string} id - UUID
 * @property {string} title
 * @property {string} content - Markdown or HTML string
 * @property {string} type_id - Reference to Master Data (Announcement, Notice, Reminder)
 * @property {string} status - DRAFT, SCHEDULED, PUBLISHED, ARCHIVED
 * @property {string} priority - LOW, NORMAL, HIGH, URGENT
 * @property {AudienceFilter} audience
 * @property {string} author_id - Employee UUID
 * @property {string} [scheduled_at] - ISO 8601 Timestamp
 * @property {string} [published_at] - ISO 8601 Timestamp
 * @property {string} [expires_at] - ISO 8601 Timestamp
 * @property {string} created_at
 */

/**
 * @typedef {Object} CommunicationTemplate
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} type_id
 * @property {string} subject_template
 * @property {string} body_template
 * @property {Array<string>} variables - e.g. ['{{employee_name}}', '{{department}}']
 */

/**
 * @typedef {Object} AudienceFilter
 * @property {boolean} all_employees
 * @property {Array<string>} [department_ids]
 * @property {Array<string>} [location_ids]
 * @property {Array<string>} [employment_types]
 * @property {Array<string>} [specific_employee_ids]
 */

export {};
