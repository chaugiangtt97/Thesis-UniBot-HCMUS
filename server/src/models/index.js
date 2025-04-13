import { readdirSync } from 'fs'
const modelsPath = `${__dirname}/`

export const loadModels = () => {
  /*
   * Load models dynamically
   */

  // Loop models path and loads every file as a model except this file
  readdirSync(modelsPath).filter((file) => {
    // Take filename and remove last part (extension)
    const modelFile = file.split('.').slice(0, -1).join('.').toString()
    // Prevents loading of this file
    return modelFile !== 'index' ? require(`./${modelFile}`) : ''
  })
}

export default loadModels
