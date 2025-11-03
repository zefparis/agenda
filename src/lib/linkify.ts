/**
 * Transforme tous les liens URL en tags HTML cliquables
 */
export function linkifyText(text: string): string {
  // Regex pour détecter les URLs
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/g;
  
  return text.replace(urlRegex, (url) => {
    // Nettoyer l'URL de ponctuation finale éventuelle
    const cleanUrl = url.replace(/[.,;:!?)\]]+$/, '');
    const punctuation = url.slice(cleanUrl.length);
    
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">${cleanUrl}</a>${punctuation}`;
  });
}

/**
 * Transforme le texte en HTML avec liens cliquables
 * Préserve les retours à la ligne
 */
export function formatMessageWithLinks(text: string): string {
  // D'abord linkifier les URLs
  const linkedText = linkifyText(text);
  
  // Convertir les retours à la ligne en <br>
  return linkedText.replace(/\n/g, '<br>');
}
