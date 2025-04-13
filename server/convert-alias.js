const fs = require('fs')
const path = require('path')
const { glob } = require('glob')

const alias = '~'
const aliasPath = './src' // Tương ứng với "~" trong paths

// Hàm để chuyển alias thành đường dẫn tương đối
function resolveAlias(filePath, importPath) {
  if (!importPath.startsWith(alias)) return importPath
  const absolutePath = path.join(aliasPath, importPath.slice(alias.length))
  return path.relative(path.dirname(filePath), absolutePath).replace(/\\/g, '/')
}

// Tìm tất cả tệp JS/TS trong dự án
glob('**/*.{js,ts,jsx,tsx}', { ignore: ['node_modules/**'] }).then( (files) => {
  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8')
    const updatedContent = content.replace(
      /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
      (match, importPath) => {
        const resolvedPath = resolveAlias(file, importPath)
        return match.replace(importPath, resolvedPath)
      }
    )

    if (updatedContent !== content) {
      fs.writeFileSync(file, updatedContent, 'utf-8')
      // eslint-disable-next-line no-console
      console.log(`Updated imports in ${file}`)
    }
  })
}).catch((err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error('Error reading files:', err)
    return
  }
})