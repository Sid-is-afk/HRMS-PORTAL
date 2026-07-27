const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files).filter(f => f.endsWith('.js'));
}

const files = getFiles(path.join(__dirname, '../src/modules/hr'));
let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('<FlatList') && !content.includes('initialNumToRender=')) {
    content = content.replace(
      /<FlatList/g,
      '<FlatList\\n        initialNumToRender={10}\\n        maxToRenderPerBatch={10}\\n        windowSize={5}'
    );
    fs.writeFileSync(file, content, 'utf-8');
    updatedCount++;
    console.log('Updated:', file);
  }
}

console.log('Total files updated:', updatedCount);
