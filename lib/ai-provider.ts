import {
  OpenAICompatibleChatLanguageModel,
} from '@ai-sdk/openai-compatible';
import {
  FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils';

export interface CustomProviderSettings {
  /**
   * Custom API key for the provider.
   */
  apiKey?: string;
  /**
   * Base URL for the API calls.
   */
  baseURL?: string;
  /**
   * Custom headers to include in the requests.
   */
  headers?: Record<string, string>;
  /**
   * Custom fetch implementation.
   */
  fetch?: FetchFunction;
  /**
   * Whether the provider supports structured outputs (JSON schema).
   * Set to true if your provider supports OpenAI-style response_format.
   */
  supportsStructuredOutputs?: boolean;
}

export interface CustomChatSettings {
  /**
   * Temperature setting for the model (0-2).
   */
  temperature?: number;
  /**
   * Maximum number of tokens to generate.
   */
  maxTokens?: number;
  /**
   * Top P sampling parameter.
   */
  topP?: number;
  /**
   * Frequency penalty.
   */
  frequencyPenalty?: number;
  /**
   * Presence penalty.
   */
  presencePenalty?: number;
  /**
   * Enable JSON mode for structured outputs.
   * When true, forces the model to output valid JSON.
   */
  jsonMode?: boolean;
}

export interface CustomProvider {
  /**
   * Creates a model for text generation.
   */
  (
    modelId: string,
    settings?: CustomChatSettings,
  ): OpenAICompatibleChatLanguageModel;

  /**
   * Creates a chat model for text generation.
   */
  chatModel(
    modelId: string,
    settings?: CustomChatSettings,
  ): OpenAICompatibleChatLanguageModel;
}

export function createCustomProvider(
  options: CustomProviderSettings = {},
): CustomProvider {
  const baseURL = withoutTrailingSlash(
    options.baseURL ?? process.env.CUSTOM_API_BASE_URL ?? '',
  );
  
  const supportsStructuredOutputs = options.supportsStructuredOutputs ?? false;
  
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'CUSTOM_API_KEY',
      description: 'Custom AI Provider API key',
    })}`,
    ...options.headers,
  });

  const createChatModel = (
    modelId: string,
    settings: CustomChatSettings = {},
  ) => {
    // Build the configuration for OpenAI-compatible model
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = {
      provider: 'custom.chat',
      url: ({ path }: { path: string }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch,
    };

    // If the provider supports structured outputs, enable it
    if (supportsStructuredOutputs) {
      config.structuredOutputs = true;
    }

    // If JSON mode is explicitly requested and provider doesn't support structured outputs,
    // we can try to request JSON format via system prompt (fallback)
    if (settings.jsonMode && !supportsStructuredOutputs) {
      console.warn(
        'JSON mode requested but provider does not support structured outputs. ' +
        'Will rely on prompt engineering for JSON output.'
      );
    }

    // Add any additional settings
    if (settings.temperature !== undefined) config.temperature = settings.temperature;
    if (settings.maxTokens !== undefined) config.maxTokens = settings.maxTokens;
    if (settings.topP !== undefined) config.topP = settings.topP;
    if (settings.frequencyPenalty !== undefined) config.frequencyPenalty = settings.frequencyPenalty;
    if (settings.presencePenalty !== undefined) config.presencePenalty = settings.presencePenalty;

    return new OpenAICompatibleChatLanguageModel(modelId, config);
  };

  const provider = (
    modelId: string,
    settings?: CustomChatSettings,
  ) => createChatModel(modelId, settings);

  provider.chatModel = createChatModel;

  return provider;
}

// Export default instance with environment variables
// Note: These will be undefined during build time, which is expected
export const customAI = createCustomProvider({
  baseURL: process.env.CUSTOM_API_BASE_URL,
  apiKey: process.env.CUSTOM_API_KEY,
  // Enable if your provider supports OpenAI-style structured outputs
  // For Volcengine Ark, we'll test if this works; if not, we'll use the fallback
  supportsStructuredOutputs: process.env.ENABLE_STRUCTURED_OUTPUTS === 'true',
});

// Helper to get the configured model name
export const getModelName = () => {
  return process.env.CUSTOM_MODEL_NAME ?? 'ep-20251202111822-hw4kl';
};

/**
 * Check if structured outputs are enabled
 */
export const hasStructuredOutputs = () => {
  return process.env.ENABLE_STRUCTURED_OUTPUTS === 'true';
};
