const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const replaced = content.replace(/import \{ Button \} from "(\.\.\/)*components\/ui\/Button"/g, (match, p1) => {
        return `import { Button } from "${p1 || ''}components/ui/button"`;
    }).replace(/import \{ Button \} from "\.\.\/ui\/Button"/g, 'import { Button } from "../ui/button"');
    
    if (content !== replaced) {
        fs.writeFileSync(filePath, replaced);
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(dir) {
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

walkDir(path.join(__dirname, '..', 'src', 'app'));
