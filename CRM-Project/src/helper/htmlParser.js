function extractTextFromHTML(htmlString) {
  if (htmlString != undefined) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  }
  {
    return "";
  }
}
export default extractTextFromHTML;
