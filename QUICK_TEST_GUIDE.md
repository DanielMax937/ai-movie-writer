# 🚀 Quick Testing Reference Card

## Immediate Test Commands

```bash
# Server Status Check
✅ Dev Server: http://localhost:3000 (RUNNING)

# Code Quality Checks
npm run lint          # ✅ 0 errors
npm run build         # ✅ Passing
npm run type-check    # ✅ Passing (if available)
```

---

## ⚡ 5-Minute Smoke Test

### 1. Basic Functionality (2 min)
```
1. Open: http://localhost:3000
2. Enter: "一个赛博侦探追捕失控的仿生人"
3. Click: "开始创作"
4. Observe: Loading → Characters → Script
5. Result: ✅ Script generates successfully
```

### 2. Input Validation (1 min)
```
1. Try: "" (empty) → ❌ Error shown
2. Try: "ab" → ❌ "主题太短"
3. Try: "https://test.com" → ❌ "不能包含网址"
4. Try: Valid theme → ✅ Works
```

### 3. Controls (1 min)
```
1. Click: "暂停" → ✅ Pauses
2. Click: "继续" → ✅ Resumes
3. Click: "复制" → ✅ Copies
4. Click: "导出文本" → ✅ Downloads
```

### 4. Rate Limiting (1 min)
```
1. Click: "开始创作" rapidly 5x
2. Result: ❌ "请求过于频繁"
3. Pass: ✅ Rate limiting works
```

---

## 🔍 Critical Tests (Must Pass)

### Test 1: Rate Limiting ⭐
```bash
ACTION: Rapid click "开始创作" button 5+ times
EXPECT: Error after 5 requests "请求过于频繁，请等待 X 秒"
PASS: [ ]
```

### Test 2: Input Validation ⭐
```bash
ACTION: Try empty, short, URL, XSS inputs
EXPECT: All rejected with helpful errors
PASS: [ ]
```

### Test 3: Loading States ⭐
```bash
ACTION: Start script generation
EXPECT: Spinner + messages update progressively
PASS: [ ]
```

### Test 4: Retry Logic ⭐
```bash
ACTION: DevTools → Network → Offline during generation
EXPECT: Console shows "🔄 AI API retry X/5"
PASS: [ ]
```

### Test 5: Memory Safety ⭐
```bash
ACTION: Refresh page during 3-second character display
EXPECT: No "detached timer" warnings in console
PASS: [ ]
```

### Test 6: Error Boundary ⭐
```bash
ACTION: Set invalid API key, restart, try generation
EXPECT: Error UI displays (not white screen)
PASS: [ ]
```

---

## 🐛 What to Look For

### Console (F12)
```javascript
✅ GOOD:
- "🔄 AI API retry 1/5 in 2s" (retry working)
- "Rate limit check: remaining X/5" (rate limiting)
- "Using fallback method" (graceful degradation)

❌ BAD:
- Any errors in red
- "Cannot read property X of undefined"
- "Maximum call stack size exceeded"
- React key warnings
```

### UI Behavior
```
✅ GOOD:
- Loading spinners appear/disappear smoothly
- Error messages are clear and helpful
- Buttons disable during operations
- Transitions are smooth

❌ BAD:
- White screen crash
- Frozen UI
- No loading feedback
- Unclear error messages
```

### Network Tab
```
✅ GOOD:
- Retry attempts visible
- Reasonable request count
- Clean error handling

❌ BAD:
- Infinite retry loops
- Request spam (100+ requests)
- Unhandled network errors
```

---

## 📊 Quick Results Form

```
Date: ___________
Tester: ___________

Smoke Test (5 min):           [ ] PASS [ ] FAIL
Critical Tests (6 tests):     [ ] PASS [ ] FAIL
Console Clean:                [ ] PASS [ ] FAIL
UI Smooth:                    [ ] PASS [ ] FAIL

Overall:                      [ ] ✅ PASS [ ] ❌ FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🆘 Troubleshooting

### Server Won't Start
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### Environment Errors
```bash
# Check .env.local exists
ls -la .env.local

# Verify required vars
cat .env.local | grep CUSTOM_AI
```

### Build Errors
```bash
# Clean build
rm -rf .next node_modules
npm install
npm run build
```

---

## 📞 Quick Support

### Issue Found?
1. **Console Errors**: Copy error message
2. **Screenshot**: Capture UI
3. **Steps**: Write reproduction steps
4. **Report**: Document in TEST_EXECUTION_PLAN.md

### Everything Passes?
1. ✅ Mark all tests as PASS
2. 🚀 Ready for deployment
3. 📝 Review FINAL_DELIVERABLES.md
4. 🎉 Deploy to production!

---

## 🎯 Success Criteria

```
✅ All 6 critical tests pass
✅ Console has 0 errors
✅ UI is smooth and responsive
✅ Loading states work
✅ Rate limiting active
✅ Input validation working

= READY FOR PRODUCTION 🚀
```

---

**This is your quick reference - keep it handy during testing!**

For detailed instructions, see: **COMPLETE_TESTING_GUIDE.md**
