/**
 * Server-side configuration for AI provider
 * This file should only be imported in server components or server actions
 */

export interface AIProviderConfig {
  baseURL: string;
  apiKey: string;
  model: string;
  supportsStructuredOutputs: boolean;
}

/**
 * Get AI provider configuration from environment variables
 * This function can only be called server-side
 */
export function getAIProviderConfig(): AIProviderConfig {
  const baseURL = process.env.CUSTOM_AI_BASE_URL;
  const apiKey = process.env.CUSTOM_AI_API_KEY;
  const model = process.env.CUSTOM_AI_MODEL;
  const supportsStructuredOutputs = 
    process.env.ENABLE_STRUCTURED_OUTPUTS === 'true';

  if (!baseURL) {
    throw new Error('CUSTOM_AI_BASE_URL environment variable is required');
  }

  if (!apiKey) {
    throw new Error('CUSTOM_AI_API_KEY environment variable is required');
  }

  if (!model) {
    throw new Error('CUSTOM_AI_MODEL environment variable is required');
  }

  return {
    baseURL,
    apiKey,
    model,
    supportsStructuredOutputs,
  };
}

/**
 * Validate that required environment variables are set
 * Should be called during application startup
 */
export function validateEnvironmentVariables(): void {
  const missing: string[] = [];

  if (!process.env.CUSTOM_AI_BASE_URL) {
    missing.push('CUSTOM_AI_BASE_URL');
  }

  if (!process.env.CUSTOM_AI_API_KEY) {
    missing.push('CUSTOM_AI_API_KEY');
  }

  if (!process.env.CUSTOM_AI_MODEL) {
    missing.push('CUSTOM_AI_MODEL');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n\n` +
      'Please create a .env.local file with:\n' +
      missing.map(name => `${name}=your_value_here`).join('\n')
    );
  }
}
