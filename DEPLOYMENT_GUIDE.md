# 🚀 AI Movie Writer - Complete Deployment Guide

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║               🎬 AI MOVIE WRITER DEPLOYMENT GUIDE 🎬             ║
║                                                                  ║
║                    Production Deployment Manual                  ║
║                       Version 1.0 - 2026                         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Build & Test Locally](#build--test-locally)
4. [Deployment Options](#deployment-options)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)
8. [Rollback Procedures](#rollback-procedures)

---

## 🎯 Pre-Deployment Checklist

### Essential Checks ✅

```
┌────────────────────────────────────────────────────────────┐
│  PRE-DEPLOYMENT VERIFICATION                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [ ] Environment variables configured                      │
│  [ ] No linter errors (npm run lint)                       │
│  [ ] No TypeScript errors                                  │
│  [ ] Production build successful                           │
│  [ ] All tests passing                                     │
│  [ ] API endpoint verified                                 │
│  [ ] Dependencies up to date                               │
│  [ ] .gitignore configured                                 │
│  [ ] README.md updated                                     │
│  [ ] Documentation complete                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Quick Verification Commands

```bash
# 1. Check for errors
npm run lint          # Should show 0 errors
npm run build        # Should complete successfully

# 2. Run local production build
npm start            # Test on http://localhost:3000

# 3. Verify environment
cat .env.local       # Check all variables are set
```

---

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env.local` file (for development) or configure environment variables in your hosting platform:

```bash
# AI API Configuration (REQUIRED)
CUSTOM_AI_BASE_URL=https://your-api-endpoint.com/api/v3
CUSTOM_AI_API_KEY=your-api-key-here
CUSTOM_AI_MODEL=your-model-id

# Structured Output Support (REQUIRED)
ENABLE_STRUCTURED_OUTPUTS=true

# Optional: Additional Configuration
# NODE_ENV=production
# NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Environment Variable Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `CUSTOM_AI_BASE_URL` | ✅ Yes | AI API base URL | `https://ark.cn-beijing.volces.com/api/v3` |
| `CUSTOM_AI_API_KEY` | ✅ Yes | API authentication key | `your-secret-key` |
| `CUSTOM_AI_MODEL` | ✅ Yes | Model identifier | `ep-20251202111822-hw4kl` |
| `ENABLE_STRUCTURED_OUTPUTS` | ✅ Yes | Enable structured outputs | `true` |
| `NODE_ENV` | ⚪ Auto | Environment mode | `production` |

### Security Notes ⚠️

```
⚠️  IMPORTANT SECURITY GUIDELINES:

1. NEVER commit .env.local to git
2. NEVER expose API keys in client-side code
3. ALWAYS use server-side environment variables
4. ROTATE API keys regularly
5. Use different keys for staging/production
```

---

## 🏗️ Build & Test Locally

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd /Users/daniel/Desktop/git/ai-movie-writer

# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local  # If you have a template

# Edit environment variables
nano .env.local  # or use your preferred editor

# Required variables:
CUSTOM_AI_BASE_URL=your-api-url
CUSTOM_AI_API_KEY=your-api-key
CUSTOM_AI_MODEL=your-model
ENABLE_STRUCTURED_OUTPUTS=true
```

### Step 3: Run Quality Checks

```bash
# Run linter
npm run lint
# Expected: ✓ No ESLint warnings or errors

# Check TypeScript
npx tsc --noEmit
# Expected: No errors

# Run tests (if you have test script)
npm test
# Expected: All tests passing
```

### Step 4: Build for Production

```bash
# Create production build
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization
```

### Step 5: Test Production Build Locally

```bash
# Start production server
npm start

# Server should start on http://localhost:3000
```

### Step 6: Manual Testing

```
Open browser: http://localhost:3000

Test Checklist:
✓ Page loads without errors
✓ Enter theme: "一个赛博侦探的故事"
✓ Click "开始创作"
✓ Characters generate successfully
✓ Script begins generating
✓ Can pause/resume
✓ Can reset
✓ Can copy script
✓ Can export to file
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- ✅ Built for Next.js
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy environment variables
- ✅ Free tier available

#### Deploy with Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to staging (preview)
vercel

# Follow prompts:
# ? Set up and deploy "~/Desktop/git/ai-movie-writer"? [Y/n] y
# ? Which scope do you want to deploy to? Your Name
# ? Link to existing project? [y/N] n
# ? What's your project's name? ai-movie-writer
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] n

# 4. Configure environment variables
vercel env add CUSTOM_AI_BASE_URL production
# Enter your API URL when prompted

vercel env add CUSTOM_AI_API_KEY production
# Enter your API key when prompted

vercel env add CUSTOM_AI_MODEL production
# Enter your model ID when prompted

vercel env add ENABLE_STRUCTURED_OUTPUTS production
# Enter: true

# 5. Deploy to production
vercel --prod

# Expected output:
# ✓ Production: https://ai-movie-writer.vercel.app [copied]
```

#### Deploy with Vercel Dashboard

```
1. Visit: https://vercel.com/new
2. Import Git Repository:
   - Connect GitHub/GitLab/Bitbucket
   - Select your repository
3. Configure Project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: npm run build (default)
   - Output Directory: .next (default)
4. Add Environment Variables:
   CUSTOM_AI_BASE_URL
   CUSTOM_AI_API_KEY
   CUSTOM_AI_MODEL
   ENABLE_STRUCTURED_OUTPUTS
5. Click "Deploy"
6. Wait 2-3 minutes
7. Done! 🎉
```

---

### Option 2: Netlify

#### Deploy with Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Initialize
netlify init

# Follow prompts:
# ? What would you like to do? Create & configure a new site
# ? Team: Your team
# ? Site name: ai-movie-writer
# ? Build command: npm run build
# ? Directory to deploy: .next
# ? Netlify functions folder: netlify/functions

# 4. Add environment variables
netlify env:set CUSTOM_AI_BASE_URL "your-api-url"
netlify env:set CUSTOM_AI_API_KEY "your-api-key"
netlify env:set CUSTOM_AI_MODEL "your-model"
netlify env:set ENABLE_STRUCTURED_OUTPUTS "true"

# 5. Deploy
netlify deploy --prod
```

#### Deploy with Netlify Dashboard

```
1. Visit: https://app.netlify.com/start
2. Connect Git provider
3. Select repository
4. Configure build:
   - Build command: npm run build
   - Publish directory: .next
5. Add environment variables in Site settings
6. Click "Deploy site"
```

---

### Option 3: Railway

#### Deploy with Railway CLI

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add environment variables
railway variables set CUSTOM_AI_BASE_URL="your-api-url"
railway variables set CUSTOM_AI_API_KEY="your-api-key"
railway variables set CUSTOM_AI_MODEL="your-model"
railway variables set ENABLE_STRUCTURED_OUTPUTS="true"

# 5. Deploy
railway up

# 6. Get deployment URL
railway domain
```

---

### Option 4: Docker (Self-Hosted)

#### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Deploy with Docker

```bash
# 1. Build image
docker build -t ai-movie-writer .

# 2. Run container
docker run -p 3000:3000 \
  -e CUSTOM_AI_BASE_URL="your-api-url" \
  -e CUSTOM_AI_API_KEY="your-api-key" \
  -e CUSTOM_AI_MODEL="your-model" \
  -e ENABLE_STRUCTURED_OUTPUTS="true" \
  ai-movie-writer

# 3. Access at http://localhost:3000
```

#### Deploy with Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  ai-movie-writer:
    build: .
    ports:
      - "3000:3000"
    environment:
      - CUSTOM_AI_BASE_URL=${CUSTOM_AI_BASE_URL}
      - CUSTOM_AI_API_KEY=${CUSTOM_AI_API_KEY}
      - CUSTOM_AI_MODEL=${CUSTOM_AI_MODEL}
      - ENABLE_STRUCTURED_OUTPUTS=true
      - NODE_ENV=production
    restart: unless-stopped
```

Deploy:

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Option 5: Traditional VPS (Ubuntu/Debian)

#### Server Setup

```bash
# 1. Connect to server
ssh user@your-server.com

# 2. Update system
sudo apt update && sudo apt upgrade -y

# 3. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Install PM2 (Process Manager)
sudo npm install -g pm2

# 5. Clone repository
git clone https://github.com/yourusername/ai-movie-writer.git
cd ai-movie-writer

# 6. Install dependencies
npm install

# 7. Create .env.local
nano .env.local
# Add your environment variables

# 8. Build application
npm run build

# 9. Start with PM2
pm2 start npm --name "ai-movie-writer" -- start

# 10. Save PM2 configuration
pm2 save
pm2 startup

# 11. Configure Nginx (optional)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/ai-movie-writer

# Nginx config:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/ai-movie-writer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 12. Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## ✅ Post-Deployment Verification

### Automated Verification Script

```bash
# Create verify-deployment.sh
cat > verify-deployment.sh << 'EOF'
#!/bin/bash

DEPLOYMENT_URL="$1"

echo "🔍 Verifying deployment at: $DEPLOYMENT_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Homepage loads
echo "📄 Test 1: Homepage loads..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL")
if [ "$STATUS" = "200" ]; then
    echo "✅ PASS: Homepage returns 200"
else
    echo "❌ FAIL: Homepage returns $STATUS"
    exit 1
fi

# Test 2: Check page content
echo "📝 Test 2: Page content..."
CONTENT=$(curl -s "$DEPLOYMENT_URL")
if echo "$CONTENT" | grep -q "AI 编剧室"; then
    echo "✅ PASS: Page contains expected content"
else
    echo "❌ FAIL: Page missing expected content"
    exit 1
fi

# Test 3: Check static assets
echo "🎨 Test 3: Static assets..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/_next/static/css")
if [ "$STATUS" != "404" ]; then
    echo "✅ PASS: Static assets accessible"
