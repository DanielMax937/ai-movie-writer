# 🚀 Vercel Web Deployment Guide

**Your GitHub Repository**: https://github.com/DanielMax937/ai-movie-writer  
**Status**: ✅ Code pushed and ready  
**Time Needed**: 3-5 minutes

---

## 📋 Step-by-Step Deployment Instructions

### STEP 1: Go to Vercel Import Page

**Click this link**: 👉 **https://vercel.com/new**

This will take you to Vercel's import project page.

---

### STEP 2: Import Your GitHub Repository

1. **Sign in to Vercel** (if not already logged in)
   - Use your GitHub account (DanielMax937)
   - Click "Continue with GitHub"

2. **Import Git Repository**
   - You'll see a list of your repositories
   - Find: **`DanielMax937/ai-movie-writer`**
   - Click **"Import"** next to it

3. **If you don't see your repository**:
   - Click "Adjust GitHub App Permissions"
   - Grant Vercel access to your repositories
   - Return and refresh the page

---

### STEP 3: Configure Project Settings

Vercel will auto-detect Next.js. You'll see a configuration screen:

#### Project Settings (Auto-detected ✅)
- **Framework Preset**: Next.js ✅ (auto-detected)
- **Root Directory**: `./` ✅ (auto-detected)
- **Build Command**: `npm run build` ✅ (auto-detected)
- **Output Directory**: `.next` ✅ (auto-detected)

**👉 Don't change these! They're correct.**

---

### STEP 4: Add Environment Variables ⚠️ IMPORTANT

Click **"Environment Variables"** section to expand it.

Add these **4 variables** (click "Add" for each one):

#### Variable 1:
```
Name:  CUSTOM_API_BASE_URL
Value: https://ark.cn-beijing.volces.com/api/v3
```

#### Variable 2:
```
Name:  CUSTOM_API_KEY
Value: c8025a00-c796-436d-8388-c52bf1234439
```

#### Variable 3:
```
Name:  CUSTOM_MODEL_NAME
Value: ep-20251202111822-hw4kl
```

#### Variable 4:
```
Name:  ENABLE_STRUCTURED_OUTPUTS
Value: false
```

**⚠️ Make sure ALL 4 variables are added before clicking Deploy!**

---

### STEP 5: Deploy!

1. Click the big **"Deploy"** button
2. Wait 2-3 minutes while Vercel:
   - ✅ Installs dependencies
   - ✅ Builds your Next.js app
   - ✅ Deploys to global edge network
3. You'll see a success screen with confetti! 🎉

---

## ✅ Verify Deployment

### Your Live URL

After deployment, you'll get a URL like:
- **Production**: `https://ai-movie-writer-xxxx.vercel.app`

Click **"Visit"** to open your live app!

### Quick Test Checklist

1. ✅ App loads (home page appears)
2. ✅ Enter theme: "一个关于人工智能的故事"
3. ✅ Click "开始创作"
4. ✅ Characters appear (wait 5-10 seconds)
5. ✅ Script starts generating
6. ✅ Pause/Resume works
7. ✅ Copy works
8. ✅ Reset works

**All working? 🎉 Deployment Successful!**

---

## 🔗 Important URLs

### After Deployment, Save These:

1. **Live App**: `https://ai-movie-writer-xxxx.vercel.app`
2. **Vercel Dashboard**: https://vercel.com/danielmax937/ai-movie-writer
3. **GitHub Repo**: https://github.com/DanielMax937/ai-movie-writer
4. **Deployment Logs**: Vercel Dashboard → Deployments → Latest

---

## 📊 What Happens Next?

### Automatic CI/CD ✨

From now on, every time you push to GitHub:
- Vercel automatically detects the change
- Builds and deploys the new version
- Takes 2-3 minutes
- Zero manual work required!

### To Update Your App:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin master

# Vercel auto-deploys! ✨
```

---

## 🛠️ Manage Your Deployment

### Vercel Dashboard

Visit: https://vercel.com/dashboard

Here you can:
- View deployment status
- Check logs and errors
- Update environment variables
- Add custom domain
- View analytics
- Rollback to previous versions

---

## 🎯 Optional: Custom Domain

### Add Your Own Domain

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain (e.g., `scriptwriter.yourdomain.com`)
5. Follow DNS instructions
6. Wait 5-60 minutes for DNS propagation
7. Done! ✅

---

## 🔒 Security Notes

✅ **Currently Secure**:
- API keys are in environment variables (not in code)
- HTTPS is automatic
- Code is in private/public repo (your choice)

⚠️ **Consider for Production**:
- Use different API keys for production vs. development
- Set up rate limiting on your AI provider
- Monitor API usage in your provider's dashboard
- Add authentication if making app public

---

## 🆘 Troubleshooting

### Issue: Build Fails

**Check**:
1. Environment variables are all set correctly
2. No typos in variable names
3. Build logs for specific error

**Fix**: 
- Go to Vercel Dashboard → Deployments → Failed Build → View Logs
- Look for the error
- Fix and redeploy

### Issue: App Loads But Characters Don't Generate

**Check**:
1. Environment variables are set
2. API key is valid
3. Function logs for errors

**Fix**:
- Vercel Dashboard → Functions → Logs
- Look for API errors
- Verify your Volcengine Ark endpoint is accessible

### Issue: "Internal Server Error"

**Check Function Logs**:
1. Vercel Dashboard → Functions
2. Click on latest function execution
3. Read error message

**Common Causes**:
- Invalid API key
- API endpoint unreachable
- Rate limit exceeded

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project Docs**: See repository README.md
- **Vercel Community**: https://vercel.com/community

---

## 🎉 Success!

Your AI ScriptWriter is now live on Vercel's global edge network!

**What you've accomplished**:
- ✅ Deployed a production Next.js app
- ✅ Integrated custom AI provider
- ✅ Set up automatic CI/CD
- ✅ Configured environment variables
- ✅ App is globally distributed

**Share your app and start creating amazing movie scripts!** 🎬✨

---

**Need help?** Check the Vercel dashboard logs or refer to the full documentation in your repository.
