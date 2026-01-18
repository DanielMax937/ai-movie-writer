/**
 * Input validation utilities for theme and prompt validation
 * Provides comprehensive validation rules and sanitization
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

export interface ThemeValidationOptions {
  minLength?: number;
  maxLength?: number;
  allowSpecialChars?: boolean;
  allowEmojis?: boolean;
  allowNewlines?: boolean;
  forbiddenWords?: string[];
  requireMinWords?: number;
}

// Default validation options
const DEFAULT_THEME_OPTIONS: Required<ThemeValidationOptions> = {
  minLength: 5,
  maxLength: 200,
  allowSpecialChars: true,
  allowEmojis: true,
  allowNewlines: false,
  forbiddenWords: [],
  requireMinWords: 2,
};

/**
 * Validate and sanitize theme input
 * 
 * @param input - Theme string to validate
 * @param options - Validation options
 * @returns Validation result with error message and sanitized value
 * 
 * @example
 * ```typescript
 * const result = validateTheme('一个赛博侦探的故事');
 * if (!result.isValid) {
 *   console.error(result.error);
 * } else {
 *   console.log('Sanitized:', result.sanitized);
 * }
 * ```
 */
export function validateTheme(
  input: string,
  options: ThemeValidationOptions = {}
): ValidationResult {
  const opts = { ...DEFAULT_THEME_OPTIONS, ...options };

  // Sanitize input first
  const sanitized = sanitizeInput(input, {
    allowNewlines: opts.allowNewlines,
    allowSpecialChars: opts.allowSpecialChars,
    allowEmojis: opts.allowEmojis,
  });

  // Check if empty after sanitization
  if (!sanitized.trim()) {
    return {
      isValid: false,
      error: '请输入电影主题',
    };
  }

  // Check minimum length
  if (sanitized.length < opts.minLength) {
    return {
      isValid: false,
      error: `主题太短，至少需要 ${opts.minLength} 个字符`,
    };
  }

  // Check maximum length
  if (sanitized.length > opts.maxLength) {
    return {
      isValid: false,
      error: `主题太长，最多 ${opts.maxLength} 个字符`,
      sanitized: sanitized.slice(0, opts.maxLength),
    };
  }

  // Check minimum word count
  const wordCount = countWords(sanitized);
  if (wordCount < opts.requireMinWords) {
    return {
      isValid: false,
      error: `主题太简单，至少需要 ${opts.requireMinWords} 个词`,
    };
  }

  // Check forbidden words
  if (opts.forbiddenWords.length > 0) {
    const lowerInput = sanitized.toLowerCase();
    const foundForbidden = opts.forbiddenWords.find((word) =>
      lowerInput.includes(word.toLowerCase())
    );

    if (foundForbidden) {
      return {
        isValid: false,
        error: `主题包含不允许的内容`,
      };
    }
  }

  // Check for suspicious patterns
  const suspiciousResult = checkSuspiciousPatterns(sanitized);
  if (!suspiciousResult.isValid) {
    return suspiciousResult;
  }

  return {
    isValid: true,
    sanitized,
  };
}

/**
 * Sanitize input string
 * Removes dangerous characters and normalizes whitespace
 */
export function sanitizeInput(
  input: string,
  options: {
    allowNewlines?: boolean;
    allowSpecialChars?: boolean;
    allowEmojis?: boolean;
  } = {}
): string {
  let sanitized = input;

  // Trim whitespace
  sanitized = sanitized.trim();

  // Remove control characters (except tab and newline if allowed)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Normalize newlines
  if (!options.allowNewlines) {
    sanitized = sanitized.replace(/\n+/g, ' ');
  } else {
    sanitized = sanitized.replace(/\r\n/g, '\n');
    sanitized = sanitized.replace(/\r/g, '\n');
    // Limit consecutive newlines to 2
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
  }

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Remove emojis if not allowed
  if (!options.allowEmojis) {
    sanitized = removeEmojis(sanitized);
  }

  // Remove/escape special characters if not allowed
  if (!options.allowSpecialChars) {
    // Keep only alphanumeric, basic punctuation, and CJK characters
    sanitized = sanitized.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s.,!?;:'"()\-]/g, '');
  }

  // Remove leading/trailing whitespace again
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Check for suspicious patterns that might indicate spam or malicious input
 */
function checkSuspiciousPatterns(input: string): ValidationResult {
  // Check for excessive repetition
  if (/(.)\1{10,}/.test(input)) {
    return {
      isValid: false,
      error: '主题包含过多重复字符',
    };
  }

  // Check for excessive capitalization (for Latin text)
  const latinChars = input.match(/[a-zA-Z]/g);
  if (latinChars && latinChars.length > 10) {
    const upperCount = (input.match(/[A-Z]/g) || []).length;
    if (upperCount / latinChars.length > 0.7) {
      return {
        isValid: false,
        error: '请不要使用过多大写字母',
      };
    }
  }

  // Check for URL patterns
  if (/https?:\/\/|www\./i.test(input)) {
    return {
      isValid: false,
      error: '主题不能包含网址',
    };
  }

  // Check for email patterns
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(input)) {
    return {
      isValid: false,
      error: '主题不能包含邮箱地址',
    };
  }

  // Check for excessive punctuation
  const punctuationCount = (input.match(/[!?.,;:]/g) || []).length;
  if (punctuationCount > input.length * 0.3) {
    return {
      isValid: false,
      error: '主题包含过多标点符号',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Count words in a string (handles both Latin and CJK text)
 */
function countWords(text: string): number {
  // Count Latin words (separated by spaces)
  const latinWords = text.match(/[a-zA-Z]+/g) || [];

  // Count CJK characters (each character is a word)
  const cjkChars = text.match(/[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff]/g) || [];

  return latinWords.length + cjkChars.length;
}

/**
 * Remove emoji characters from string
 */
function removeEmojis(text: string): string {
  return text.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ''
  );
}

/**
 * Validate file name for export
 */
export function validateFileName(fileName: string): ValidationResult {
  const sanitized = fileName.trim();

  if (!sanitized) {
    return {
      isValid: false,
      error: '文件名不能为空',
    };
  }

  // Check for invalid file name characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
  if (invalidChars.test(sanitized)) {
    return {
      isValid: false,
      error: '文件名包含非法字符',
      sanitized: sanitized.replace(invalidChars, '_'),
    };
  }

  // Check length
  if (sanitized.length > 255) {
    return {
      isValid: false,
      error: '文件名太长',
      sanitized: sanitized.slice(0, 255),
    };
  }

  return {
    isValid: true,
    sanitized,
  };
}

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapes[char]);
}

/**
 * Check if input contains only safe characters for display
 */
export function isSafeForDisplay(text: string): boolean {
  // Check for null bytes
  if (text.includes('\0')) return false;

  // Check for format string attacks
  if (/%[sdxXofFeEgGaAcpn]/.test(text)) return false;

  // Check for script injection attempts
  if (/<script|javascript:|onerror=|onload=/i.test(text)) return false;

  return true;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  // Try to truncate at word boundary
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}
