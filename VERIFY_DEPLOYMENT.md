# 🔍 Post-Deployment Verification Guide

**Status:** Ready to verify deployment  
**Estimated Time:** 5-10 minutes  
**Prerequisites:** Deployment completed, production URL available

---

## 🎯 QUICK VERIFICATION (2 minutes)

### **Step 1: Get Your Deployment URL**

After deploying to Vercel, you should have received a URL like:
```
https://ai-movie-writer-[your-id].vercel.app
```

**Save your URL here for reference:**
```
YOUR_DEPLOYMENT_URL: _________________________________
```

---

### **Step 2: Quick Automated Check**

```bash
# Replace with your actual deployment URL
DEPLOYMENT_URL="https://ai-movie-writer-xxx.vercel.app"

echo "🔍 Running quick verification..."
echo ""

# Check 1: Site is accessible
echo "1️⃣ Checking accessibility..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $DEPLOYMENT_URL)
if [ "$HTTP_CODE" == "200" ]; then
  echo "✅ Site is accessible (HTTP $HTTP_CODE)"
else
  echo "⚠️  Unexpected HTTP code: $HTTP_CODE"
fi

# Check 2: Content loaded
echo ""
echo "2️⃣ Checking page content..."
if curl -s $DEPLOYMENT_URL | grep -q "AI Movie Writer"; then
  echo "✅ Page content loaded correctly"
else
  echo "⚠️  Page content issue detected"
fi

# Check 3: JavaScript loaded
echo ""
echo "3️⃣ Checking JavaScript bundles..."
if curl -s $DEPLOYMENT_URL | grep -q "_next/static"; then
  echo "✅ Next.js bundles loaded"
else
  echo "⚠️  JavaScript loading issue"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Quick check complete!"
echo "Proceed to manual verification below."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**Or run the automated script:**
```bash
bash verify_deployment.sh YOUR_URL_HERE
```

---

## ✅ COMPLETE VERIFICATION CHECKLIST

### **Phase 1: Basic Functionality (5 minutes)**

```
Open your deployment URL in a browser:
https://ai-movie-writer-[your-id].vercel.app

VISUAL CHECKS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Page loads without errors
[ ] No console errors (press F12 to check)
[ ] Logo/title displays correctly
[ ] UI looks correct (colors, fonts, layout)
[ ] No missing images or icons
[ ] Responsive on mobile (test by resizing window)

INTERACTION CHECKS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Can enter text in theme input
[ ] "开始创作" button is clickable
[ ] Input validation works (try empty theme)
[ ] UI is responsive (buttons highlight on hover)
```

---

### **Phase 2: AI Functionality (5 minutes)**

```
GENERATION TEST #1: Simple Theme
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Enter theme: "一个赛博侦探的故事"
2. Click "开始创作"

Expected Results:
[ ] Loading indicator appears
[ ] Phase transitions smoothly
[ ] Characters generate (3-5 characters)
   • Each has name, role, personality
[ ] Script generation begins
   • Lines appear in real-time
   • Character names show correctly
   • Dialogue is coherent
[ ] Can pause generation
[ ] Can resume generation
[ ] Generation completes successfully

GENERATION TEST #2: Different Theme
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Click "重置" (Reset)
2. Enter theme: "太空探险的故事"
3. Click "开始创作"

Expected Results:
[ ] Reset works (clears previous content)
[ ] New characters generate
[ ] Different dialogue from Test #1
[ ] Generation works smoothly

GENERATION TEST #3: Edge Cases
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test with various inputs:
[ ] Short theme: "爱情"
[ ] Long theme: "一个发生在未来世界的科幻故事，包含太空冒险和AI觉醒"
[ ] English theme: "A detective story"
[ ] Mixed: "科幻 Science Fiction"

All should work without errors.
```

---

### **Phase 3: Export Functionality (2 minutes)**

```
EXPORT TESTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
After generating a script:

[ ] "复制脚本" (Copy Script) button works
   • Click button
   • Paste in text editor
   • Verify full script copied

[ ] "导出为文件" (Export as File) button works
   • Click button
   • File downloads (movie-script.txt)
   • Open file
   • Verify content is complete
   • Check formatting is preserved
```

---

### **Phase 4: Error Handling (2 minutes)**

```
ERROR SCENARIO TESTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Empty theme submission
   • Leave input empty
   • Click "开始创作"
   • Should show error or validation message

