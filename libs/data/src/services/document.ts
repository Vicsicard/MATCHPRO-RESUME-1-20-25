import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

export function detectFileType(filename: string): 'pdf' | 'docx' | 'unknown' {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  return 'unknown';
}

export async function extractTextFromDocument(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const fileType = detectFileType(filename);

  switch (fileType) {
    case 'pdf':
      return extractTextFromPDF(buffer);
    case 'docx':
      return extractTextFromDOCX(buffer);
    default:
      throw new Error('Unsupported file type');
  }
}

export const DocumentService = {
  extractTextFromPDF,
  extractTextFromDOCX,
  detectFileType,
  extractTextFromDocument,
};
