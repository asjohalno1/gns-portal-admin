import dayjs from "dayjs";


export const formatDate = (date) => {
    if (!date) return "";
    return dayjs(date).format("YYYY-MM-DD");
}

/**
 * Converts HTML to plain text by stripping tags and decoding HTML entities
 * @param {string} html - The HTML string to convert
 * @returns {string} Plain text version of the input
 */
export const getPlainText = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let text = tempDiv.textContent || tempDiv.innerText || '';
    text = text
        .replace(/\s+/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();

    return text;
};

export default getPlainText;