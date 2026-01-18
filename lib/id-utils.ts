/**
 * ID generation utilities for ensuring unique identifiers
 */

/**
 * Global counter for generating sequential IDs
 * Resets to 0 on page load
 */
let idCounter = 0;

/**
 * Generate a unique ID using multiple entropy sources
 * Combines: timestamp, counter, and random value
 * 
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 */
export function generateUniqueId(prefix = ''): string {
  const timestamp = Date.now();
  const counter = ++idCounter;
  const random = Math.floor(Math.random() * 10000);
  
  const id = `${timestamp}_${counter}_${random}`;
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Generate a shorter unique ID for performance-critical operations
 * Uses base36 encoding to keep IDs shorter
 * 
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 */
export function generateShortId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const counter = (++idCounter).toString(36);
  const random = Math.floor(Math.random() * 1296).toString(36); // 36^2 = 1296
  
  const id = `${timestamp}${counter}${random}`;
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Reset the ID counter
 * Useful for testing or when starting fresh sessions
 */
export function resetIdCounter(): void {
  idCounter = 0;
}

/**
 * Get the current counter value
 * Useful for debugging
 */
export function getIdCounter(): number {
  return idCounter;
}
