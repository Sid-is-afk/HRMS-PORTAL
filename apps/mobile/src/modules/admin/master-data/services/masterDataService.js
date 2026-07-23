import { apiClient } from '@/api/client/apiClient';
import { USE_MOCK_DATA } from '@/shared/constants/env';
import { organizationService } from '@/modules/admin/organization/services/organizationService';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ORG_REFERENCES = ['departments', 'designations', 'office-locations'];

const mockCategories = [
  { id: 'employment-types', name: 'Employment Types', description: 'Configure employment contract terms (e.g. Full-Time, Part-Time, Intern).', icon: 'briefcase', isReadonly: false },
  { id: 'employment-categories', name: 'Employment Categories', description: 'Configure staff groups (e.g. Permanent, Temporary, Probation).', icon: 'tag', isReadonly: false },
  { id: 'job-grades', name: 'Job Grades', description: 'Configure salary scale bands and grade indices.', icon: 'award', isReadonly: false },
  { id: 'job-levels', name: 'Job Levels', description: 'Configure reporting layers and hierarchy indices.', icon: 'trending-up', isReadonly: false },
  { id: 'departments', name: 'Departments Reference', description: 'Organizational divisions consumed from the Organization module (Read-Only).', icon: 'domain', isReadonly: true },
  { id: 'designations', name: 'Designation Reference', description: 'Work titles consumed from the Organization module (Read-Only).', icon: 'badge-account-outline', isReadonly: true },
  { id: 'office-locations', name: 'Office Locations Reference', description: 'Geographical office nodes consumed from the Organization module (Read-Only).', icon: 'map-marker-radius', isReadonly: true },
  { id: 'leave-types', name: 'Leave Types', description: 'Configure leave classifications (e.g. Sick Leave, Casual Leave).', icon: 'calendar-blank', isReadonly: false },
  { id: 'attendance-statuses', name: 'Attendance Statuses', description: 'Configure clock statuses (e.g. Present, Absent, Half-Day).', icon: 'clock-check-outline', isReadonly: false },
  { id: 'holiday-types', name: 'Holiday Types', description: 'Configure day classifications (e.g. Public, Regional, Custom).', icon: 'calendar-star', isReadonly: false },
  { id: 'shift-types', name: 'Shift Types', description: 'Configure time bands (e.g. Night shift, Morning shift).', icon: 'clock-time-four', isReadonly: false },
  { id: 'document-types', name: 'Document Types', description: 'Configure staff uploads (e.g. Degree certificate, ID proof).', icon: 'file-document-outline', isReadonly: false },
  { id: 'asset-categories', name: 'Asset Categories', description: 'Configure company assets (e.g. Laptop, Keyboard).', icon: 'monitor-cellphone', isReadonly: false },
  { id: 'education-levels', name: 'Education Levels', description: 'Configure qualification references (e.g. Bachelors, Masters).', icon: 'school-outline', isReadonly: false },
  { id: 'nationalities', name: 'Nationalities', description: 'National countries and codes lookup.', icon: 'flag-outline', isReadonly: false },
  { id: 'languages', name: 'Languages', description: 'Spoken and written language codes list.', icon: 'translate', isReadonly: false },
  { id: 'marital-statuses', name: 'Marital Statuses', description: 'Civil relationship codes list.', icon: 'account-heart', isReadonly: false },
  { id: 'blood-groups', name: 'Blood Groups', description: 'Blood type category codes.', icon: 'water-percent', isReadonly: false },
  { id: 'gender-options', name: 'Gender Options', description: 'Gender identification codes.', icon: 'gender-transgender', isReadonly: false },
  { id: 'reason-codes', name: 'Reason Codes', description: 'Configure transaction reasons (e.g. Resignation, Correction request).', icon: 'comment-question-outline', isReadonly: false },
];

