/**
 * Removes academic bracketed citation markers from reader-facing article text.
 * Full source information remains available through the article's sources field.
 */
export function removeInlineCitationMarkers(text: string): string {
  return text.replace(/\s*\[\d+(?:\s*[-,–]\s*\d+)*\]/g, "");
}
