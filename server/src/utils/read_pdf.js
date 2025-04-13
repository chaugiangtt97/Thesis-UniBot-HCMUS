const fs = require('fs')
// const path = require('path')
const pdfParse = require('pdf-parse')


// Đường dẫn tới file PDF
export const read_pdf = async (pdfPath) => {

  return new Promise((resolve, reject) => {
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        return reject('Lỗi khi đọc file PDF')
      }

      pdfParse(data).then((pdfData) => {
        resolve(pdfData.text)
      }).catch(() => {
        reject('Lỗi khi xử lý PDF')
      })
    })
  })

}