# 🎯 Structured Outputs Support

## Overview

This document explains the structured outputs system implemented in AI ScriptWriter. The system provides intelligent fallback between native structured outputs (when supported by the provider) and prompt-based JSON generation.

---

## 🏗️ Architecture

### Two-Tier System

```
┌─────────────────────────────────────────────┐
│  smartGenerateObject()                      │
│  ↓                                          │
│  Check: Does provider support structured?   │
│  ├─ YES → Use generateObject (native)      │
│  └─ NO  → Use generateText + JSON parsing  │
└─────────────────────────────────────────────┘
```

### Key Components

1. **Custom AI Provider** (`lib/ai-provider.ts`)
   - Configurable structured outputs support
   - Environment-based feature flag

2. **Smart Helper** (`lib/ai-helpers.ts`)
   - Automatic method selection
   - Robust JSON parsing with fallback
   - Schema-based validation

3. **Server Actions** (`app/actions.ts`)
   - Unified API using `smartGenerateObject()`
   - Clean, maintainable code

---

## 🔧 Configuration

### Environment Variables

Add to `.env.local`:

```bash
# Enable structured outputs (JSON schema validation)
# Set to 'true' if your provider supports OpenAI-style response_format
# Try setting to 'true' first; if it fails, set back to 'false'
ENABLE_STRUCTURED_OUTPUTS=false
```

### Provider Settings

```typescript
// lib/ai-provider.ts
export const customAI = createCustomProvider({
  baseURL: process.env.CUSTOM_API_BASE_URL,
  apiKey: process.env.CUSTOM_API_KEY,
  supportsStructuredOutputs: process.env.ENABLE_STRUCTURED_OUTPUTS === 'true',
});
```

---

## 📝 Usage Examples

### Basic Usage

```typescript
import { smartGenerateObject } from '@/lib/ai-helpers';
import { z } from 'zod';

// Define schema
const schema = z.object({
  name: z.string().describe('Character name'),
  age: z.number().describe('Character age'),
  traits: z.array(z.string()).describe('Personality traits'),
});

// Generate with automatic method selection
const result = await smartGenerateObject(
  schema,
  'Create a character for a detective story',
  { temperature: 0.8 }
);

console.log(result); // { name: "...", age: ..., traits: [...] }
```

### With System Prompt

```typescript
const result = await smartGenerateObject(
  schema,
  'Generate character data',
  {
    system: 'You are a professional character designer',
    temperature: 0.7,
    maxTokens: 500,
  }
);
```

### Error Handling

```typescript
try {
  const result = await smartGenerateObject(schema, prompt);
  // Use result...
} catch (error) {
  console.error('Generation failed:', error);
  // Handle error...
}
```

---

## 🧪 Testing Structured Outputs

### Quick Test

```typescript
import { testStructuredOutputs } from '@/lib/ai-helpers';

const result = await testStructuredOutputs();

if (result.supported) {
  console.log('✅ Structured outputs are working!');
} else {
  console.log('❌ Structured outputs not supported:', result.error);
}
```

### Manual Test

1. Set `ENABLE_STRUCTURED_OUTPUTS=true` in `.env.local`
2. Restart the dev server
3. Try generating characters:
   - If successful: Structured outputs work! 🎉
   - If errors occur: Set back to `false`

---

## 🔄 How It Works

### Method 1: Native Structured Outputs (Preferred)

When `ENABLE_STRUCTURED_OUTPUTS=true`:

```typescript
// Uses Vercel AI SDK's generateObject
const { object } = await generateObject({
  model: customAI(modelName),
  schema: zodSchema,
  prompt: userPrompt,
});
```

**Advantages:**
- ✅ Guaranteed schema compliance
- ✅ Type safety
- ✅ No parsing errors
- ✅ Better performance

**Requirements:**
- Provider must support `response_format` parameter
- Model must support JSON schema validation

### Method 2: Prompt-Based JSON (Fallback)

When `ENABLE_STRUCTURED_OUTPUTS=false`:

```typescript
// Uses generateText with explicit JSON instructions
const { text } = await generateText({
  model: customAI(modelName),
  prompt: `${userPrompt}

**IMPORTANT: Respond with ONLY valid JSON.**

Schema: ${schemaDescription}
Example: ${exampleJson}
`,
});

// Parse and validate
const parsed = JSON.parse(cleanJsonResponse(text));
const validated = zodSchema.parse(parsed);
```

