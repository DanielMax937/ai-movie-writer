import { ScriptLine } from '@/types/script';

/**
 * Format script lines into Fountain format (screenplay standard)
 */
export function formatToFountain(scriptLines: ScriptLine[]): string {
  return scriptLines
    .map((line) => {
      switch (line.type) {
        case 'header':
          return `Title: ${line.content}\n`;
        
        case 'scene_heading':
          return `\n${line.content}\n`;
        
        case 'action':
          return `\n${line.content}\n`;
        
        case 'dialogue':
          return `\n${line.speaker}\n${line.content}\n`;
        
        default:
          return '';
      }
    })
    .join('');
}

/**
 * Format script lines into plain text
 */
export function formatToPlainText(scriptLines: ScriptLine[]): string {
  return scriptLines
    .map((line) => {
      switch (line.type) {
        case 'header':
          return `${line.content}\n${'='.repeat(line.content.length)}\n`;
        
        case 'scene_heading':
          return `\n${line.content}\n${'-'.repeat(line.content.length)}\n`;
        
        case 'action':
          return `\n${line.content}\n`;
        
        case 'dialogue':
          return `\n【${line.speaker}】\n${line.content}\n`;
        
        default:
          return '';
      }
    })
    .join('');
}

/**
 * Export script as text file
 */
export function exportAsText(scriptLines: ScriptLine[], filename: string = 'script.txt') {
  const content = formatToPlainText(scriptLines);
  downloadFile(content, filename, 'text/plain');
}

/**
 * Export script as Fountain file
 */
export function exportAsFountain(scriptLines: ScriptLine[], filename: string = 'script.fountain') {
  const content = formatToFountain(scriptLines);
  downloadFile(content, filename, 'text/plain');
}

/**
 * Helper function to trigger file download
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy script to clipboard
 */
export async function copyToClipboard(scriptLines: ScriptLine[]): Promise<boolean> {
  try {
    const content = formatToPlainText(scriptLines);
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
