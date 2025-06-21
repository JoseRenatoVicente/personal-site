// scripts/hide-next-version.cjs

const fs = require('fs');
const path = require('path');

// Regex aprimorada: busca por 'version' com ou sem aspas ao redor da chave.
// Ex: vai corresponder a {"version":"15.3.4"} e a {version:"15.3.4"}
const versionRegex = /(?:"version"|version):"[^"]*"/g;

// Função para percorrer diretórios recursivamente e modificar arquivos
function processDirectory(directory) {
  try {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else {
        // Processa qualquer arquivo que possa conter a string, não apenas .js
        try {
          let content = fs.readFileSync(fullPath, 'utf8');
          let matchFound = false;

          // Substitui todas as ocorrências encontradas pela regex
          const newContent = content.replace(versionRegex, (match) => {
            matchFound = true;
            // Mantém a chave (version ou "version") e apenas zera o valor
            const key = match.split(':')[0];
            return `${key}:""`;
          });
          
          if (matchFound) {
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`Versão do Next.js removida de: ${fullPath}`);
          }
        } catch (readErr) {
          // Ignora arquivos que não podem ser lidos como texto (ex: binários)
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

// Caminhos dos diretórios e arquivos a serem processados
const nextDir = path.join(process.cwd(), '.next');

if (fs.existsSync(nextDir)) {
  console.log('Procurando pela versão do Next.js nos arquivos de build...');
  processDirectory(nextDir);
} else {
  console.warn(`Diretório .next não encontrado. Execute o build primeiro.`);
}

console.log('Processo de remoção da versão concluído.');
