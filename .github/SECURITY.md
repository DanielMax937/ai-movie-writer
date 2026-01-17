# Security Policy

## 🔒 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## 🛡️ Reporting a Vulnerability

We take the security of AI ScriptWriter seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** Create a Public Issue

Please do not report security vulnerabilities through public GitHub issues.

### 2. Report Privately

Instead, please report security vulnerabilities by:

- **Email**: [Create a security advisory on GitHub](https://github.com/YOUR_USERNAME/ai-movie-writer/security/advisories/new)
- **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature

### 3. Include in Your Report

Please include the following information:

- **Description**: A clear description of the vulnerability
- **Impact**: What kind of impact could an attacker achieve?
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Affected Versions**: Which versions are affected?
- **Suggested Fix**: If you have ideas on how to fix it (optional)
- **Your Contact Info**: How we can reach you for follow-up

### 4. What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Updates**: We'll keep you informed about our progress
- **Credit**: If you wish, we'll credit you in the fix announcement
- **Timeline**: We aim to address critical issues within 7 days

## 🔐 Security Best Practices

When using AI ScriptWriter:

### Environment Variables

- **Never commit** `.env.local` or `.env` files
- **Rotate API keys** regularly
- **Use different keys** for development and production
- **Restrict API key** permissions to minimum required

### Deployment

- **Use HTTPS** in production
- **Set secure headers** (see `DEPLOYMENT.md`)
- **Keep dependencies updated**: Run `npm audit` regularly
- **Review environment** variables before deployment

### API Keys

The application requires API keys for AI providers. To keep them secure:

```bash
# ✅ Good - Use environment variables
CUSTOM_API_KEY=your_key_here

# ❌ Bad - Never hardcode in source
const apiKey = "your_key_here"
```

### Regular Security Checks

```bash
# Check for known vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## 🚨 Known Security Considerations

### 1. API Key Exposure

- API keys are used server-side only
- Never exposed to client browser
- Protected by `.gitignore`

### 2. User Input

- All AI prompts are validated
- Input sanitization in place
- No direct execution of user input

### 3. Dependencies

- Regular updates via Dependabot (if enabled)
- Minimal dependency tree
- Trusted packages only

## 📊 Security Checklist for Contributors

When contributing code:

- [ ] No hardcoded secrets or API keys
- [ ] Input validation for user data
- [ ] No eval() or similar dangerous functions
- [ ] Dependencies are up to date
- [ ] No new security warnings from npm audit
- [ ] Environment variables properly documented
- [ ] No sensitive data in logs

## 🔄 Security Updates

Security updates will be released as:

- **Critical**: Immediate patch release
- **High**: Within 7 days
- **Medium**: Next minor release
- **Low**: Next major release

## 📞 Contact

For security inquiries:

- **GitHub Security Advisory**: [Preferred method]
- **Email**: [Will be added when repository is public]

## 🙏 Thank You

We appreciate your efforts to responsibly disclose security vulnerabilities and help make AI ScriptWriter safer for everyone!

---

**Last Updated**: 2026-01-18  
**Security Policy Version**: 1.0
