import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Candidates
let mockCandidates = [
  {
    id: 'cand-1',
    firstName: 'Neha',
    lastName: 'Sen',
    email: 'neha.sen@gmail.com',
    phone: '9876543210',
    skills: ['React Native', 'TypeScript', 'Redux Toolkit', 'UI/UX Styling'],
    experienceYears: 4.5,
    education: 'B.Tech in Computer Science',
    resumeMetadata: 'neha_sen_resume_v2.pdf',
    tags: ['Frontend Specialist', 'Referral'],
    stage: 'TECHNICAL_INTERVIEW',
    status: 'ACTIVE',
    currentJobTitle: 'Senior Software Engineer (React Native)',
    recruiterId: 'emp-mgr2',
    recruiterName: 'Kriti Sen',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'cand-2',
    firstName: 'Aarav',
    lastName: 'Patel',
    email: 'aarav.patel@gmail.com',
    phone: '9988776655',
    skills: ['JavaScript', 'React Native', 'REST APIs', 'Git'],
    experienceYears: 2,
    education: 'MCA, Pune University',
    resumeMetadata: 'aarav_patel_cv.pdf',
    tags: ['Fresh Graduate Alternative'],
    stage: 'APPLIED',
    status: 'ACTIVE',
    currentJobTitle: 'Senior Software Engineer (React Native)',
    recruiterId: 'emp-mgr2',
    recruiterName: 'Kriti Sen',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'cand-3',
    firstName: 'Vikas',
    lastName: 'Kumar',
    email: 'vikas.kumar@outlook.com',
    phone: '9822334455',
    skills: ['Figma', 'UI Design', 'Design Systems', 'Wireframing'],
    experienceYears: 5,
    education: 'Bachelor of Design, NID',
    resumeMetadata: 'vikas_kumar_portfolio.pdf',
    tags: ['Highly Creative', 'Short Notice'],
    stage: 'SCREENING',
    status: 'ACTIVE',
    currentJobTitle: 'Product Designer',
    recruiterId: 'emp-mgr2',
    recruiterName: 'Kriti Sen',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'cand-4',
    firstName: 'Meera',
    lastName: 'Nair',
    email: 'meera.nair@yahoo.com',
    phone: '9123456789',
    skills: ['Recruitment Sourcing', 'Employee Relations', 'HR Policies', 'Excel'],
    experienceYears: 3,
    education: 'MBA in HR, Symbiosis',
    resumeMetadata: 'meera_nair_profile.pdf',
    tags: ['Excellent Communication'],
    stage: 'SELECTED',
    status: 'SELECTED',
    currentJobTitle: 'HR Specialist',
    recruiterId: 'emp-mgr1',
    recruiterName: 'Sanjay Kumar',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'cand-5',
    firstName: 'Rohan',
    lastName: 'Joshi',
    email: 'rohan.joshi@gmail.com',
    phone: '9334455667',
    skills: ['Product Strategy', 'Product Analytics', 'Agile/Scrum'],
    experienceYears: 6,
    education: 'B.E. + MBA',
    resumeMetadata: 'rohan_joshi_product_mgr.pdf',
    tags: ['Ex-Startup founder'],
    stage: 'REJECTED',
    status: 'REJECTED',
    currentJobTitle: 'Product Manager',
    recruiterId: 'emp-mgr1',
    recruiterName: 'Sanjay Kumar',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'cand-6',
    firstName: 'Ishita',
    lastName: 'Sharma',
    email: 'ishita.sharma@gmail.com',
    phone: '9556677889',
    skills: ['Figma', 'User Research', 'Mobile App UX', 'Prototyping'],
    experienceYears: 4,
    education: 'B.Des, NIFT',
    resumeMetadata: 'ishita_sharma_ux_resume.pdf',
    tags: ['Figma Expert'],
    stage: 'MANAGER_INTERVIEW',
    status: 'ACTIVE',
    currentJobTitle: 'Product Designer',
    recruiterId: 'emp-mgr2',
    recruiterName: 'Kriti Sen',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  }
];

