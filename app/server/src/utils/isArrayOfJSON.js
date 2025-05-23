export function isArrayOfJSON(meta) {
  if (!Array.isArray(meta)) return false

  return meta.every(item => {
    if (typeof item !== 'string') return false

    try {
      const parsed = JSON.parse(item)
      return typeof parsed === 'object' && parsed !== null
    } catch (e) {
      return false
    }
  })
}

export default isArrayOfJSON