# Environment Variables Configuration Guide

This project requires the following environment variables to be configured.

## Setup Instructions

1. Create a `.env.local` file in the project root
2. Copy the variables below and fill in your values
3. **Never commit `.env.local` to version control**

## Required Environment Variables

```bash
# Custom AI Provider Configuration

# Required: Base URL for the OpenAI-compatible API endpoint
# Example for Volcengine Ark: https://ark.cn-beijing.volces.com/api/v3
CUSTOM_AI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3

# Required: API Key for authentication
# Get this from your AI provider's dashboard
CUSTOM_AI_API_KEY=your-api-key-here

# Required: Model identifier/endpoint ID
# Example: ep-20251202111822-hw4kl
CUSTOM_AI_MODEL=your-model-id-here

# Optional: Enable structured outputs (JSON schema validation)
# Set to 'true' if your provider supports OpenAI-style response_format
# Default: false
ENABLE_STRUCTURED_OUTPUTS=false
```

## Important Security Notes

- **ALL** environment variables are server-side only
- They will **NOT** be exposed to the browser
- **DO NOT** prefix with `NEXT_PUBLIC_` as these contain sensitive API keys
- The `.env.local` file is automatically ignored by git

## For Volcengine Ark Users

If you're using Volcengine Ark (火山引擎), use these settings:

```bash
CUSTOM_AI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
CUSTOM_AI_API_KEY=<your-api-key>
CUSTOM_AI_MODEL=<your-endpoint-id>
ENABLE_STRUCTURED_OUTPUTS=false
```

## Troubleshooting

If you see errors about missing environment variables:

1. Ensure `.env.local` exists in the project root
2. Verify all required variables are set
3. Restart the development server after changing environment variables
4. Check that there are no typos in variable names
