const fs = require('fs');
const path = require('path');

const docsDir = 'C:\\Users\\User\\Desktop\\GitVision\\src\\app\\docs';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fixImports(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;

      // Fix CodeBlock import
      if (content.includes('import { CodeBlock }')) {
        content = content.replace(/import \{ CodeBlock \} from "@\/components\/CodeBlock"/g, 'import CodeBlock from "@/components/CodeBlock"');
        changed = true;
      }

      // Fix FeatureCard import
      if (content.includes('import { FeatureCard }')) {
        content = content.replace(/import \{ FeatureCard \} from "@\/components\/FeatureCard"/g, 'import FeatureCard from "@/components/FeatureCard"');
        changed = true;
      }

      // Fix CheckCircle import
      if (content.includes('import { CheckCircle }')) {
        content = content.replace(/import \{ CheckCircle \} from "lucide-react"/g, 'import { CheckCircle } from "lucide-react"');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', filePath);
      }
    }
  }
}

fixImports(docsDir);
console.log('Done!');