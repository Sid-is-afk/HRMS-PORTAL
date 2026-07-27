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
  // Fix the wrongly rewritten store imports
  { from: /@\/shared\/stores\/attendanceStore/g, to: '@/modules/employee/attendance/store/attendanceStore' },
  { from: /@\/shared\/stores\/dashboardStore/g, to: '@/modules/employee/dashboard/store/dashboardStore' },
  { from: /@\/shared\/stores\/leaveStore/g, to: '@/modules/employee/leave/store/leaveStore' },
  { from: /@\/shared\/stores\/notificationsStore/g, to: '@/modules/employee/notifications/store/notificationsStore' },
  { from: /@\/shared\/stores\/profileStore/g, to: '@/modules/employee/profile/store/profileStore' },
  { from: /@\/shared\/stores\/settingsStore/g, to: '@/modules/employee/settings/store/settingsStore' },
  // authStore should have already been fixed where broken, but just in case:
  { from: /@\/shared\/stores\/authStore/g, to: '@/core/auth/authStore' },
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
    console.log('Fixed', file);
  }
});

console.log(`Updated imports in ${changedFilesCount} files.`);
