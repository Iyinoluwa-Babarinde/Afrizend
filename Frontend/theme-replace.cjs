const fs = require('fs');
const path = require('path');

const replacements = [
  { pattern: /color:\s*"white"/g, replace: 'color: "hsl(var(--text))"' },
  { pattern: /color:\s*'white'/g, replace: "color: 'hsl(var(--text))'" },
  { pattern: /background:\s*"hsl\(0 0% 4%\)"/g, replace: 'background: "hsl(var(--surface-4))"' },
  { pattern: /background:\s*"hsl\(220 14% [0-9]+%\)"/g, replace: 'background: "hsl(var(--surface-2))"' },
  { pattern: /background:\s*"hsl\(220 20% 1[0-4]%\)"/g, replace: 'background: "hsl(var(--surface-3))"' },
  { pattern: /background:\s*"hsl\(220 20% 1[5-9]%\)"/g, replace: 'background: "hsl(var(--surface-4))"' },
  { pattern: /background:\s*"hsl\(220 20% 2[0-9]%\)"/g, replace: 'background: "hsl(var(--surface-4))"' },
  { pattern: /border:\s*"1px solid hsl\(220 20% [0-9]+%\)"/g, replace: 'border: "1px solid hsl(var(--border))"' },
  { pattern: /borderTop:\s*"1px solid hsl\(220 20% [0-9]+%\)"/g, replace: 'borderTop: "1px solid hsl(var(--border))"' },
  { pattern: /borderBottom:\s*"1px solid hsl\(220 20% [0-9]+%\)"/g, replace: 'borderBottom: "1px solid hsl(var(--border))"' },
  { pattern: /color:\s*"hsl\(220 15% [5-7][0-9]%\)"/g, replace: 'color: "hsl(var(--text-2))"' },
  { pattern: /color:\s*"hsl\(220 15% [3-4][0-9]%\)"/g, replace: 'color: "hsl(var(--text-3))"' },
  { pattern: /background:\s*"hsl\(217 91% 55% \/ 0\.[0-9]+\)"/g, replace: 'background: "hsl(var(--primary) / 0.1)"' },
  { pattern: /border:\s*"1px solid hsl\(217 91% 55% \/ 0\.[0-9]+\)"/g, replace: 'border: "1px solid hsl(var(--primary) / 0.3)"' },
  { pattern: /color:\s*"hsl\(217 91% 70%\)"/g, replace: 'color: "hsl(var(--primary-dark))"' },
  { pattern: /color:\s*"hsl\(217 91% 65%\)"/g, replace: 'color: "hsl(var(--primary))"' },
  { pattern: /color:\s*"hsl\(217 91% 55%\)"/g, replace: 'color: "hsl(var(--primary))"' },
  { pattern: /color:\s*"hsl\(145 65% [4-5][0-9]%\)"/g, replace: 'color: "hsl(var(--success))"' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const { pattern, replace } of replacements) {
        if (pattern.test(content)) {
          content = content.replace(pattern, replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'pages', 'dashboard'));
processDirectory(path.join(__dirname, 'src', 'components'));
processDirectory(path.join(__dirname, 'src', 'layouts'));