[ ] Network interruption simulation
   • Start generation
   • Turn off wifi briefly
   • Turn wifi back on
   • Should handle gracefully or show error

[ ] Multiple rapid clicks
   • Click "开始创作" multiple times quickly
   • Should not break or duplicate content

[ ] Page refresh during generation
   • Start generation
   • Refresh page (F5)
   • State should reset cleanly
```

---

## 🔧 TECHNICAL VERIFICATION

### **Browser Console Check**

```
1. Open browser console (F12 or Right-click → Inspect)

2. Go to Console tab

3. Look for errors:

ACCEPTABLE (warnings are OK):
✅ No red error messages
✅ Only yellow warnings (if any)
✅ API calls returning 200 status

NOT ACCEPTABLE (need fixing):
❌ Red error messages
❌ 404 errors (missing files)
❌ 500 errors (server errors)
❌ CORS errors
❌ "Failed to fetch" errors
```

---

### **Network Tab Verification**

```
1. In browser console, go to Network tab

2. Refresh page (F5)

3. Check requests:

EXPECTED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] HTML document (200)
[ ] _next/static/... (200) - JavaScript bundles
[ ] _next/static/... (200) - CSS files
[ ] No 404 errors
[ ] No 500 errors

4. Start script generation

5. Check API calls:

EXPECTED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] POST to /api/... (200 or streaming)
[ ] Response contains JSON data
[ ] No timeout errors
[ ] Reasonable response times (<5s)
```

---

## 📊 PERFORMANCE VERIFICATION

### **Page Load Speed**

```
1. Open browser console → Network tab

2. Refresh page (Ctrl/Cmd + Shift + R for hard refresh)

3. Look at bottom of Network tab:

ACCEPTABLE METRICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Total load time: <3 seconds
✅ DOMContentLoaded: <1 second
✅ Total requests: <50
✅ Total transferred: <5 MB

GOOD METRICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Total load time: <2 seconds
✅ DOMContentLoaded: <500ms
✅ Total requests: <30
✅ Total transferred: <3 MB
```

---

### **Lighthouse Audit (Optional but Recommended)**

```
1. In Chrome, press F12 → Lighthouse tab

2. Click "Generate report"

3. Review scores:

TARGET SCORES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Performance:     >70  (Acceptable) | >90 (Good)
Accessibility:   >90  (Acceptable) | >95 (Good)
Best Practices:  >90  (Acceptable) | >95 (Good)
SEO:             >80  (Acceptable) | >90 (Good)

4. Review recommendations

5. Note any critical issues
```

---

## 🌐 CROSS-BROWSER VERIFICATION

### **Test on Multiple Browsers**

```
Minimum testing:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Chrome/Edge (Chromium)
[ ] Safari (if on macOS)
[ ] Firefox

For each browser:
[ ] Page loads correctly
[ ] Can generate script
[ ] No console errors
[ ] Export works

MOBILE TESTING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Open on mobile device or use browser DevTools
[ ] Toggle device toolbar (Ctrl/Cmd + Shift + M)
[ ] Test on:
   • iPhone (Safari, Chrome)
   • Android (Chrome)
[ ] Verify:
   • Layout is responsive
   • Text is readable
   • Buttons are tappable
   • Generation works
```

---

## 🔐 SECURITY VERIFICATION

### **Environment Variables Check**

```
CRITICAL SECURITY CHECK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Open page source (Ctrl/Cmd + U)
[ ] Search for "API_KEY" - Should NOT be found
[ ] Search for "ark.cn-beijing" - Should NOT be visible
[ ] Check Network tab API calls
   • API calls should be server-side
   • No API keys in request headers visible in browser

If you see API keys in page source:
❌ CRITICAL ISSUE - Environment variables not configured correctly
→ Go to Vercel Dashboard → Settings → Environment Variables
→ Ensure all 4 variables are set for Production
→ Redeploy

[ ] Verify HTTPS
   • URL should start with https://
   • Lock icon in address bar
   • No security warnings
```

---

## 📈 VERCEL DASHBOARD VERIFICATION

### **Check Deployment Status**

```
1. Go to: https://vercel.com/dashboard

2. Find your project: ai-movie-writer

3. Verify:

