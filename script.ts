import * as fs from 'fs';
import * as path from 'path';

function replaceInFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf8');
    const replaced = content.replace(/import\s*\{\s*Button\s*\}\s*from\s*["']([^"']*)Button["']/g, 'import { Button } from "$1button"');
    
    if (content !== replaced) {
        fs.writeFileSync(filePath, replaced);
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'src', 'app'));
