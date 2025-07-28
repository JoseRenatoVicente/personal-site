const fs = require('fs');
const path = require('path');

const versionRegex = /(?:"version"|version):"[^"]*"/g;

function processDirectory(directory) {
  try {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else {
        try {
          let content = fs.readFileSync(fullPath, 'utf8');
          let matchFound = false;

          const newContent = content.replace(versionRegex, (match) => {
            matchFound = true;
            const key = match.split(':')[0];
            return `${key}:""`;
          });
          
          if (matchFound) {
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`Versão do Next.js removida de: ${fullPath}`);
          }
        } catch (readErr) {
          if (readErr.code !== 'ENOENT') {
             console.warn(`Não foi possível ler o arquivo ${fullPath}. Ignorando.`);
          }
        }
      }
    }
  } catch (dirErr) {
    console.error(`Erro ao processar o diretório ${directory}:`, dirErr);
  }
}

const nextDir = path.join(process.cwd(), '.next');

if (fs.existsSync(nextDir)) {
  console.log('Procurando pela versão do Next.js nos arquivos de build...');
  processDirectory(nextDir);
} else {
  console.warn(`Diretório .next não encontrado. Execute o build primeiro.`);
}

console.log('Processo de remoção da versão concluído.');
