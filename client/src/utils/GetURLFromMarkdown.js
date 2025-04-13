export const GetURLFromMarkdown = (text) => {
    const markdown =  text.replace(
        /(https?:\/\/[^\s]+)/g,
        (url) => 
          url.length >  50 ? 
          `<a href="${url}" style="text-decoration: underline; color: #3919ab" target="_blank" rel="noopener noreferrer"> tại đây </a>`
          : 
          `<a href="${url}" style="text-decoration: underline; color: #3919ab" target="_blank" rel="noopener noreferrer"> ${url} </a>`
      )
    return markdown
}