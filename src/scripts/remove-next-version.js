import fs from 'fs'
import path from 'path'

// Remove ou mascara a versão do Next.js dos arquivos JS
function removeNextVersion(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file)
    if (fs.lstatSync(fullPath).isDirectory()) {
      removeNextVersion(fullPath)
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      content = content.replace(/version:"[\d.]+"/g, 'version:"hidden"')
      fs.writeFileSync(fullPath, content, 'utf8')
    }
  })
}

// Remove todas as tags <script> e <link rel="preload" as="script" ...> dos arquivos HTML
function cleanHtml(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file)
    if (fs.lstatSync(fullPath).isDirectory()) {
      cleanHtml(fullPath)
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      // Remove todas as tags <script>...</script>
      content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove tags <link rel="preload" as="script" ...>
      content = content.replace(/<link\s+[^>]*rel=["']preload["'][^>]*as=["']script["'][^>]*>/gi, '')
      fs.writeFileSync(fullPath, content, 'utf8')
    }
  })
}

// Execute as funções nos diretórios desejados
removeNextVersion('./.next/static/chunks') // JS gerado pelo Next.js
cleanHtml('./.next/server/app') // HTML gerado pelo Next.js (ajuste o caminho se necessário)
