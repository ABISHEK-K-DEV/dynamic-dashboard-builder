import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src');

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (/\.(js|jsx)$/.test(name)) acc.push(full);
  }
  return acc;
}

for (const file of walk(srcDir)) {
  let code = fs.readFileSync(file, 'utf8');
  const exportedFns = [...code.matchAll(/export function (\w+)/g)].map((m) => m[1]);
  if (!exportedFns.length) continue;

  const before = code;
  for (const name of exportedFns) {
    code = code.replace(new RegExp(`^export \\{\\s*${name}\\s*\\};?\\s*$`, 'gm'), '');
    code = code.replace(
      new RegExp(`^export \\{\\s*([^}]*?)\\s*\\};?\\s*$`, 'gm'),
      (line, inner) => {
        const names = inner.split(',').map((s) => s.trim()).filter(Boolean);
        const rest = names.filter((n) => n !== name);
        if (rest.length === 0) return '';
        return `export { ${rest.join(', ')} };`;
      },
    );
  }

  if (code !== before) {
    fs.writeFileSync(file, code.replace(/\n{3,}/g, '\n\n'));
    console.log('fixed', path.relative(srcDir, file));
  }
}
