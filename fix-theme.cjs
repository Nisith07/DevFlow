const fs = require('fs');
const path = './src/features/dashboard/DashboardPage.jsx';
let code = fs.readFileSync(path, 'utf8');

// Replace strict dark mode hex colors with CSS variables
const replacements = [
  { s: /#03050c/g, r: 'var(--color-app-bg)' },
  { s: /#0f1322/g, r: 'var(--color-app-surface)' },
  { s: /#e8ecf1/g, r: 'var(--color-app-text)' },
  { s: /#fff/g, r: 'var(--color-app-text)' },
  { s: /#8c98ad/g, r: 'var(--color-app-muted)' },
  { s: /#4a5568/g, r: 'var(--color-app-faint)' },
  { s: /rgba\(255,255,255,0\.02\)/g, r: 'var(--color-app-surface-2)' },
  { s: /rgba\(255,255,255,0\.03\)/g, r: 'var(--color-app-border)' },
  { s: /rgba\(255,255,255,0\.04\)/g, r: 'var(--color-app-border)' },
  { s: /rgba\(255,255,255,0\.05\)/g, r: 'var(--color-app-border)' },
  { s: /rgba\(255,255,255,0\.06\)/g, r: 'var(--color-app-border-bright)' },
  { s: /rgba\(255,255,255,0\.1\)/g, r: 'var(--color-app-border-bright)' },
  { s: /rgba\(13,17,28,0\.7\)/g, r: 'var(--color-app-surface)' }
];

replacements.forEach(({ s, r }) => {
  code = code.replace(s, r);
});

fs.writeFileSync(path, code);
console.log('Dashboard theme colors fixed!');