else
    echo "❌ FAIL: Static assets not accessible"
fi

# Test 4: Response time
echo "⏱️  Test 4: Response time..."
TIME=$(curl -s -o /dev/null -w "%{time_total}" "$DEPLOYMENT_URL")
echo "⏰ Response time: ${TIME}s"
if (( $(echo "$TIME < 3" | bc -l) )); then
    echo "✅ PASS: Response time acceptable"
else
    echo "⚠️  WARNING: Response time > 3s"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Deployment verification complete!"
EOF

chmod +x verify-deployment.sh

# Run verification
./verify-deployment.sh https://your-deployment-url.com
```

### Manual Verification Checklist

```
┌────────────────────────────────────────────────────────────┐
│  POST-DEPLOYMENT VERIFICATION                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [ ] Homepage loads successfully                           │
│  [ ] Page title displays correctly                         │
│  [ ] UI elements render properly                           │
│  [ ] Theme input works                                     │
│  [ ] "开始创作" button clickable                           │
│  [ ] Character generation works                            │
│  [ ] Script generation works                               │
│  [ ] Pause/Resume functions                                │
│  [ ] Reset works                                           │
│  [ ] Copy script works                                     │
│  [ ] Export to file works                                  │
│  [ ] No console errors                                     │
│  [ ] Mobile responsive                                     │
│  [ ] HTTPS working (if configured)                         │
│  [ ] Custom domain working (if configured)                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Comprehensive Test Flow

