/**
 * AI Helper utilities for handling structured outputs with fallback
 * 
 * This module provides smart wrappers that automatically use generateObject
 * when structured outputs are supported, or fall back to generateText with
 * JSON parsing when they're not.
 */

import { generateObject, generateText } from 'ai';
import { z, ZodSchema } from 'zod';
import { customAI, getModelName, hasStructuredOutputs } from './ai-provider';

/**
 * Configuration for smart generate calls
 */
export interface SmartGenerateConfig {
  temperature?: number;
  maxTokens?: number;
  system?: string;
}

/**
 * Cleans markdown code blocks from JSON responses
 */
function cleanJsonResponse(text: string): string {
  return text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
}

/**
 * Smart object generation that uses structured outputs when available,
 * falls back to prompt engineering + JSON parsing otherwise.
 * 
 * @param schema - Zod schema for the expected output
 * @param prompt - User prompt for generation
 * @param config - Optional configuration (temperature, etc.)
 * @returns Parsed object matching the schema
 */
export async function smartGenerateObject<T extends ZodSchema>(
  schema: T,
  prompt: string,
  config: SmartGenerateConfig = {}
): Promise<z.infer<T>> {
  const model = customAI(getModelName(), {
    temperature: config.temperature ?? 0.7,
    maxTokens: config.maxTokens,
  });

  // Try using structured outputs if supported
  if (hasStructuredOutputs()) {
    try {
      console.log('Using structured outputs (generateObject)');
      const { object } = await generateObject({
        model,
        schema,
        prompt: config.system ? `${config.system}\n\n${prompt}` : prompt,
      });
      return object as z.infer<T>;
    } catch (error) {
      console.warn('Structured outputs failed, falling back to JSON parsing:', error);
      // Fall through to fallback method
    }
  }

  // Fallback: Use generateText with explicit JSON formatting instructions
  console.log('Using fallback method (generateText + JSON parsing)');
  
  // Build a comprehensive prompt that requests JSON
  const jsonPrompt = `${config.system ? config.system + '\n\n' : ''}${prompt}

**IMPORTANT: You must respond with ONLY valid JSON that matches this exact schema. No markdown, no explanations, just pure JSON.**

Schema requirements:
${generateSchemaDescription(schema)}

Example format:
\`\`\`json
${generateExampleJson(schema)}
\`\`\`

Now generate the response as pure JSON (no markdown formatting):`;

  const { text } = await generateText({
    model,
    prompt: jsonPrompt,
  });

  // Clean and parse the response
  try {
    const cleanedText = cleanJsonResponse(text);
    const parsed = JSON.parse(cleanedText);
    
    // Validate against schema
    const validated = schema.parse(parsed);
    return validated as z.infer<T>;
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    console.error('Raw response:', text);
    throw new Error(
      `Failed to generate valid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate a human-readable description of a Zod schema
 */
function generateSchemaDescription(schema: ZodSchema): string {
  // This is a simplified version - could be enhanced
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shape = (schema as any)._def?.shape?.();
  if (!shape) return 'JSON object';
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = Object.entries(shape).map(([key, value]: [string, any]) => {
    const type = value._def?.typeName?.replace('Zod', '') || 'unknown';
    const description = value._def?.description || '';
    return `  - ${key}: ${type}${description ? ` (${description})` : ''}`;
  });
  
  return fields.join('\n');
}

/**
 * Generate an example JSON structure from a Zod schema
 */
function generateExampleJson(schema: ZodSchema): string {
  // This is a simplified example generator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shape = (schema as any)._def?.shape?.();
  if (!shape) return '{}';
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const example: Record<string, any> = {};
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.entries(shape).forEach(([key, value]: [string, any]) => {
    const typeName = value._def?.typeName;
    
    switch (typeName) {
      case 'ZodString':
        example[key] = `example_${key}`;
        break;
      case 'ZodNumber':
        example[key] = 0;
        break;
      case 'ZodBoolean':
        example[key] = false;
        break;
      case 'ZodArray':
        example[key] = ['item1', 'item2'];
        break;
      case 'ZodObject':
        example[key] = { nested: 'value' };
        break;
      default:
        example[key] = null;
    }
  });
  
  return JSON.stringify(example, null, 2);
}

/**
 * Test if structured outputs are working with the current provider
 */
export async function testStructuredOutputs(): Promise<{
  supported: boolean;
  error?: string;
}> {
  const testSchema = z.object({
    test: z.string().describe('A test string'),
    number: z.number().describe('A test number'),
  });

  try {
    const model = customAI(getModelName(), { temperature: 0 });
    const { object } = await generateObject({
      model,
      schema: testSchema,
      prompt: 'Generate test data with test="success" and number=42',
    });
    
    if (object.test && object.number === 42) {
      return { supported: true };
    }
    
    return {
      supported: false,
      error: 'Response did not match expected structure',
    };
  } catch (error) {
    return {
      supported: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
