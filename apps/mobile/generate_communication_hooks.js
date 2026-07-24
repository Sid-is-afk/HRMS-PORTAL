const fs = require('fs');
const path = require('path');

const hooksDir = path.join('src', 'modules', 'admin', 'communication', 'hooks');

const hooks = {
  'useAnnouncements.js': `import { useEffect } from 'react';
import { useCommunicationStore } from '../store/communicationStore';

export const useAnnouncements = (filters = {}) => {
  const { announcements, isLoading, error, fetchAnnouncements } = useCommunicationStore();

  useEffect(() => {
    fetchAnnouncements(filters);
  }, [JSON.stringify(filters)]);

  return { announcements, isLoading, error, fetchAnnouncements };
};
`,
  'useCommunicationTemplates.js': `import { useEffect } from 'react';
import { useCommunicationStore } from '../store/communicationStore';

export const useCommunicationTemplates = () => {
  const { templates, isLoading, error, fetchTemplates } = useCommunicationStore();

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, isLoading, error, fetchTemplates };
};
`,
  'useAudienceSelector.js': `import { useEffect } from 'react';
import { useCommunicationStore } from '../store/communicationStore';

export const useAudienceSelector = (audienceFilter) => {
  const { audiencePreview, isLoading, error, fetchAudiencePreview } = useCommunicationStore();

  useEffect(() => {
    if (audienceFilter) {
      fetchAudiencePreview(audienceFilter);
    }
  }, [JSON.stringify(audienceFilter)]);

  return { audiencePreview, isLoading, error };
};
`
};

for (const [filename, content] of Object.entries(hooks)) {
  fs.writeFileSync(path.join(hooksDir, filename), content);
}
console.log('Hooks created successfully.');