```bash
# 1. Open deployment URL in browser
https://your-app.vercel.app

# 2. Test complete flow
1. Enter theme: "一个关于时间旅行者的故事"
2. Click "开始创作"
3. Wait for character generation (10-15s)
4. Verify 4 characters appear
5. Wait for first scene (20-30s)
6. Verify dialogue generates
7. Test pause button
8. Test resume button
9. Wait for scene completion
10. Test reset button
11. Generate new script
12. Test copy functionality
13. Test export functionality

# 3. Check browser console
# Should have no red errors
# Yellow warnings are acceptable

# 4. Test on different devices
# Desktop browser
# Mobile browser (Chrome, Safari)
# Tablet
```

---

## 📊 Monitoring & Maintenance

### Health Check Endpoint

Add health check to your app (create `app/api/health/route.ts`):

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}
```

### Monitoring Checklist

```
┌────────────────────────────────────────────────────────────┐
│  MONITORING SETUP                                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [ ] Error tracking (Sentry, Bugsnag)                      │
│  [ ] Analytics (Google Analytics, Plausible)               │
│  [ ] Uptime monitoring (UptimeRobot, Pingdom)              │
│  [ ] Performance monitoring (Web Vitals)                   │
│  [ ] Log aggregation (if self-hosted)                      │
│  [ ] Backup strategy                                       │
│  [ ] Alerting configured                                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Recommended Monitoring Tools

