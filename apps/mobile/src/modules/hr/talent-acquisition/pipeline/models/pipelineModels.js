/**
 * @typedef {Object} RecruiterNote
 * @property {string} id - UUID
 * @property {string} candidateId - Reference to Candidate
 * @property {string} authorName - Name of the recruiter/HR writing the note
 * @property {string} content - Note text content
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {('APPLIED' | 'SCREENING' | 'SHORTLISTED' | 'ASSESSMENT' | 'TECHNICAL_INTERVIEW' | 'MANAGER_INTERVIEW' | 'HR_INTERVIEW' | 'FINAL_REVIEW' | 'SELECTED' | 'REJECTED' | 'WITHDRAWN')} CandidateStage
 */

/**
 * @typedef {Object} Candidate
 * @property {string} id - UUID
 * @property {string} firstName - Candidate's first name
 * @property {string} lastName - Candidate's last name
 * @property {string} email - Candidate's email address
 * @property {string} phone - Candidate's phone number
 * @property {string[]} skills - List of skill tags
 * @property {number} experienceYears - Total years of professional experience
 * @property {string} education - Highest level of education (e.g. Master in CS)
 * @property {string} resumeMetadata - Plaintext description or resume filename (placeholder)
 * @property {string[]} tags - Custom tags (e.g. "React Specialist", "Referral")
 * @property {CandidateStage} stage - Active recruitment process stage
 * @property {string} status - ACTIVE, SELECTED, REJECTED, WITHDRAWN
 * @property {string} currentJobTitle - Associated job vacancy title
 * @property {string} recruiterId - Assigned recruiter employee ID
 * @property {string} recruiterName - Assigned recruiter display name
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} CandidateTimelineEvent
 * @property {string} id - UUID
 * @property {string} candidateId - Reference to Candidate
 * @property {string} type - CANDIDATE_CREATED, CANDIDATE_ADVANCED, INTERVIEW_SCHEDULED, INTERVIEW_COMPLETED, NOTE_ADDED, FEEDBACK_SUBMITTED, STATUS_CHANGED
 * @property {string} description - Detailed log text
 * @property {string} performedBy - Name of actor
 * @property {string} timestamp - ISO Date string
 */

/**
 * @typedef {Object} InterviewPanelMember
 * @property {string} employeeId - Employee ID
 * @property {string} name - Employee display name
 * @property {string} email - Employee email
 */

/**
 * @typedef {('SCREENING' | 'TECHNICAL' | 'MANAGER' | 'HR')} InterviewType
 */

/**
 * @typedef {('ONLINE' | 'IN_PERSON' | 'PHONE')} InterviewMode
 */

/**
 * @typedef {('PENDING' | 'COMPLETED' | 'CANCELLED')} InterviewStatus
 */

/**
 * @typedef {Object} Interview
 * @property {string} id - UUID
 * @property {string} candidateId - Link to Candidate UUID
 * @property {string} candidateName - Candidate display name
 * @property {string} jobTitle - Job vacancy title
 * @property {number} roundNumber - Sequence round (e.g., 1, 2, 3)
 * @property {InterviewType} type - Category of interview
 * @property {InterviewMode} mode - Meeting mode
 * @property {string} date - Meeting date (YYYY-MM-DD)
 * @property {string} time - Meeting time (HH:MM)
 * @property {InterviewPanelMember[]} panelMembers - Selected interviewers
 * @property {string} meetingLink - Meeting URL (placeholder)
 * @property {InterviewStatus} status - Lifecycle state
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} InterviewFeedback
 * @property {string} id - UUID
 * @property {string} interviewId - Reference to Interview
 * @property {string} interviewerName - Interviewer performing review
 * @property {number} score - Overall score rating (1 to 5)
 * @property {('HIRE' | 'NO_HIRE' | 'STRONG_HIRE' | 'STRONG_NO_HIRE' | 'HOLD')} recommendation - Choice
 * @property {string} comments - Evaluation notes
 * @property {string} submittedAt - ISO date string
 */

/**
 * @typedef {Object} Evaluation
 * @property {string} id - UUID
 * @property {string} candidateId - Reference to Candidate
 * @property {number} averageScore - Aggregated interview scores
 * @property {string} summary - Final recommendation summary text
 * @property {string} decision - SELECTED, REJECTED, HOLD
 * @property {string} evaluatedAt - ISO date string
 */

/**
 * @typedef {Object} PipelineStage
 * @property {CandidateStage} id - Stage identifier key
 * @property {string} label - Readable UI label
 * @property {string} color - Theme color mapping
 * @property {string} icon - Lucide icon name
 */

export {};
