import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker - use local bundled worker
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

/**
 * Clean and normalize extracted text to remove formatting artifacts
 */
function cleanExtractedText(text: string): string {
    return text
        // Remove excessive whitespace
        .replace(/\s+/g, ' ')
        // Remove control characters
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        // Normalize line breaks
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        // Remove multiple consecutive line breaks
        .replace(/\n{3,}/g, '\n\n')
        // Trim each line and remove empty lines
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n')
        .trim();
}

/**
 * Parse PDF file and extract text
 */
export async function parsePDF(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();

        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            useWorkerFetch: false,
            isEvalSupported: false,
            useSystemFonts: true,
        });

        const pdf = await loadingTask.promise;
        let fullText = '';

        // Extract text from all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            // Extract text items and join them with spaces
            const pageText = textContent.items
                .map((item: any) => {
                    if ('str' in item) {
                        return item.str;
                    }
                    return '';
                })
                .filter(text => text.trim().length > 0)
                .join(' ');

            fullText += pageText + '\n\n';
        }

        const trimmedText = fullText.trim();

        if (!trimmedText || trimmedText.length < 10) {
            throw new Error('No readable text found in PDF. The PDF might be image-based or corrupted.');
        }

        // Clean and normalize the extracted text
        return cleanExtractedText(trimmedText);
    } catch (error: any) {
        console.error('PDF parsing error:', error);

        if (error.message?.includes('No readable text')) {
            throw error;
        }

        throw new Error('Failed to parse PDF file. Please ensure it\'s a valid, text-based PDF (not a scanned image).');
    }
}

/**
 * Parse DOCX file and extract text
 */
export async function parseDOCX(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });

        if (!result.value || result.value.trim().length === 0) {
            throw new Error('No text content found in DOCX file');
        }

        // Clean and normalize the extracted text
        return cleanExtractedText(result.value);
    } catch (error) {
        console.error('DOCX parsing error:', error);
        throw new Error('Failed to parse DOCX file. Please ensure it\'s a valid Word document.');
    }
}

/**
 * Parse TXT file and extract text
 */
export async function parseTXT(file: File): Promise<string> {
    try {
        const text = await file.text();

        if (!text || text.trim().length === 0) {
            throw new Error('No text content found in file');
        }

        return text.trim();
    } catch (error) {
        console.error('TXT parsing error:', error);
        throw new Error('Failed to read text file.');
    }
}

/**
 * Main function to parse resume file based on type
 */
export async function parseResumeFile(file: File): Promise<string> {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('File size exceeds 5MB limit. Please upload a smaller file.');
    }

    // Validate file is not empty
    if (file.size === 0) {
        throw new Error('File is empty. Please upload a valid resume.');
    }

    // Parse based on file type
    if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
        return await parsePDF(file);
    } else if (
        fileName.endsWith('.docx') ||
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        return await parseDOCX(file);
    } else if (
        fileName.endsWith('.txt') ||
        fileType === 'text/plain'
    ) {
        return await parseTXT(file);
    } else if (fileName.endsWith('.doc')) {
        throw new Error('Legacy .doc files are not supported. Please convert to .docx or PDF.');
    } else {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files only.');
    }
}

/**
 * Validate file type before parsing
 */
export function validateFileType(file: File): { valid: boolean; error?: string } {
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
        return {
            valid: false,
            error: 'Invalid file type. Please upload PDF, DOCX, or TXT files only.'
        };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File size exceeds 5MB limit.'
        };
    }

    if (file.size === 0) {
        return {
            valid: false,
            error: 'File is empty.'
        };
    }

    return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