1. **Vercel Analytics** (if using Vercel)
   - Built-in performance metrics
   - Real user monitoring
   - Web Vitals tracking

2. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

3. **UptimeRobot** (Uptime Monitoring)
   - Free tier: 50 monitors
   - 5-minute intervals
   - Alert via email/SMS/Slack

4. **Google Analytics** (User Analytics)
   ```bash
   npm install @next/third-parties
   ```

### Maintenance Schedule

```
Daily:
  [ ] Check error logs
  [ ] Monitor uptime status
  [ ] Review API usage

Weekly:
  [ ] Review performance metrics
  [ ] Check for dependency updates
  [ ] Review user feedback

Monthly:
  [ ] Update dependencies
  [ ] Security audit
  [ ] Backup verification
  [ ] Performance optimization review

Quarterly:
  [ ] Major dependency updates
  [ ] Feature planning
  [ ] Architecture review
  [ ] Cost optimization
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Issue 1: Build Fails

```
Error: Build failed

Solution:
1. Check linter errors: npm run lint
2. Check TypeScript: npx tsc --noEmit
3. Clear cache: rm -rf .next node_modules package-lock.json
4. Reinstall: npm install
5. Rebuild: npm run build
```

#### Issue 2: Environment Variables Not Working

```
Error: Environment variables undefined

Solution:
1. Verify .env.local exists (local)
2. Check variable names (no typos)
3. Restart dev server: npm run dev
4. For production:
   - Vercel: Check dashboard > Settings > Environment Variables
   - Netlify: Check Site settings > Environment variables
   - Railway: railway variables list
5. Ensure server-side variables don't have NEXT_PUBLIC_ prefix
```

#### Issue 3: API Connection Failed

```
Error: Cannot connect to API

Solution:
1. Verify API endpoint URL
2. Test API directly: curl -X POST <API_URL>
3. Check API key validity
4. Verify CORS settings (if applicable)
5. Check firewall/network restrictions
6. Verify model ID is correct
```

#### Issue 4: Slow Performance

```
Issue: Application is slow

Solution:
1. Check bundle size: npm run build
2. Optimize images (use Next.js Image)
3. Enable caching headers
4. Use CDN for static assets
5. Implement code splitting
6. Monitor API response times
7. Check database queries (if using DB)
```

#### Issue 5: White Screen / App Won't Load

```
Error: White screen in production

