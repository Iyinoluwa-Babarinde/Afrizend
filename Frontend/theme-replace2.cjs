const fs = require('fs');
const path = require('path');

const replacements = [
  // Remaining dark theme backgrounds and borders
  { pattern: /background:\s*["']hsl\(220 14% 9%\)["']/g, replace: 'background: "hsl(var(--surface-2))"' },
  { pattern: /background:\s*["']hsl\(220 20% 6%\)["']/g, replace: 'background: "hsl(var(--surface-3))"' },
  { pattern: /background:\s*["']hsl\(220 20% 12%\)["']/g, replace: 'background: "hsl(var(--surface-3))"' },
  { pattern: /background:\s*["']hsl\(220 20% 13%\)["']/g, replace: 'background: "hsl(var(--surface-3))"' },
  { pattern: /background:\s*["']hsl\(220 20% 14%\)["']/g, replace: 'background: "hsl(var(--surface-3))"' },
  { pattern: /background:\s*["']hsl\(220 20% 16%\)["']/g, replace: 'background: "hsl(var(--surface-4))"' },
  { pattern: /background:\s*["']hsl\(220 20% 18%\)["']/g, replace: 'background: "hsl(var(--surface-4))"' },
  { pattern: /background:\s*["']hsl\(220 16% 12%\)["']/g, replace: 'background: "hsl(var(--surface-3))"' },
  { pattern: /border:\s*["']1px solid hsl\(220 20% 16%\)["']/g, replace: 'border: "1px solid hsl(var(--border))"' },
  { pattern: /border:\s*["']1px solid hsl\(220 20% 12%\)["']/g, replace: 'border: "1px solid hsl(var(--border))"' },
  { pattern: /border:\s*["']1px solid hsl\(220 20% 14%\)["']/g, replace: 'border: "1px solid hsl(var(--border))"' },
  { pattern: /border:\s*["']2px solid hsl\(220 20% 20%\)["']/g, replace: 'border: "2px solid hsl(var(--border))"' },
  { pattern: /borderBottom:\s*["']1px solid hsl\(220 20% 14%\)["']/g, replace: 'borderBottom: "1px solid hsl(var(--border))"' },
  { pattern: /borderBottom:\s*["']1px solid hsl\(220 20% 16%\)["']/g, replace: 'borderBottom: "1px solid hsl(var(--border))"' },
  { pattern: /borderRight:\s*["']1px solid hsl\(220 20% 12%\)["']/g, replace: 'borderRight: "1px solid hsl(var(--border))"' },
  { pattern: /borderLeft:\s*["']1px solid hsl\(220 20% 16%\)["']/g, replace: 'borderLeft: "1px solid hsl(var(--border))"' },
  { pattern: /borderTopColor:\s*["']hsl\(200 100% 60%\)["']/g, replace: 'borderTopColor: "hsl(var(--primary))"' },
  { pattern: /borderColor\s*=\s*["']hsl\(220 20% 20%\)["']/g, replace: 'borderColor = "hsl(var(--border))"' },
  { pattern: /background:\s*["']transparent["']/g, replace: 'background: "transparent"' }, // keep but useful to see
  { pattern: /hsl\(220 20% 16%\)/g, replace: 'hsl(var(--surface-4))' },
  { pattern: /hsl\(220 20% 14%\)/g, replace: 'hsl(var(--surface-3))' },
  { pattern: /hsl\(220 20% 12%\)/g, replace: 'hsl(var(--surface-3))' },
  { pattern: /hsl\(220 20% 13%\)/g, replace: 'hsl(var(--surface-3))' },
  { pattern: /hsl\(220 20% 20%\)/g, replace: 'hsl(var(--border))' },
  { pattern: /hsl\(220 14% 9%\)/g, replace: 'hsl(var(--surface-2))' },
  { pattern: /hsl\(220 20% 6%\)/g, replace: 'hsl(var(--surface-3))' },
  { pattern: /hsl\(220 16% 12%\)/g, replace: 'hsl(var(--surface-3))' },
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
