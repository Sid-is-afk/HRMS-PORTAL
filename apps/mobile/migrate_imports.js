const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.js') || f.endsWith('.tsx'));

const mappings = [
  // Core / Shared moves
  { from: /@\/components/g, to: '@/shared/components' },
  { from: /@\/hooks/g, to: '@/shared/hooks' },
  { from: /@\/services/g, to: '@/shared/services' },
  { from: /@\/store/g, to: '@/shared/stores' },
  { from: /@\/utils/g, to: '@/shared/utils' },
  { from: /@\/validation/g, to: '@/shared/validation' },
  { from: /@\/constants/g, to: '@/shared/constants' },
  { from: /@\/models/g, to: '@/shared/models' },
  { from: /@\/types/g, to: '@/shared/types' },
  { from: /@\/theme/g, to: '@/shared/theme' },
  { from: /@\/network/g, to: '@/core/network' },
  { from: /@\/offline/g, to: '@/core/offline' },
  { from: /@\/storage/g, to: '@/core/storage' },
  
  // Auth Logic moves (core)
  { from: /@\/modules\/auth\/store/g, to: '@/core/auth' },
  { from: /@\/modules\/auth\/api/g, to: '@/core/auth' },
  { from: /@\/modules\/auth\/validation/g, to: '@/core/auth' },
  
  // Auth UI (still in modules/auth)
  // Navigation moves
  { from: /@\/navigation/g, to: '@/app/navigation' },

  // Employee module moves
  { from: /@\/modules\/attendance/g, to: '@/modules/employee/attendance' },
  { from: /@\/modules\/dashboard/g, to: '@/modules/employee/dashboard' },
  { from: /@\/modules\/leave/g, to: '@/modules/employee/leave' },
  { from: /@\/modules\/notifications/g, to: '@/modules/employee/notifications' },
  { from: /@\/modules\/profile/g, to: '@/modules/employee/profile' },
  { from: /@\/modules\/settings/g, to: '@/modules/employee/settings' },

  // API moves
  { from: /@\/api\/apiClient/g, to: '@/api/client/apiClient' },
  { from: /@\/api\/axios/g, to: '@/api/client/axios' },
  { from: /@\/api\/queryClient/g, to: '@/api/client/queryClient' },
  { from: /@\/api\/errorParser/g, to: '@/api/middleware/errorParser' },
  { from: /@\/api\/mockData/g, to: '@/tests/mocks/mockData' },
  
  // Specific broken relative imports that crossed boundaries in old structure
  // e.g. from '../store/offlineStore' in api/client/apiClient.js
  { from: /from '\.\.\/store\//g, to: "from '@/shared/stores/" },
  { from: /from '\.\.\/storage\//g, to: "from '@/core/storage/" },
  { from: /from '\.\.\/network\//g, to: "from '@/core/network/" },
];

let changedFilesCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  mappings.forEach(mapping => {
    content = content.replace(mapping.from, mapping.to);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFilesCount++;
  }
});

console.log(`Updated imports in ${changedFilesCount} files.`);
