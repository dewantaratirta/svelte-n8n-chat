import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

/**
 * Simple Markdown parser that converts markdown to HTML
 * @param {string} text - Markdown text to parse
 * @returns {string} HTML string
 */
export function parseMarkdown(text) {
  console.log(`do this`, text)
  if (!text) return '';
  return md.render(text);
  // return res || text;
}