// Mock Notes
let mockNotes = [
  {
    id: 'note-1',
    candidateId: 'cand-1',
    authorName: 'Kriti Sen',
    content: 'Strong technical background in React Native. Solved code challenge efficiently.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'note-2',
    candidateId: 'cand-1',
    authorName: 'Sanjay Kumar',
    content: 'Good cultural fit. Ready for final assessment round.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'note-3',
    candidateId: 'cand-3',
    authorName: 'Kriti Sen',
    content: 'Portfolio looks extremely polished, screening is complete.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  }
];

// Mock Timeline Events
let mockTimelineEvents = [
  {
    id: 'time-1',
    candidateId: 'cand-1',
    type: 'CANDIDATE_CREATED',
    description: 'Candidate profile parsed from neha_sen_resume_v2.pdf',
    performedBy: 'System Parser',
    timestamp: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'time-2',
    candidateId: 'cand-1',
    type: 'CANDIDATE_ADVANCED',
    description: 'Advanced stage from Applied to Screening',
    performedBy: 'Kriti Sen',
    timestamp: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'time-3',
    candidateId: 'cand-1',
    type: 'CANDIDATE_ADVANCED',
    description: 'Advanced stage from Screening to Assessment',
    performedBy: 'Kriti Sen',
    timestamp: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'time-4',
    candidateId: 'cand-1',
    type: 'INTERVIEW_SCHEDULED',
    description: 'Technical Interview round scheduled for July 29, 2026',
    performedBy: 'Kriti Sen',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
  }
];

// Mock Interviews
let mockInterviews = [
  {
    id: 'int-1',
    candidateId: 'cand-1',
    candidateName: 'Neha Sen',
    jobTitle: 'Senior Software Engineer (React Native)',
    roundNumber: 2,
    type: 'TECHNICAL',
    mode: 'ONLINE',
    date: '2026-07-29',
    time: '14:30',
    panelMembers: [
      { employeeId: 'emp-tech1', name: 'Ramesh Babu', email: 'ramesh.babu@company.com' },
      { employeeId: 'emp-tech2', name: 'Suresh Kumar', email: 'suresh.kumar@company.com' }
    ],
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'int-2',
    candidateId: 'cand-3',
    candidateName: 'Vikas Kumar',
    jobTitle: 'Product Designer',
    roundNumber: 1,
    type: 'SCREENING',
    mode: 'PHONE',
    date: '2026-07-27',
    time: '11:00',
    panelMembers: [
      { employeeId: 'emp-hr1', name: 'Kriti Sen', email: 'kriti.sen@company.com' }
    ],
    meetingLink: '',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'int-3',
    candidateId: 'cand-6',
    candidateName: 'Ishita Sharma',
    jobTitle: 'Product Designer',
    roundNumber: 2,
    type: 'MANAGER',
    mode: 'ONLINE',
    date: '2026-07-28',
    time: '16:00',
    panelMembers: [
      { employeeId: 'emp-mgr1', name: 'Sanjay Kumar', email: 'sanjay.kumar@company.com' }
    ],
    meetingLink: 'https://meet.google.com/xyz-pdqr-lmn',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  }
];

// Mock Interview Feedbacks
let mockFeedbacks = [
  {
    id: 'feed-1',
    interviewId: 'int-2',
    interviewerName: 'Kriti Sen',
    score: 4,
    recommendation: 'HIRE',
    comments: 'Excellent communication. Candidates has a great design portfolio, standard screening passes.',
    submittedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  }
];

export const pipelineService = {
  getCandidates: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let results = [...mockCandidates];

      if (filters.stage && filters.stage !== 'all') {
        results = results.filter(c => c.stage === filters.stage);
      }
      if (filters.status && filters.status !== 'all') {
        results = results.filter(c => c.status === filters.status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        results = results.filter(
          c =>
            c.firstName.toLowerCase().includes(query) ||
            c.lastName.toLowerCase().includes(query) ||
            c.currentJobTitle.toLowerCase().includes(query)
        );
      }
      if (filters.experienceMin) {
        results = results.filter(c => c.experienceYears >= parseFloat(filters.experienceMin));
      }
      if (filters.skill) {
        const searchSkill = filters.skill.toLowerCase();
        results = results.filter(c => c.skills.some(s => s.toLowerCase().includes(searchSkill)));
      }

      return results;
    }
    const response = await apiClient.get('/hr/recruitment/candidates', { params: filters });
    return response?.data || response;
  },

  getCandidate: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const candidate = mockCandidates.find(c => c.id === id);
      if (!candidate) throw new Error('Candidate not found');
      
      const notes = mockNotes.filter(n => n.candidateId === id);
      const timeline = mockTimelineEvents.filter(t => t.candidateId === id);
      const interviews = mockInterviews.filter(i => i.candidateId === id);
      
      return {
        ...candidate,
        notes,
        timeline,
        interviews,
      };
    }
    const response = await apiClient.get(`/hr/recruitment/candidates/${id}`);
    return response?.data || response;
  },

  createCandidate: async (data) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const newCand = {
        id: `cand-${Math.random().toString(36).substr(2, 9)}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        skills: data.skills || [],
        experienceYears: data.experienceYears || 0,
        education: data.education || '',
        resumeMetadata: data.resumeMetadata || 'uploaded_resume.pdf',
        tags: data.tags || [],
        stage: 'APPLIED',
        status: 'ACTIVE',
        currentJobTitle: data.currentJobTitle,
        recruiterId: 'emp-mgr2',
        recruiterName: 'Kriti Sen',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockCandidates.unshift(newCand);
      
      mockTimelineEvents.unshift({
        id: `time-${Math.random().toString(36).substr(2, 9)}`,
        candidateId: newCand.id,
        type: 'CANDIDATE_CREATED',
        description: `Candidate profile created for ${newCand.firstName} ${newCand.lastName}`,
        performedBy: 'Kriti Sen',
        timestamp: new Date().toISOString(),
      });

      return newCand;
    }
    const response = await apiClient.post('/hr/recruitment/candidates', data);
    return response?.data || response;
  },

  updateCandidateStage: async (id, stage) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const idx = mockCandidates.findIndex(c => c.id === id);
      if (idx === -1) throw new Error('Candidate not found');
      const oldStage = mockCandidates[idx].stage;
      mockCandidates[idx].stage = stage;
      mockCandidates[idx].updatedAt = new Date().toISOString();

      mockTimelineEvents.unshift({
        id: `time-${Math.random().toString(36).substr(2, 9)}`,
        candidateId: id,
        type: 'CANDIDATE_ADVANCED',
        description: `Stage updated from ${oldStage} to ${stage}`,
        performedBy: 'HR Recruiter',
        timestamp: new Date().toISOString(),
      });

      return mockCandidates[idx];
    }
    const response = await apiClient.put(`/hr/recruitment/candidates/${id}/stage`, { stage });
    return response?.data || response;
  },

  scheduleInterview: async (candidateId, data) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const candidate = mockCandidates.find(c => c.id === candidateId);
      if (!candidate) throw new Error('Candidate not found');

      const newInterview = {
        id: `int-${Math.random().toString(36).substr(2, 9)}`,
        candidateId,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        jobTitle: candidate.currentJobTitle,
        roundNumber: data.roundNumber || 1,
        type: data.type,
        mode: data.mode,
        date: data.date,
        time: data.time,
        panelMembers: data.panelMembers || [],
        meetingLink: data.mode === 'ONLINE' ? 'https://meet.google.com/mock-link' : '',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      
      mockInterviews.unshift(newInterview);

      mockTimelineEvents.unshift({
        id: `time-${Math.random().toString(36).substr(2, 9)}`,
        candidateId,
        type: 'INTERVIEW_SCHEDULED',
        description: `${data.type} interview (Round ${data.roundNumber}) scheduled on ${data.date} at ${data.time}`,
        performedBy: 'HR Recruiter',
        timestamp: new Date().toISOString(),
      });

      return newInterview;
    }
    const response = await apiClient.post(`/hr/recruitment/candidates/${candidateId}/interviews`, data);
    return response?.data || response;
  },

  rescheduleInterview: async (interviewId, newTimeData) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const idx = mockInterviews.findIndex(i => i.id === interviewId);
      if (idx === -1) throw new Error('Interview slot not found');
      
      mockInterviews[idx].date = newTimeData.date;
      mockInterviews[idx].time = newTimeData.time;

      mockTimelineEvents.unshift({
        id: `time-${Math.random().toString(36).substr(2, 9)}`,
        candidateId: mockInterviews[idx].candidateId,
        type: 'INTERVIEW_SCHEDULED',
        description: `Interview rescheduled to ${newTimeData.date} at ${newTimeData.time}`,
        performedBy: 'HR Recruiter',
        timestamp: new Date().toISOString(),
      });

      return mockInterviews[idx];
    }
    const response = await apiClient.put(`/hr/recruitment/interviews/${interviewId}/reschedule`, newTimeData);
    return response?.data || response;
  },

  cancelInterview: async (interviewId) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const idx = mockInterviews.findIndex(i => i.id === interviewId);
      if (idx === -1) throw new Error('Interview slot not found');

      mockInterviews[idx].status = 'CANCELLED';

      mockTimelineEvents.unshift({
        id: `time-${Math.random().toString(36).substr(2, 9)}`,
        candidateId: mockInterviews[idx].candidateId,
        type: 'STATUS_CHANGED',
        description: `Interview round cancelled`,
        performedBy: 'HR Recruiter',
        timestamp: new Date().toISOString(),
      });

      return mockInterviews[idx];
    }
    const response = await apiClient.post(`/hr/recruitment/interviews/${interviewId}/cancel`);
    return response?.data || response;
  },

  submitInterviewFeedback: async (interviewId, data) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const interview = mockInterviews.find(i => i.id === interviewId);
      if (!interview) throw new Error('Interview slot not found');

      const newFeedback = {
        id: `feed-${Math.random().toString(36).substr(2, 9)}`,
        interviewId,
        interviewerName: data.interviewerName || 'HR Assessor',
        score: data.score,
        recommendation: data.recommendation,
        comments: data.comments,
        submittedAt: new Date().toISOString(),
      };
      
      mockFeedbacks.push(newFeedback);
      
      // Update interview status to completed
      interview.status = 'COMPLETED';

      mockTimelineEvents.unshift({
        id: `time-${Math.random().toString(36).substr(2, 9)}`,
        candidateId: interview.candidateId,
        type: 'INTERVIEW_COMPLETED',
        description: `Interview round completed. Rating: ${data.score}/5, Recommendation: ${data.recommendation}`,
        performedBy: 'HR Assessor',
        timestamp: new Date().toISOString(),
      });

      return newFeedback;
    }
    const response = await apiClient.post(`/hr/recruitment/interviews/${interviewId}/feedback`, data);
    return response?.data || response;
  },

  addCandidateNote: async (candidateId, noteText) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const newNote = {
        id: `note-${Math.random().toString(36).substr(2, 9)}`,
        candidateId,
        authorName: 'HR Agent',
        content: noteText,
        createdAt: new Date().toISOString(),
      };
      mockNotes.unshift(newNote);

      mockTimelineEvents.unshift({
        id: `time-${Math.random().toString(36).substr(2, 9)}`,
        candidateId,
        type: 'NOTE_ADDED',
        description: 'New recruiter note appended.',
        performedBy: 'HR Agent',
        timestamp: new Date().toISOString(),
      });

      return newNote;
    }
    const response = await apiClient.post(`/hr/recruitment/candidates/${candidateId}/notes`, { content: noteText });
    return response?.data || response;
  },

  getPipeline: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      // Group candidate list by stages
      const stages = [
        { id: 'APPLIED', label: 'Applied', color: '#6B7280', icon: 'file-import-outline' },
        { id: 'SCREENING', label: 'Screening', color: '#3B82F6', icon: 'account-search-outline' },
        { id: 'SHORTLISTED', label: 'Shortlisted', color: '#10B981', icon: 'account-check-outline' },
        { id: 'ASSESSMENT', label: 'Assessment', color: '#F59E0B', icon: 'laptop-mac' },
        { id: 'TECHNICAL_INTERVIEW', label: 'Tech Interview', color: '#7C3AED', icon: 'xml' },
        { id: 'MANAGER_INTERVIEW', label: 'Mgr Interview', color: '#EC4899', icon: 'account-tie-voice' },
        { id: 'HR_INTERVIEW', label: 'HR Interview', color: '#14B8A6', icon: 'wechat' },
        { id: 'FINAL_REVIEW', label: 'Final Review', color: '#8B5CF6', icon: 'text-box-search-outline' },
        { id: 'SELECTED', label: 'Selected', color: '#059669', icon: 'emoticon-happy-outline' },
        { id: 'REJECTED', label: 'Rejected', color: '#DC2626', icon: 'close-circle-outline' },
        { id: 'WITHDRAWN', label: 'Withdrawn', color: '#6B7280', icon: 'logout-variant' },
      ];

      return stages.map(st => {
        const candidates = mockCandidates.filter(c => c.stage === st.id);
        return {
          ...st,
          candidates,
        };
      });
    }
    const response = await apiClient.get('/hr/recruitment/pipeline');
    return response?.data || response;
  },

  getInterviewDashboard: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const pendingFeedbackCount = mockInterviews.filter(i => i.status === 'COMPLETED' && !mockFeedbacks.some(f => f.interviewId === i.id)).length;
      
      return {
        activeCandidates: mockCandidates.filter(c => c.status === 'ACTIVE').length,
        candidatesByStage: {
          Applied: mockCandidates.filter(c => c.stage === 'APPLIED').length,
          Screening: mockCandidates.filter(c => c.stage === 'SCREENING').length,
          Shortlisted: mockCandidates.filter(c => c.stage === 'SHORTLISTED').length,
          Assessment: mockCandidates.filter(c => c.stage === 'ASSESSMENT').length,
          TechRound: mockCandidates.filter(c => c.stage === 'TECHNICAL_INTERVIEW').length,
          MgrRound: mockCandidates.filter(c => c.stage === 'MANAGER_INTERVIEW').length,
          HRRound: mockCandidates.filter(c => c.stage === 'HR_INTERVIEW').length,
          Selected: mockCandidates.filter(c => c.stage === 'SELECTED').length,
        },
        upcomingInterviews: mockInterviews.filter(i => i.status === 'PENDING'),
        pendingFeedback: pendingFeedbackCount,
        offersPending: 2, // Placeholder Sprint 3
        hiringVelocity: 14.5, // Placeholder Sprint 3 days avg
        recentActivities: mockTimelineEvents.slice(0, 5),
      };
    }
    const response = await apiClient.get('/hr/recruitment/interviews/dashboard');
    return response?.data || response;
  }
};
