export function detectFileType(filename: string): 'pdf' | 'docx' | 'unknown' {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  return 'unknown';
}

export async function extractTextFromDocument(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/document', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to process document');
  }

  const data = await response.json();
  return data.text;
}

export const DocumentClient = {
  detectFileType,
  extractTextFromDocument,
};
