/**
 * Converts esbuild's react/jsx-runtime output back to readable JSX.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import * as t from '@babel/types';

const traverse = traverseModule.default ?? traverseModule;
const generate = generateModule.default ?? generateModule;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src');

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (/\.jsx$/.test(name)) acc.push(full);
  }
  return acc;
}

function isJsxCall(node) {
  return (
    t.isCallExpression(node) &&
    t.isIdentifier(node.callee) &&
    (node.callee.name === 'jsx' || node.callee.name === 'jsxs')
  );
}

function tagToJsxName(node) {
  if (t.isStringLiteral(node)) {
    const parts = node.value.split('.');
    if (parts.length === 1) return t.jsxIdentifier(parts[0]);
    let expr = t.jsxIdentifier(parts[0]);
    for (let i = 1; i < parts.length; i++) {
      expr = t.jsxMemberExpression(expr, t.jsxIdentifier(parts[i]));
    }
    return expr;
  }
  if (t.isIdentifier(node)) return t.jsxIdentifier(node.name);
  if (t.isMemberExpression(node)) {
    const parts = [];
    let cur = node;
    while (t.isMemberExpression(cur)) {
      parts.unshift(cur.property.name);
      cur = cur.object;
    }
    if (t.isIdentifier(cur)) parts.unshift(cur.name);
    let expr = t.jsxIdentifier(parts[0]);
    for (let i = 1; i < parts.length; i++) {
      expr = t.jsxMemberExpression(expr, t.jsxIdentifier(parts[i]));
    }
    return expr;
  }
  return t.jsxIdentifier('Unknown');
}

function propToAttribute(prop) {
  if (t.isSpreadElement(prop)) return t.jsxSpreadAttribute(prop.argument);
  if (!t.isObjectProperty(prop)) return null;

  const key = t.isIdentifier(prop.key)
    ? prop.key.name
    : t.isStringLiteral(prop.key)
      ? prop.key.value
      : null;
  if (!key || key === 'children') return null;

  const attrName = t.jsxIdentifier(key);
  const val = prop.value;

  if (t.isStringLiteral(val)) {
    return t.jsxAttribute(attrName, t.stringLiteral(val.value));
  }
  if (t.isBooleanLiteral(val)) {
    return val.value ? t.jsxAttribute(attrName) : t.jsxAttribute(attrName, t.jsxExpressionContainer(val));
  }
  if (t.isNullLiteral(val)) {
    return t.jsxAttribute(attrName, t.jsxExpressionContainer(val));
  }
  if (t.isNumericLiteral(val) || t.isIdentifier(val) || t.isMemberExpression(val) || t.isCallExpression(val) || t.isConditionalExpression(val) || t.isLogicalExpression(val) || t.isBinaryExpression(val) || t.isUnaryExpression(val) || t.isArrowFunctionExpression(val) || t.isObjectExpression(val) || t.isArrayExpression(val) || t.isTemplateLiteral(val)) {
    return t.jsxAttribute(attrName, t.jsxExpressionContainer(val));
  }
  return t.jsxAttribute(attrName, t.jsxExpressionContainer(val));
}

function exprToJsxChild(expr) {
  if (t.isStringLiteral(expr) || t.isNumericLiteral(expr)) {
    return t.jsxText(String(expr.value));
  }
  if (t.isCallExpression(expr) && isJsxCall(expr)) {
    return callToJsxElement(expr);
  }
  if (t.isArrayExpression(expr)) {
    return t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), expr.elements.filter(Boolean).map(exprToJsxChild));
  }
  return t.jsxExpressionContainer(expr);
}

function normalizeChildren(children) {
  if (children == null) return [];
  const list = t.isArrayExpression(children) ? children.elements : [children];
  const out = [];
  for (const c of list) {
    if (c == null) continue;
    if (t.isStringLiteral(c)) {
      if (c.value) out.push(t.jsxText(c.value));
    } else if (isJsxCall(c)) {
      out.push(callToJsxElement(c));
    } else if (t.isArrayExpression(c)) {
      out.push(...normalizeChildren(c));
    } else {
      out.push(exprToJsxChild(c));
    }
  }
  return out;
}

function callToJsxElement(call) {
  const [tagArg, propsArg] = call.arguments;
  const props = t.isObjectExpression(propsArg) ? propsArg.properties : [];
  const attrs = [];
  let childrenProp = null;

  for (const p of props) {
    if (t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === 'children') {
      childrenProp = p.value;
    } else {
      const attr = propToAttribute(p);
      if (attr) attrs.push(attr);
    }
  }

  const children = normalizeChildren(childrenProp);
  const name = tagToJsxName(tagArg);
  const selfClosing = children.length === 0;

  if (selfClosing) {
    return t.jsxElement(t.jsxOpeningElement(name, attrs, true), null, [], false);
  }

  return t.jsxElement(
    t.jsxOpeningElement(name, attrs, false),
    t.jsxClosingElement(name),
    children,
    children.length === 0
  );
}

function beautifyFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  if (!code.includes('react/jsx-runtime')) return false;

  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  traverse(ast, {
    CallExpression(path) {
      if (!isJsxCall(path.node)) return;
      path.replaceWith(callToJsxElement(path.node));
    },
  });

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'react/jsx-runtime') {
        path.remove();
      }
    },
    Program(path) {
      for (const stmt of path.node.body) {
        if (t.isExportNamedDeclaration(stmt) && stmt.specifiers.length === 1 && !stmt.declaration) {
          const spec = stmt.specifiers[0];
          if (t.isExportSpecifier(spec) && t.isIdentifier(spec.exported)) {
            const name = spec.exported.name;
            const fnPath = path.scope.getBinding(name)?.path;
            if (fnPath?.isFunctionDeclaration()) {
              fnPath.node.leadingComments = fnPath.node.leadingComments?.filter(
                (c) => !c.value.includes('@__PURE__')
              );
            }
          }
        }
      }
    },
  });

  let out = generate(ast, { retainLines: false, jsescOption: { minimal: true } }).code;

  out = out
    .replace(/\bvoid 0\b/g, 'undefined')
    .replace(/\/\* @__PURE__ \*\/\s*/g, '')
    .replace(/\n{3,}/g, '\n\n');

  // Remove duplicate `export { Name }` when `export function Name` already exists
  out = out.replace(/^export \{\s*(\w+)\s*\};?\s*$/gm, (line, name) => {
    if (new RegExp(`export function ${name}\\b`).test(out)) return '';
    return line;
  });

  fs.writeFileSync(filePath, out);
  return true;
}

const files = walk(srcDir);
let count = 0;
for (const f of files) {
  if (beautifyFile(f)) {
    count++;
    console.log('beautified', path.relative(srcDir, f));
  }
}
console.log(`Done: ${count} JSX files.`);
