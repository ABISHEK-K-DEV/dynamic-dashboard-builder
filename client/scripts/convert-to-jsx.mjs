import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src');

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (/\.tsx?$/.test(name)) acc.push(full);
  }
  return acc;
}

const files = walk(srcDir);
const outMap = new Map();

for (const file of files) {
  const rel = path.relative(srcDir, file);
  const outRel = rel.replace(/\.tsx$/i, '.jsx').replace(/\.ts$/i, '.js');
  const outPath = path.join(srcDir, outRel);
  outMap.set(rel, outRel);

  const code = fs.readFileSync(file, 'utf8');
  const result = await esbuild.transform(code, {
    loader: file.endsWith('.tsx') ? 'tsx' : 'ts',
    format: 'esm',
    jsx: 'preserve',
    target: 'es2022',
  });

  let js = result.code;
  for (const [from, to] of outMap) {
    js = js.replaceAll(`from "@/${from}"`, `from "@/${to}"`);
    js = js.replaceAll(`from '@/${from}'`, `from '@/${to}'`);
    const fromNoExt = from.replace(/\.(tsx?|jsx?)$/, '');
    const toNoExt = to.replace(/\.(tsx?|jsx?)$/, '');
    js = js.replaceAll(`from "@/${fromNoExt}"`, `from "@/${toNoExt}"`);
    js = js.replaceAll(`from '@/${fromNoExt}'`, `from '@/${toNoExt}'`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, js);
  fs.unlinkSync(file);
  console.log(`${rel} -> ${outRel}`);
}

console.log(`Converted ${files.length} files.`);
