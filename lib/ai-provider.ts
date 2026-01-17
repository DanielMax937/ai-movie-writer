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
    return new OpenAICompatibleChatLanguageModel(
      modelId,
      {
        provider: 'custom.chat',
        url: ({ path }) => `${baseURL}${path}`,
        headers: getHeaders,
        fetch: options.fetch,
        ...settings,
      }
    );
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
});

// Helper to get the configured model name
export const getModelName = () => {
  return process.env.CUSTOM_MODEL_NAME ?? 'ep-20251202111822-hw4kl';
};
