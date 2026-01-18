# 🚀 Deployment Quick Reference Card

**Keep this open while deploying!**

---

## ✅ DEPLOYMENT CHECKLIST

```
[ ] 1. Go to https://vercel.com/new
[ ] 2. Sign in/Sign up
[ ] 3. Import project folder: /Users/daniel/Desktop/git/ai-movie-writer
[ ] 4. Project name: ai-movie-writer
[ ] 5. Add environment variable: CUSTOM_AI_BASE_URL
[ ] 6. Add environment variable: CUSTOM_AI_API_KEY
[ ] 7. Add environment variable: CUSTOM_AI_MODEL
[ ] 8. Add environment variable: ENABLE_STRUCTURED_OUTPUTS
[ ] 9. Click "Deploy"
[ ] 10. Wait 2-5 minutes
[ ] 11. Copy production URL
[ ] 12. Save URL for verification
```

---

## 📋 ENVIRONMENT VARIABLES TO ADD

```
┌─────────────────────────────────────────────────────────────────┐
│ Variable #1:                                                    │
├─────────────────────────────────────────────────────────────────┤
│ Key:   CUSTOM_AI_BASE_URL                                       │
│ Value: https://ark.cn-beijing.volces.com/api/v3                 │
│ Env:   Production ✓                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Variable #2:                                                    │
├─────────────────────────────────────────────────────────────────┤
│ Key:   CUSTOM_AI_API_KEY                                        │
│ Value: [Get from .env.local - keep secret!]                     │
│ Env:   Production ✓                                             │
│                                                                 │
│ To get: grep CUSTOM_AI_API_KEY .env.local                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Variable #3:                                                    │
├─────────────────────────────────────────────────────────────────┤
│ Key:   CUSTOM_AI_MODEL                                          │
│ Value: ep-20251202111822-hw4kl                                   │
│ Env:   Production ✓                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Variable #4:                                                    │
├─────────────────────────────────────────────────────────────────┤
│ Key:   ENABLE_STRUCTURED_OUTPUTS                                │
│ Value: true                                                      │
│ Env:   Production ✓                                             │
│                                                                 │
│ IMPORTANT: Type "true" not "false"                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⏱️ TIMELINE

```
Step 1-3: Navigate & Import    (1 min)
Step 4-8: Configure & Env Vars  (2-3 min)
Step 9:   Click Deploy          (instant)
Step 10:  Build & Deploy        (2-5 min)
Step 11-12: Get URL             (instant)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                          5-10 minutes
```

---

## 🎯 AFTER DEPLOYMENT

Save your URL, then run:

```bash
bash verify_deployment.sh https://your-url.vercel.app
```

Expected: 8/8 tests passed ✅

---

## ⚠️ COMMON MISTAKES TO AVOID

```
❌ DON'T: Forget to add environment variables
   → App will load but won't work

❌ DON'T: Set ENABLE_STRUCTURED_OUTPUTS to "false"
   → Should be "true"

❌ DON'T: Include quotes around values
   → Just paste the raw value

❌ DON'T: Select wrong environment
   → Make sure "Production" is checked

❌ DON'T: Close browser during build
   → Wait for completion
```

---

## ✅ SUCCESS INDICATORS

While deploying, you'll see:
- ✓ "Building..." (2-3 minutes)
- ✓ "Deploying..." (30 seconds)
- ✓ "Ready" status
- ✓ Production URL appears

---

## 🆘 IF SOMETHING GOES WRONG

**Build fails:**
- Check build logs in Vercel dashboard
- Verify all 4 environment variables are set
- Make sure ENABLE_STRUCTURED_OUTPUTS="true"

**Need help:**
- See DEPLOY_NOW.md for detailed guide
- See DEPLOYMENT_GUIDE.md for troubleshooting
- Let me know and I'll help!

---

**Quick Reference - Keep this open!** 📌
