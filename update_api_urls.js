const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'app'), (filePath) => {
  if (filePath.endsWith('Service.ts') || filePath.endsWith('Service.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace fetch('/api/...
    content = content.replace(/fetch\('(\/api\/[^']+)'/g, "fetch(process.env.NEXT_PUBLIC_API_URL + '$1'");
    // Replace fetch(`/api/...
    content = content.replace(/fetch\(`(\/api\/[^`]+)`/g, "fetch(`${process.env.NEXT_PUBLIC_API_URL}$1`");
    // Replace fetch("/api/...
    content = content.replace(/fetch\("(\/api\/[^"]+)"/g, "fetch(process.env.NEXT_PUBLIC_API_URL + \"$1\"");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated API URLs in ${filePath}`);
    }
  }
});
