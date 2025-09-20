#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function fixImportsInFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    
    // Fix relative imports to add .js extension
    const fixedContent = content
      .replace(/from\s+["'](\.\/[^"']+)["']/g, (match, importPath) => {
        if (!importPath.endsWith('.js') && !importPath.endsWith('.json')) {
          return match.replace(importPath, importPath + '.js');
        }
        return match;
      })
      .replace(/from\s+["'](\.\.\/[^"']+)["']/g, (match, importPath) => {
        if (!importPath.endsWith('.js') && !importPath.endsWith('.json')) {
          return match.replace(importPath, importPath + '.js');
        }
        return match;
      })
      .replace(/import\s+["'](\.\/[^"']+)["']/g, (match, importPath) => {
        if (!importPath.endsWith('.js') && !importPath.endsWith('.json')) {
          return match.replace(importPath, importPath + '.js');
        }
        return match;
      })
      .replace(/import\s+["'](\.\.\/[^"']+)["']/g, (match, importPath) => {
        if (!importPath.endsWith('.js') && !importPath.endsWith('.json')) {
          return match.replace(importPath, importPath + '.js');
        }
        return match;
      });
    
    if (content !== fixedContent) {
      writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const items = readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (extname(item) === '.js') {
      fixImportsInFile(fullPath);
    }
  }
}

// Process the dist directory
const distPath = './dist';
try {
  processDirectory(distPath);
  console.log('Import fixing completed!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
