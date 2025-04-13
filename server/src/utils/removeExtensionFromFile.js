/**
 * Removes extension from file
 * @param {string} file - filename
 */
const removeExtensionFromFile = (file) => {
  return file.split('.').slice(0, -1).join('.').toString()
}

export default { removeExtensionFromFile }
