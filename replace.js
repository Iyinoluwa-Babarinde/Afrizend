const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/Paylance/g, 'Afrizend')
    .replace(/paylance/g, 'afrizend')
    .replace(/PAYLANCE/g, 'AFRIZEND');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverseDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        traverseDir(fullPath);
      }
    } else {
      if (
        fullPath.endsWith('.js') || 
        fullPath.endsWith('.jsx') || 
        fullPath.endsWith('.ts') || 
        fullPath.endsWith('.tsx') || 
        fullPath.endsWith('.css') || 
        fullPath.endsWith('.html') || 
        fullPath.endsWith('.md') ||
        fullPath.endsWith('.json')
      ) {
        replaceInFile(fullPath);
      }
    }
  }
}

traverseDir(path.join(__dirname, 'Frontend', 'src'));
traverseDir(path.join(__dirname, 'Frontend', 'public'));
traverseDir(path.join(__dirname, 'backend'));
replaceInFile(path.join(__dirname, 'Frontend', 'index.html'));

console.log('Done replacing Paylance with Afrizend.');
