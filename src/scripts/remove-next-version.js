import fs from 'fs';
import path from 'path';

// Remove ou mascara a versão do Next.js dos arquivos JS
function removeNextVersion(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      removeNextVersion(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/version:"[\d.]+"/g, 'version:"hidden"');
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  });
}

// Remove todas as tags <script> dos arquivos HTML
function removeScriptTags(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      removeScriptTags(fullPath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Remove todas as tags <script>...</script>
      content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  });
}

// Execute as funções nos diretórios desejados
removeNextVersion('./.next/static/chunks'); // JS gerado pelo Next.js
removeScriptTags('./.next/server/app'); // HTML exportado pelo next export (ajuste o caminho se necessário)
