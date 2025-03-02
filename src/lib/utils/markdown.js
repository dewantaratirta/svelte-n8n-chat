import MarkdownIt from "markdown-it";
import katex from "katex";

// Import KaTeX CSS in your main CSS file or add to your HTML:
// import "katex/dist/katex.min.css";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

/**
 * Custom function to pre-process and render KaTeX formulas
 * @param {string} content - Text content that might contain math formulas
 * @returns {string} Text with rendered KaTeX HTML
 */
function renderKatexFormulas(content) {
  if (!content) return '';
  
  // Handle display math mode with \[ ... \]
  const displayMathRegex = /\\\\?\[([\s\S]*?)\\\\?\]/g;
  content = content.replace(displayMathRegex, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
        trust: true
      });
    } catch (e) {
      console.error('KaTeX display rendering error:', e);
      return `<div class="katex-error">${match}</div>`;
    }
  });
  
  // Handle inline math mode with \( ... \)
  const inlineMathRegex = /\\\\?\(([\s\S]*?)\\\\?\)/g;
  content = content.replace(inlineMathRegex, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
        trust: true
      });
    } catch (e) {
      console.error('KaTeX inline rendering error:', e);
      return `<span class="katex-error">${match}</span>`;
    }
  });
  
  return content;
}

/**
 * Simple Markdown parser that converts markdown to HTML
 * @param {string} text - Markdown text to parse
 * @returns {string} HTML string
 */
export function parseMarkdown(text) {
  if (!text) return '';
  
  // First process any KaTeX formulas to HTML
  const processedWithKatex = renderKatexFormulas(text);
  
  // Then process the rest with markdown-it
  // We must tell markdown-it not to escape the HTML we just created
  return md.render(processedWithKatex);
}
