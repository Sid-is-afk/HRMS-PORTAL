const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.js') || dirFile.endsWith('.tsx')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /from\s+['"](\.[^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    let resolved = path.resolve(path.dirname(file), importPath);
    
    // Check possible extensions
    if (!fs.existsSync(resolved + '.js') && 
        !fs.existsSync(resolved + '.tsx') && 
        !fs.existsSync(resolved) && 
        !fs.existsSync(path.join(resolved, 'index.js'))) {
        console.log(`BROKEN: '${importPath}' in ${file}`);
    }
  }
});
