/**
 * Character name normalization and matching utilities
 * Handles variations in character names from AI-generated content
 */

/**
 * Normalize a character name for comparison
 * - Removes parentheses and their content: "张三（侦探）" → "张三"
 * - Trims whitespace
 * - Removes common punctuation
 * - Converts to lowercase for case-insensitive comparison
 * 
 * @param name - The character name to normalize
 * @returns Normalized name string
 */
export function normalizeCharacterName(name: string): string {
  return name
    // Remove parentheses and their content (both () and （）)
    .replace(/[（(].*?[）)]/g, '')
    // Remove common punctuation
    .replace(/[：:，,。.！!？?]/g, '')
    // Trim whitespace
    .trim()
    // Normalize whitespace (multiple spaces to single space)
    .replace(/\s+/g, ' ')
    // Convert to lowercase for case-insensitive matching
    .toLowerCase();
}

/**
 * Check if two character names match (fuzzy matching)
 * 
 * @param name1 - First character name
 * @param name2 - Second character name
 * @returns true if names match after normalization
 */
export function characterNamesMatch(name1: string, name2: string): boolean {
  const normalized1 = normalizeCharacterName(name1);
  const normalized2 = normalizeCharacterName(name2);
  
  // Exact match after normalization
  if (normalized1 === normalized2) {
    return true;
  }
  
  // Check if one name contains the other (for cases like "李四" vs "李四医生")
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  return false;
}

/**
 * Find a character by name with fuzzy matching
 * 
 * @param characters - Array of characters to search
 * @param targetName - Name to search for
 * @returns Matching character or undefined
 */
export function findCharacterByName<T extends { name: string }>(
  characters: T[],
  targetName: string
): T | undefined {
  return characters.find((char) => 
    characterNamesMatch(char.name, targetName)
  );
}

/**
 * Filter characters by a list of names with fuzzy matching
 * 
 * @param characters - Array of characters to filter
 * @param targetNames - Array of names to match against
 * @returns Array of matching characters
 */
export function filterCharactersByNames<T extends { name: string }>(
  characters: T[],
  targetNames: string[]
): T[] {
  return characters.filter((char) =>
    targetNames.some((targetName) => characterNamesMatch(char.name, targetName))
  );
}

/**
 * Create a character name mapping for quick lookup
 * Maps normalized names to original character objects
 * 
 * @param characters - Array of characters
 * @returns Map of normalized names to characters
 */
export function createCharacterNameMap<T extends { name: string }>(
  characters: T[]
): Map<string, T> {
  const map = new Map<string, T>();
  
  for (const char of characters) {
    const normalized = normalizeCharacterName(char.name);
    map.set(normalized, char);
  }
  
  return map;
}