let mockReferenceData = {
  'employment-types': [
    { id: 'et-1', code: 'FULL_TIME', name: 'Full-Time', description: 'Regular full-time staff working standard hours.', status: 'ACTIVE', isSystem: true },
    { id: 'et-2', code: 'PART_TIME', name: 'Part-Time', description: 'Part-time contractual staff with flexible bounds.', status: 'ACTIVE', isSystem: true },
    { id: 'et-3', code: 'CONTRACTOR', name: 'Contractor', description: 'Third-party gig or task-based external contractors.', status: 'ACTIVE', isSystem: false },
    { id: 'et-4', code: 'INTERN', name: 'Intern', description: 'Apprentice or student workers undergoing training.', status: 'ACTIVE', isSystem: false },
  ],
  'employment-categories': [
    { id: 'ec-1', code: 'PERMANENT', name: 'Permanent staff', description: 'Regular staff who passed probation.', status: 'ACTIVE', isSystem: true },
    { id: 'ec-2', code: 'PROBATIONARY', name: 'On Probation', description: 'Temporary evaluation period.', status: 'ACTIVE', isSystem: true },
    { id: 'ec-3', code: 'TEMPORARY', name: 'Temporary hire', description: 'Short-term staff covering specific demands.', status: 'ACTIVE', isSystem: false },
  ],
  'job-grades': [
    { id: 'jg-1', code: 'GRADE_A', name: 'Grade A (Executive)', description: 'Leadership, CxO and director bands.', status: 'ACTIVE', isSystem: false },
    { id: 'jg-2', code: 'GRADE_B', name: 'Grade B (Managerial)', description: 'Team leads and department managers.', status: 'ACTIVE', isSystem: false },
    { id: 'jg-3', code: 'GRADE_C', name: 'Grade C (Professional)', description: 'Standard individual professional contributors.', status: 'ACTIVE', isSystem: false },
  ],
  'job-levels': [
    { id: 'jl-1', code: 'L1', name: 'Level 1 (Entry)', description: 'Associate / Junior staff members.', status: 'ACTIVE', isSystem: false },
    { id: 'jl-2', code: 'L2', name: 'Level 2 (Mid)', description: 'Professional / Experienced staff.', status: 'ACTIVE', isSystem: false },
    { id: 'jl-3', code: 'L3', name: 'Level 3 (Lead)', description: 'Team leads and technical leads.', status: 'ACTIVE', isSystem: false },
  ],
  'leave-types': [
    { id: 'lt-1', code: 'SICK_LEAVE', name: 'Sick Leave', description: 'Medical recovery leave. Requires doctor certificates.', status: 'ACTIVE', isSystem: true, metadata: { color: '#EF4444', requiresDocumentProof: true } },
    { id: 'lt-2', code: 'CASUAL_LEAVE', name: 'Casual Leave', description: 'Personal reasons leave. Standard allocation.', status: 'ACTIVE', isSystem: true, metadata: { color: '#3B82F6', requiresDocumentProof: false } },
    { id: 'lt-3', code: 'MATERNITY_LEAVE', name: 'Maternity Leave', description: 'Pregnancy and childcare leave.', status: 'ACTIVE', isSystem: true, metadata: { color: '#EC4899', requiresDocumentProof: true } },
  ],
  'attendance-statuses': [
    { id: 'as-1', code: 'PRESENT', name: 'Present', description: 'Staff clocked in and worked shifts.', status: 'ACTIVE', isSystem: true },
    { id: 'as-2', code: 'ABSENT', name: 'Absent', description: 'Shift missed without leave approvals.', status: 'ACTIVE', isSystem: true },
    { id: 'as-3', code: 'HALF_DAY', name: 'Half Day', description: 'Worked less than 50% shift hours.', status: 'ACTIVE', isSystem: true },
  ],
  'holiday-types': [
    { id: 'ht-1', code: 'PUBLIC', name: 'Public Holiday', description: 'National government declared holiday.', status: 'ACTIVE', isSystem: true },
    { id: 'ht-2', code: 'OPTIONAL', name: 'Optional / Restricted', description: 'Religious or regional choice holidays.', status: 'ACTIVE', isSystem: false },
    { id: 'ht-3', code: 'COMPANY', name: 'Company Declared Holiday', description: 'In-house declared holiday.', status: 'ACTIVE', isSystem: false },
  ],
  'shift-types': [
    { id: 'st-1', code: 'MORNING_SHIFT', name: 'Morning Shift', description: 'Standard 09:00 AM - 05:00 PM shift.', status: 'ACTIVE', isSystem: true },
    { id: 'st-2', code: 'EVENING_SHIFT', name: 'Evening Shift', description: 'Flexible 02:00 PM - 10:00 PM shift.', status: 'ACTIVE', isSystem: false },
    { id: 'st-3', code: 'NIGHT_SHIFT', name: 'Night Shift', description: 'Shift 10:00 PM - 06:00 AM next day.', status: 'ACTIVE', isSystem: false },
  ],
  'document-types': [
    { id: 'dt-1', code: 'ID_PROOF', name: 'Identity Proof', description: 'Passport, driving license or national card.', status: 'ACTIVE', isSystem: true },
    { id: 'dt-2', code: 'DEGREE_CERT', name: 'Degree Certificate', description: 'College graduation proof.', status: 'ACTIVE', isSystem: false },
  ],
  'asset-categories': [
    { id: 'ac-1', code: 'LAPTOP', name: 'Company Laptop', description: 'Workstation laptop assigned to employees.', status: 'ACTIVE', isSystem: true },
    { id: 'ac-2', code: 'MOBILE', name: 'Company Mobile', description: 'Smartphones for sales/operational teams.', status: 'ACTIVE', isSystem: false },
  ],
  'education-levels': [
    { id: 'el-1', code: 'BACHELORS', name: 'Bachelors Degree', description: 'Undergraduate study.', status: 'ACTIVE', isSystem: true },
    { id: 'el-2', code: 'MASTERS', name: 'Masters Degree', description: 'Postgraduate study.', status: 'ACTIVE', isSystem: false },
  ],
  'nationalities': [
    { id: 'nat-1', code: 'INDIAN', name: 'Indian', description: 'Republic of India.', status: 'ACTIVE', isSystem: true },
    { id: 'nat-2', code: 'AMERICAN', name: 'American', description: 'United States of America.', status: 'ACTIVE', isSystem: true },
  ],
  'languages': [
    { id: 'lang-1', code: 'ENGLISH', name: 'English', description: 'Global business language.', status: 'ACTIVE', isSystem: true },
    { id: 'lang-2', code: 'HINDI', name: 'Hindi', description: 'Indian national language.', status: 'ACTIVE', isSystem: true },
  ],
  'marital-statuses': [
    { id: 'ms-1', code: 'SINGLE', name: 'Single', description: 'Unmarried status.', status: 'ACTIVE', isSystem: true },
    { id: 'ms-2', code: 'MARRIED', name: 'Married', description: 'Legally married.', status: 'ACTIVE', isSystem: true },
  ],
  'blood-groups': [
    { id: 'bg-1', code: 'A_POSITIVE', name: 'A+', description: 'A positive blood type.', status: 'ACTIVE', isSystem: true },
    { id: 'bg-2', code: 'B_POSITIVE', name: 'B+', description: 'B positive blood type.', status: 'ACTIVE', isSystem: true },
    { id: 'bg-3', code: 'O_POSITIVE', name: 'O+', description: 'O positive blood type.', status: 'ACTIVE', isSystem: true },
  ],
  'gender-options': [
    { id: 'gen-1', code: 'MALE', name: 'Male', description: 'Male gender identity.', status: 'ACTIVE', isSystem: true },
    { id: 'gen-2', code: 'FEMALE', name: 'Female', description: 'Female gender identity.', status: 'ACTIVE', isSystem: true },
    { id: 'gen-3', code: 'OTHER', name: 'Other', description: 'Non-binary or other representation.', status: 'ACTIVE', isSystem: true },
  ],
  'reason-codes': [
    { id: 'rc-1', code: 'RESIGNATION', name: 'Voluntary Resignation', description: 'Employee resigning with notice period.', status: 'ACTIVE', isSystem: true },
    { id: 'rc-2', code: 'ATTENDANCE_REG', name: 'Regularization Request', description: 'Missing swipe or device malfunction correction.', status: 'ACTIVE', isSystem: false },
  ]
};

