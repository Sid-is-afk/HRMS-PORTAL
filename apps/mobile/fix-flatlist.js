const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.js')) results.push(file);
        }
    });
    return results;
}

const files = walk('C:\\Users\\SIDDHARTH\\OneDrive\\Documents\\HRMS-PORTAL\\apps\\mobile\\src');
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const badStr = '<FlatList\\n        initialNumToRender={10}\\n        maxToRenderPerBatch={10}\\n        windowSize={5}';
    if(content.includes(badStr)) {
        content = content.split(badStr).join('<FlatList\n        initialNumToRender={10}\n        maxToRenderPerBatch={10}\n        windowSize={5}');
        fs.writeFileSync(f, content, 'utf8');
        console.log('Fixed', f);
    }
});
