export const extractContent = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const elements = [...doc.body.children]; // Lấy tất cả các phần tử con của body
  const contentArray = elements.map((el) => el.textContent); // Lấy nội dung văn bản của mỗi phần tử

  return contentArray;
};
