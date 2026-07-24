const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const communicationService = {
  getAnnouncements: async (_filters) => {
    await delay(500);
    return { data: [], total: 0 }; // Placeholder
  },
  
  getAnnouncementDetails: async (_id) => {
    await delay(500);
    return { data: null };
  },
  
  createAnnouncement: async (announcementData) => {
    await delay(500);
    return { success: true, data: { ...announcementData, id: 'new-uuid', status: 'DRAFT' } };
  },
  
  updateAnnouncement: async (id, announcementData) => {
    await delay(500);
    return { success: true, data: { ...announcementData, id } };
  },
  
  publishAnnouncement: async (_id) => {
    await delay(500);
    return { success: true, status: 'PUBLISHED' };
  },

  archiveAnnouncement: async (_id) => {
    await delay(500);
    return { success: true, status: 'ARCHIVED' };
  },
  
  getTemplates: async () => {
    await delay(500);
    return { data: [] };
  },

  getAudiencePreview: async (_audienceFilter) => {
    await delay(500);
    // Simulating a count of targeted employees
    return { data: { count: 125, sample: [{ name: 'John Doe', department: 'IT' }] } };
  }
};
