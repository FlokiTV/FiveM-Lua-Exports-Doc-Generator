import fs from 'node:fs';
import path from 'node:path';

// Folder to search for .lua files
const dir = `D:/DEV/fivem/txData/ox_core_42B9E5.base/resources`;

function getAllLuaFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return arrayOfFiles;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    
    try {
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllLuaFiles(fullPath, arrayOfFiles);
      } else {
        if (file.endsWith('.lua')) {
          arrayOfFiles.push(fullPath);
        }
      }
    } catch (err) {
      console.error(`Error processing ${fullPath}:`, err);
    }
  });

  return arrayOfFiles;
}

console.log(`Searching for .lua files in: ${dir}`);
const luaFiles = getAllLuaFiles(dir);

console.log(`Found ${luaFiles.length} .lua files.`);

interface ExportEntry {
  file: string;
  line: string;
  lineNumber: number;
  exportName?: string;
}

const exportsFound: Map<string, ExportEntry[]> = new Map();

luaFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    const fileExports: ExportEntry[] = [];

    lines.forEach((line, index) => {
      // Look for exports(' or exports(" pattern
      if (line.includes("exports(") || line.includes("exports (")) {
        // Try to extract the export name
        const match = line.match(/exports\s*\(\s*['"]([^'"]+)['"]/);
        const exportName = match ? match[1] : undefined;

        fileExports.push({
          file: file,
          line: line.trim(),
          lineNumber: index + 1,
          exportName: exportName
        });
      }
    });

    if (fileExports.length > 0) {
      exportsFound.set(file, fileExports);
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
  }
});

let mdContent = '# Exports Found\n\n';
mdContent += `> Generated on ${new Date().toLocaleString()}\n`;
mdContent += `> Total files with exports: ${exportsFound.size}\n\n`;

// Sort files alphabetically
const sortedFiles = Array.from(exportsFound.keys()).sort();

sortedFiles.forEach(file => {
  const entries = exportsFound.get(file)!;
  const relativePath = path.relative(dir, file).replaceAll('\\', '/');
  
  mdContent += `## ${relativePath}\n\n`;
  mdContent += `| Line | Export Name | Code |\n`;
  mdContent += `| :--- | :--- | :--- |\n`;
  
  entries.forEach(entry => {
    const codeSnippet = entry.line.replace(/\|/g, '\\|'); // Escape pipes for markdown table
    const name = entry.exportName ? `\`${entry.exportName}\`` : '*(unknown)*';
    mdContent += `| ${entry.lineNumber} | ${name} | \`${codeSnippet}\` |\n`;
  });
  
  mdContent += '\n';
});

const outputPath = path.join(__dirname, 'exports.md');
fs.writeFileSync(outputPath, mdContent);
console.log(`Exports list saved to: ${outputPath}`);
