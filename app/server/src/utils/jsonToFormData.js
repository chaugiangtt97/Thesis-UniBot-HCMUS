export function jsonToFormData(json) {
  const formData = new FormData()

  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      const value = json[key]

      if (typeof value === 'object' && value !== null ) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value)
      }
    }
  }
  console.log(json)
  console.log(formData)
  return formData
}

export default jsonToFormData