export const masterDataService = {
  getCategories: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      // Map live counts dynamically
      return mockCategories.map(cat => {
        let count = 0;
        if (cat.id === 'departments') {
          count = 4; // Sanjay's pre-populated mock department counts
        } else if (cat.id === 'designations') {
          count = 4; // Pre-populated designations count
        } else if (cat.id === 'office-locations') {
          count = 3; // Pre-populated locations count
        } else {
          count = mockReferenceData[cat.id]?.length || 0;
        }
        return { ...cat, count };
      });
    }
    const response = await apiClient.get('/admin/master-data/categories');
    return response?.data || response;
  },

  getReferenceValues: async (categoryId) => {
    if (USE_MOCK_DATA) {
      await delay(400);

      // Handle Organization consumption references
      if (categoryId === 'departments') {
        const depts = await organizationService.getDepartments();
        return depts.map(d => ({
          id: d.id,
          code: d.code,
          name: d.name,
          description: d.description || 'No description.',
          status: d.status || 'ACTIVE',
          isSystem: false,
        }));
      }

      if (categoryId === 'designations') {
        const desigs = await organizationService.getDesignations();
        return desigs.map(d => ({
          id: d.id,
          code: d.id.toUpperCase().replace(/-/g, '_'),
          name: d.title,
          description: d.description || 'No description.',
          status: d.status || 'ACTIVE',
          isSystem: false,
        }));
      }

      if (categoryId === 'office-locations') {
        const locs = await organizationService.getLocations();
        return locs.map(l => ({
          id: l.id,
          code: l.id.toUpperCase().replace(/-/g, '_'),
          name: l.name,
          description: `${l.city}, ${l.country} (${l.type})`,
          status: 'ACTIVE',
          isSystem: false,
        }));
      }

      return [...(mockReferenceData[categoryId] || [])];
    }
    const response = await apiClient.get(`/admin/master-data/categories/${categoryId}/values`);
    return response?.data || response;
  },

  createReferenceValue: async (categoryId, data) => {
    if (ORG_REFERENCES.includes(categoryId)) {
      throw new Error('Reference data owned by the Organization module cannot be modified inside Master Data.');
    }

    if (USE_MOCK_DATA) {
      await delay(400);
      if (!mockReferenceData[categoryId]) {
        mockReferenceData[categoryId] = [];
      }
      const newVal = {
        id: `ref-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        isSystem: false,
      };
      mockReferenceData[categoryId].push(newVal);
      return newVal;
    }
    const response = await apiClient.post(`/admin/master-data/categories/${categoryId}/values`, data);
    return response?.data || response;
  },

  updateReferenceValue: async (categoryId, valueId, data) => {
    if (ORG_REFERENCES.includes(categoryId)) {
      throw new Error('Reference data owned by the Organization module cannot be modified inside Master Data.');
    }

    if (USE_MOCK_DATA) {
      await delay(450);
      const list = mockReferenceData[categoryId] || [];
      const idx = list.findIndex(item => item.id === valueId);
      if (idx === -1) throw new Error('Reference value not found.');
      
      if (list[idx].isSystem) {
        throw new Error('System-defined default values cannot be edited.');
      }

      const updatedVal = {
        ...list[idx],
        ...data,
      };
      list[idx] = updatedVal;
      return updatedVal;
    }
    const response = await apiClient.put(`/admin/master-data/categories/${categoryId}/values/${valueId}`, data);
    return response?.data || response;
  },

  archiveReferenceValue: async (categoryId, valueId) => {
    if (ORG_REFERENCES.includes(categoryId)) {
      throw new Error('Reference data owned by the Organization module cannot be modified inside Master Data.');
    }

    if (USE_MOCK_DATA) {
      await delay(400);
      const list = mockReferenceData[categoryId] || [];
      const idx = list.findIndex(item => item.id === valueId);
      if (idx === -1) throw new Error('Reference value not found.');

      if (list[idx].isSystem) {
        throw new Error('System-defined default values cannot be archived.');
      }

      list[idx].status = 'ARCHIVED';
      return list[idx];
    }
    const response = await apiClient.post(`/admin/master-data/categories/${categoryId}/values/${valueId}/archive`);
    return response?.data || response;
  },

  // Import/Export placeholder triggers
  importJSON: async (categoryId, jsonString) => {
    if (ORG_REFERENCES.includes(categoryId)) {
      throw new Error('Import is blocked on external Organization references.');
    }
    await delay(600);
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('JSON format must be a reference list array.');
      
      // Simple validation checking code and name fields
      parsed.forEach(item => {
        if (!item.code || !item.name) throw new Error('Imported items require code and name fields.');
      });

      if (!mockReferenceData[categoryId]) {
        mockReferenceData[categoryId] = [];
      }

      parsed.forEach(item => {
        const id = `ref-${Math.random().toString(36).substr(2, 9)}`;
        mockReferenceData[categoryId].push({
          id,
          code: item.code.toUpperCase(),
          name: item.name,
          description: item.description || '',
          status: item.status || 'ACTIVE',
          isSystem: false,
        });
      });
      return true;
    } catch (err) {
      throw new Error(`Import failed: ${err.message}`);
    }
  },

  exportJSON: async (categoryId) => {
    await delay(300);
    const values = await masterDataService.getReferenceValues(categoryId);
    return JSON.stringify(values, null, 2);
  }
};
