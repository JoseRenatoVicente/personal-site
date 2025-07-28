import fs from 'node:fs'
import path from 'node:path'

function removeNextVersion(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    if (fs.lstatSync(fullPath).isDirectory()) {
      removeNextVersion(fullPath)
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      content = content.replaceAll(/version:"[\d.]+"/g, 'version:"hidden"')
      fs.writeFileSync(fullPath, content, 'utf8')
    }
  }
}

function cleanHtml(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    if (fs.lstatSync(fullPath).isDirectory()) {
      cleanHtml(fullPath)
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      content = content.replaceAll(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      content = content.replaceAll(/<link\s+[^>]*rel=["']preload["'][^>]*as=["']script["'][^>]*>/gi, '')
      fs.writeFileSync(fullPath, content, 'utf8')
    }
  }
}

removeNextVersion('./.next/static/chunks')
cleanHtml('./.next/server/app')
