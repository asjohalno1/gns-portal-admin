import dayjs from "dayjs";
import moment from "moment"
import { useCallback, useRef } from "react";



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


export const getDocumentType = (path) => {
    const ext = path.split('.').pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
        return "image";
    }
    if (["pdf"].includes(ext)) {
        return "pdf";
    }
    return "unsupported";
};

export const downloadFile = async (filePath, baseUrl = import.meta.env.VITE_API_BASE_URL_IMAGE, customFilename = null) => {
    try {
        if (!filePath) {
            throw new Error('File path is required');
        }

        const url = `${baseUrl}${filePath}`;
        const filename = customFilename || filePath.split("/").pop() || "document";

        // Fetch the file as blob
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch file");
        }

        const blob = await response.blob();

        // Create blob URL and trigger download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
        console.error("Download failed:", error);
        throw error;
    }
};

export const getTime = (date) => {
    return moment(date).format("hh:mm A");
};




export const PERMISSIONS = [
    { key: "send_reminder", label: "Send Reminder" },
    { key: "generate_document_request", label: "Generate Document Request" },
    { key: "approve_document", label: "Approve Document" },
    { key: "reject_document", label: "Reject Document" },
    { key: "approve_entire_request", label: "Approve Entire Document Request" },
    { key: "add_mapping", label: "Add Mapping" }
];