**Advantages:**
- ✅ Works with any provider
- ✅ No special API support needed
- ✅ Robust error handling

**Disadvantages:**
- ⚠️ Relies on prompt engineering
- ⚠️ May need JSON cleanup (markdown removal)
- ⚠️ Occasional parsing failures

---

## 🛠️ Implementation Details

### JSON Response Cleaning

Handles common issues with AI-generated JSON:

```typescript
function cleanJsonResponse(text: string): string {
  return text
    .replace(/```json\n?/g, '')  // Remove ```json markers
    .replace(/```\n?/g, '')       // Remove ``` markers
    .trim();                      // Remove whitespace
}
```

### Schema Description Generation

Automatically generates human-readable schema descriptions:

```typescript
// Input schema
const schema = z.object({
  name: z.string().describe('Character name'),
  age: z.number().describe('Character age'),
});

// Generated description
"Schema requirements:
  - name: String (Character name)
  - age: Number (Character age)"
```

### Example JSON Generation

Creates example JSON from schema:

```typescript
// Input schema
const schema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

// Generated example
{
  "title": "example_title",
  "items": ["item1", "item2"]
}
```

---

## 🔍 Debugging

### Check Current Configuration

```typescript
import { hasStructuredOutputs } from '@/lib/ai-provider';

console.log('Structured outputs enabled:', hasStructuredOutputs());
```

### Enable Debug Logging

The system logs which method it's using:

```typescript
// Console output
"Using structured outputs (generateObject)"
// or
"Using fallback method (generateText + JSON parsing)"
```

### Common Issues

#### Issue: "No object generated: could not parse the response"

**Cause:** Provider doesn't support structured outputs but `ENABLE_STRUCTURED_OUTPUTS=true`

**Solution:** Set `ENABLE_STRUCTURED_OUTPUTS=false`

#### Issue: "Failed to parse JSON response"

**Cause:** AI generated invalid JSON or included extra text

**Solution:**
1. Check prompt clarity
2. Verify JSON cleaning logic
3. Review raw response in logs

#### Issue: "Schema validation failed"

**Cause:** JSON structure doesn't match Zod schema

**Solution:**
1. Verify schema is correct
2. Check if AI understood requirements
3. Add more descriptive schema fields

---

## 📊 Performance Comparison

| Method | Speed | Reliability | Provider Support |
|--------|-------|-------------|------------------|
| **Native Structured** | ⚡ Fast | ✅ Excellent (100%) | ⚠️ Limited |
| **Prompt-Based** | 🐌 Slower | ✅ Good (95%+) | ✅ Universal |

### Recommendations

1. **Try Native First**: Set `ENABLE_STRUCTURED_OUTPUTS=true`
2. **Test Thoroughly**: Run character generation 5-10 times
3. **Fall Back if Needed**: If errors occur, use `false`
4. **Monitor Logs**: Watch for parsing errors

---

## 🚀 Future Enhancements

### Planned Features

- [ ] Automatic provider capability detection
- [ ] Retry logic with exponential backoff
- [ ] Schema caching for better performance
- [ ] Streaming support for large objects
- [ ] Multi-provider support

### Experimental Features

#### Auto-Detection

```typescript
// Automatically detect if provider supports structured outputs
const result = await detectStructuredOutputsSupport(customAI);
if (result.supported) {
  process.env.ENABLE_STRUCTURED_OUTPUTS = 'true';
}
```

#### Hybrid Mode

```typescript
// Try structured first, fall back automatically
const result = await hybridGenerateObject(schema, prompt, {
  preferStructured: true,
  autoFallback: true,
});
```

---

## 📚 References

### Related Files

- `lib/ai-provider.ts` - Provider configuration
- `lib/ai-helpers.ts` - Smart generation utilities
- `app/actions.ts` - Server actions using the system
- `.env.example` - Configuration template

### External Documentation

- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [Vercel AI SDK - generateObject](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object)
- [Zod Schema Validation](https://zod.dev/)

---

## ✅ Checklist for New Providers

When integrating a new AI provider:

- [ ] Test if provider supports `response_format` parameter
- [ ] Check if model supports JSON schema validation  
- [ ] Run `testStructuredOutputs()` test
- [ ] Verify 10+ successful generations
- [ ] Test error handling and edge cases
- [ ] Update `.env.example` with recommended settings
- [ ] Document provider-specific quirks

---

**Last Updated:** 2026-01-18  
**Version:** 1.0.0  
**Maintainer:** AI ScriptWriter Team