Solution:
1. Check browser console for errors
2. Verify all environment variables set
3. Check build logs for errors
4. Test production build locally: npm run build && npm start
5. Clear browser cache
6. Check CSP headers (if configured)
```

### Debug Mode

Enable detailed logging:

```typescript
// Add to app/layout.tsx temporarily
if (process.env.NODE_ENV === 'production') {
  console.log('Environment check:', {
    hasBaseUrl: !!process.env.CUSTOM_AI_BASE_URL,
    hasApiKey: !!process.env.CUSTOM_AI_API_KEY,
    hasModel: !!process.env.CUSTOM_AI_MODEL,
  });
}
```

---

## ⏮️ Rollback Procedures

### Vercel Rollback

```bash
# Method 1: Dashboard
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Find previous working deployment
5. Click "..." menu
6. Click "Promote to Production"

# Method 2: CLI
vercel rollback
# Follow prompts to select deployment
```

### Git-Based Rollback

```bash
# 1. Identify last working commit
git log --oneline

# 2. Revert to previous version
git revert <commit-hash>

# 3. Push changes
git push origin main

# 4. Automatic deployment will trigger
# (if using Vercel/Netlify/Railway with auto-deploy)
```

### Manual Rollback (Self-Hosted)

```bash
# 1. Stop current application
pm2 stop ai-movie-writer

# 2. Checkout previous version
git checkout <previous-tag-or-commit>

# 3. Rebuild
npm install
npm run build

# 4. Restart
pm2 restart ai-movie-writer
```

---

## 📝 Deployment Checklist (Final)

```
╔════════════════════════════════════════════════════════════╗
║              FINAL DEPLOYMENT CHECKLIST                    ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  PRE-DEPLOYMENT                                            ║
║  [ ] All code committed to git                             ║
║  [ ] Environment variables documented                      ║
║  [ ] Production build tested locally                       ║
║  [ ] All tests passing                                     ║
║  [ ] No linter errors                                      ║
║  [ ] Dependencies audited: npm audit                       ║
║                                                            ║
║  DEPLOYMENT                                                ║
║  [ ] Environment variables configured                      ║
║  [ ] Deployment platform selected                          ║
║  [ ] Custom domain configured (if needed)                  ║
║  [ ] HTTPS/SSL enabled                                     ║
║  [ ] Deployment successful                                 ║
║                                                            ║
║  POST-DEPLOYMENT                                           ║
║  [ ] Homepage loads                                        ║
║  [ ] All features work                                     ║
║  [ ] No console errors                                     ║
║  [ ] Mobile responsive                                     ║
║  [ ] Performance acceptable                                ║
║  [ ] Monitoring configured                                 ║
║  [ ] Backup strategy in place                              ║
║  [ ] Team notified                                         ║
║  [ ] Documentation updated                                 ║
║                                                            ║
║  Status: READY TO GO LIVE! 🚀                              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🎯 Quick Start Commands

### Vercel (Fastest)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Railway

```bash
npm install -g @railway/cli
railway login
railway up
```

### Docker

```bash
docker build -t ai-movie-writer .
docker run -p 3000:3000 ai-movie-writer
```

---

## 📞 Support & Resources

### Documentation Links

- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Railway Docs: https://docs.railway.app

### Project Documentation

- **FINAL_VISUAL_SUMMARY.md** - Complete project overview
- **ENV_SETUP.md** - Environment configuration guide
- **QUICK_REFERENCE.md** - Quick deployment reference
- **MASTER_INDEX.md** - All documentation index

---

## 🎉 Success!

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🎊 DEPLOYMENT COMPLETE! 🎊                      ║
║                                                              ║
║  Your AI Movie Writer is now live and ready to create        ║
║  amazing scripts!                                            ║
║                                                              ║
║  Next Steps:                                                 ║
║  1. Share your URL with users                                ║
║  2. Monitor application health                               ║
║  3. Gather feedback                                          ║
║  4. Plan future enhancements                                 ║
║                                                              ║
║           Congratulations on your launch! 🚀                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

**Document**: DEPLOYMENT_GUIDE.md  
**Version**: 1.0  
**Last Updated**: January 18, 2026  
**Status**: ✅ Production Ready  

🚀 **Happy Deploying!** 🚀