DEPLOYMENT TAB:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Status: Ready ✓
[ ] Domain: https://ai-movie-writer-xxx.vercel.app
[ ] Commit: Latest commit shown
[ ] Build time: 2-5 minutes (reasonable)

FUNCTIONS TAB:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] No errors shown
[ ] Execution times reasonable (<10s)
[ ] Invocations happening (after testing)

SETTINGS → ENVIRONMENT VARIABLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] CUSTOM_AI_BASE_URL: Set (Production ✓)
[ ] CUSTOM_AI_API_KEY: Set (Production ✓)
[ ] CUSTOM_AI_MODEL: Set (Production ✓)
[ ] ENABLE_STRUCTURED_OUTPUTS: Set (Production ✓)
```

---

## 🐛 COMMON ISSUES & FIXES

### **Issue #1: Page Loads But Nothing Happens**

```
SYMPTOMS:
• UI appears but "开始创作" button doesn't work
• No characters or script generate
• Console shows errors

DIAGNOSIS:
1. Check browser console (F12)
2. Look for API errors

FIXES:
A) Environment variables not set:
   → Go to Vercel Dashboard
   → Settings → Environment Variables
   → Add all 4 required variables
   → Redeploy

B) API endpoint incorrect:
   → Check CUSTOM_AI_BASE_URL is correct
   → Verify it ends with /api/v3
   → Redeploy

C) API key invalid:
   → Check CUSTOM_AI_API_KEY is correct
   → Try manually with curl:
     curl -X POST $CUSTOM_AI_BASE_URL \
       -H "Authorization: Bearer $CUSTOM_AI_API_KEY"
   → If fails, get new key
```

---

### **Issue #2: Slow Generation or Timeouts**

```
SYMPTOMS:
• Generation takes very long
• Requests timeout
• Partial script generated

DIAGNOSIS:
1. Check Network tab for request times
2. Look for timeout errors

FIXES:
A) Vercel Function timeout (default 10s):
   → Upgrade to Pro plan for 60s timeout
   → Or optimize API calls

B) API endpoint slow:
   → Check API provider status
   → Try different time of day
   → Contact API provider

C) Network issues:
   → Try different network
   → Check Vercel status
```

---

### **Issue #3: Build Errors on Vercel**

```
SYMPTOMS:
• Deployment fails
• Build logs show errors
• Status: Error

DIAGNOSIS:
1. Go to Deployments → Click failed deployment
2. Review build logs

FIXES:
A) TypeScript errors:
   → Run locally: npm run build
   → Fix errors shown
   → Commit and push
   → Redeploy

B) Missing dependencies:
   → Check package.json
   → Run: npm install
   → Commit package-lock.json
   → Redeploy

C) Environment variable errors:
   → Check all 4 variables are set
   → Verify no typos
   → Redeploy
```

---

### **Issue #4: 404 Not Found**

```
SYMPTOMS:
• Deployment URL returns 404
• Or specific routes return 404

DIAGNOSIS:
1. Check URL is correct
2. Wait 2-3 minutes (DNS propagation)

FIXES:
A) Wrong URL:
   → Check Vercel Dashboard for correct URL
   → Use provided URL exactly

B) Deployment not complete:
   → Wait for build to finish
   → Check Deployments tab

C) Route issue:
   → Ensure visiting root: /
   → Not a subpath
```

---

## 📋 VERIFICATION REPORT TEMPLATE

```
DEPLOYMENT VERIFICATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: _______________
Deployment URL: _____________________
Vercel Project: ai-movie-writer
Verified By: _____________________

BASIC FUNCTIONALITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Page loads successfully
[ ] No console errors
[ ] UI displays correctly
[ ] Theme input works
[ ] Start button functional

AI GENERATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Characters generate (test theme: "一个赛博侦探的故事")
[ ] Script generates
[ ] Real-time updates work
[ ] Pause/resume functional
[ ] Generation completes

EXPORT FUNCTIONALITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Copy script works
[ ] Export to file works
[ ] File downloads correctly
[ ] Content is complete

PERFORMANCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Page Load Time: ______ seconds
Generation Time: ______ seconds
Lighthouse Score: Performance ____ / Accessibility ____

CROSS-BROWSER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Chrome: Working
[ ] Safari: Working
[ ] Firefox: Working
[ ] Mobile: Working

SECURITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] HTTPS enabled
[ ] No API keys in source
[ ] Environment variables configured
[ ] No security warnings

ISSUES FOUND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

OVERALL STATUS:
[ ] ✅ PASSED - Ready for production
[ ] ⚠️  PASSED WITH WARNINGS - Minor issues
[ ] ❌ FAILED - Critical issues need fixing

NOTES:
_____________________________________________________
_____________________________________________________
_____________________________________________________

VERIFIED BY: ___________________  DATE: _____________
```

---

## 🎉 SUCCESS CRITERIA

### **Your deployment is successful if:**

```
✅ ALL CRITICAL CHECKS PASS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Page loads without errors
✓ Can enter theme and start generation
✓ Characters generate successfully
✓ Script generates with coherent dialogue
✓ Can pause/resume/reset
✓ Can copy and export script
✓ No console errors during normal use
✓ Works on Chrome (minimum)
✓ HTTPS enabled
✓ No API keys visible in source

✅ GOOD TO HAVE (but not critical):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Page loads in <3 seconds
✓ Works on multiple browsers
✓ Responsive on mobile
✓ Lighthouse score >70
✓ No warnings in console
```

---

## 🚀 NEXT STEPS AFTER VERIFICATION

### **If All Checks Pass:**

```
IMMEDIATE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Share URL with stakeholders
2. Document production URL
3. Set up monitoring (Vercel Analytics)
4. Create demo video
5. Test with real users

THIS WEEK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Add custom domain (optional)
2. Set up error tracking (Sentry, optional)
3. Implement analytics (Google, Plausible)
4. Write launch blog post
5. Share on social media

THIS MONTH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Gather user feedback
2. Implement improvements
3. Monitor usage metrics
4. Plan next features
5. Submit to Product Hunt (optional)
```

---

### **If Issues Found:**

```
PRIORITY 1 (Critical - Fix Immediately):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Page not loading (404/500 errors)
• API keys visible in source
• Generation completely broken
• Console full of errors
• Can't complete basic flow

→ See "Common Issues & Fixes" above
→ Or contact me for help

PRIORITY 2 (High - Fix This Week):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Slow performance (>5s load time)
• Broken on specific browser
• Mobile layout issues
• Intermittent errors
• Export not working

PRIORITY 3 (Medium - Fix When Possible):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Console warnings
• Minor UI glitches
• Lighthouse score <70
• Edge case errors
```

---

## 📞 SUPPORT & RESOURCES

### **If You Need Help:**

```
DOCUMENTATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• This guide: VERIFY_DEPLOYMENT.md
• Deployment: DEPLOYMENT_GUIDE.md, DEPLOY_NOW.md
• Testing: COMPLETE_TESTING_GUIDE.md
• Environment: ENV_SETUP.md
• Troubleshooting: DEPLOYMENT_GUIDE.md (section 7)

EXTERNAL RESOURCES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Vercel Docs: https://vercel.com/docs
• Vercel Status: https://vercel-status.com
• Next.js Docs: https://nextjs.org/docs
• Vercel Support: https://vercel.com/support

DEBUGGING TOOLS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Browser Console: F12
• Vercel Logs: Dashboard → Functions → View Logs
• Network Tab: F12 → Network
• Lighthouse: F12 → Lighthouse → Generate Report
```

---

## ✅ VERIFICATION COMPLETE CHECKLIST

```
BEFORE DECLARING SUCCESS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Ran automated quick check
[ ] Completed all Phase 1 checks (Basic Functionality)
[ ] Completed all Phase 2 checks (AI Functionality)
[ ] Completed all Phase 3 checks (Export)
[ ] Tested error scenarios (Phase 4)
[ ] Checked browser console (no errors)
[ ] Verified network requests (200 status)
[ ] Tested on at least 2 browsers
[ ] Verified security (no exposed keys)
[ ] Checked Vercel dashboard (all green)
[ ] Filled out verification report
[ ] Documented any issues found
[ ] Fixed critical issues (if any)

If ALL checked: 🎉 DEPLOYMENT VERIFIED! 🎉
```

---

**Created:** January 18, 2026  
**Status:** Ready to use  
**Prerequisites:** Deployment completed  
**Estimated time:** 10-15 minutes for complete verification  
**Next:** Share with users or implement monitoring
