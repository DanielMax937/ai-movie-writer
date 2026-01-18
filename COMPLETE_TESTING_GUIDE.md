# Complete Testing Guide - AI Movie Writer

## Testing Environment Setup

### Prerequisites
- ✅ Development server running at http://localhost:3000
- ✅ Browser with DevTools (Chrome/Edge recommended)
- ✅ .env.local file with valid API credentials

---

## Detailed Test Procedures

### **Test 1: Rate Limiting Protection** ⭐ PRIORITY

#### Test 1A: Script Initialization Rate Limiting
**Objective**: Verify rate limiting prevents spam script creation

**Steps**:
1. Open http://localhost:3000 in browser
2. Open DevTools (F12) → Console tab
3. Enter valid theme: "一个侦探追捕罪犯的故事"
4. Click "开始创作" button
5. **Immediately** click "开始创作" again (multiple times rapidly)
6. Observe the error message below the input field

**Expected Results**:
```
✅ First click: Script generation starts
✅ Second click: Error appears - "请求过于频繁，请等待 X 秒后重试"
✅ Rate limit: 5 requests per 10 minutes
✅ Button becomes disabled during loading
✅ No duplicate script generations
```

**Console Output Should Show**:
```
Rate limit check: remaining 4/5
Rate limit check: remaining 3/5
Rate limit exceeded
```

**Pass Criteria**:
- [ ] Error message displays clearly
- [ ] Cannot create multiple scripts rapidly
- [ ] Counter resets after waiting period
- [ ] No console errors

---

#### Test 1B: Export/Copy Rate Limiting
**Objective**: Verify export and copy operations are rate limited

**Steps**:
1. Complete a script generation (or have existing script)
2. Rapidly click "复制" button 10+ times in quick succession
3. Observe behavior
4. Wait 2 seconds
5. Rapidly click "导出文本" button 10+ times
6. Observe behavior

**Expected Results**:
```
✅ First 20 operations: Succeed normally
✅ After 20 operations: Error "操作过于频繁，请稍后再试"
✅ Rate limit: 20 requests per minute
✅ Operations queue properly
```

**Pass Criteria**:
- [ ] Rate limiting kicks in after 20 operations
- [ ] Clear error feedback
- [ ] Operations resume after cooldown
- [ ] No system overload

---

### **Test 2: Input Validation** ⭐ PRIORITY

#### Test 2A: Empty Input Validation
**Steps**:
1. Leave theme input empty
2. Click "开始创作"

**Expected Result**:
```
✅ Error: "请输入电影主题"
✅ Red error message with alert icon
✅ Button does nothing
```

**Pass Criteria**: [ ] Error displays, no submission

---

#### Test 2B: Too Short Input
**Steps**:
1. Enter: "ab"
2. Click "开始创作"

**Expected Result**:
```
✅ Error: "主题太短，至少需要 5 个字符"
✅ Input remains, not cleared
```

**Pass Criteria**: [ ] Proper error message

---

#### Test 2C: Too Long Input
**Steps**:
1. Enter 201+ characters (copy-paste a long paragraph)
2. Click "开始创作"

**Expected Result**:
```
✅ Error: "主题太长，最多 200 个字符"
✅ Helpful character count hint shown
```

**Pass Criteria**: [ ] Length validation works

---

#### Test 2D: URL Injection Prevention
**Steps**:
1. Enter: "https://evil.com/malware"
2. Click "开始创作"

**Expected Result**:
```
✅ Error: "主题不能包含网址"
✅ Input sanitized
```

**Pass Criteria**: [ ] URL blocked

---

#### Test 2E: Email Injection Prevention
**Steps**:
1. Enter: "contact me at evil@spam.com"
2. Click "开始创作"

**Expected Result**:
```
✅ Error: "主题不能包含邮箱地址"
```

**Pass Criteria**: [ ] Email blocked

---

#### Test 2F: XSS Prevention
**Steps**:
1. Enter: `<script>alert('XSS')</script>一个故事`
2. Click "开始创作"

**Expected Result**:
```
✅ Script tags removed/escaped
✅ Theme sanitized to: "一个故事"
✅ No alert popup
✅ No console errors
```

**Pass Criteria**: [ ] XSS prevented

---

#### Test 2G: Special Characters Handling
**Steps**:
1. Enter: "一个   故事   with    extra    spaces"
2. Click "开始创作"

**Expected Result**:
```
✅ Whitespace normalized to single spaces
✅ Theme becomes: "一个 故事 with extra spaces"
```

**Pass Criteria**: [ ] Sanitization works

---

#### Test 2H: Minimum Word Count
**Steps**:
1. Enter: "故事" (single word)
2. Click "开始创作"

**Expected Result**:
```
✅ Error: "主题太简单，至少需要 2 个词"
```

**Pass Criteria**: [ ] Word count validation works

---

#### Test 2I: Valid Input
**Steps**:
1. Enter: "一个赛博侦探追捕失控的仿生人"
2. Click "开始创作"

**Expected Result**:
```
✅ Validation passes
✅ Script generation starts
✅ No errors
```

**Pass Criteria**: [ ] Valid input accepted

---

### **Test 3: Loading States** ⭐ PRIORITY

#### Test 3A: Initialization Loading
**Steps**:
1. Enter valid theme
2. Click "开始创作"
3. Observe loading indicators

**Expected Results**:
```
✅ Button changes to: "⟳ 正在初始化..."
✅ Button becomes disabled
✅ Loading spinner appears
✅ Message updates: "正在生成角色..."
✅ Progress feedback visible
```

**Timeline**:
```
0s:    Click button
0.1s:  Loading state starts
0.5s:  Message: "正在生成角色..."
2-5s:  Characters generated
5s:    Message: "准备开始创作..."
8s:    Script generation begins
```

**Pass Criteria**:
- [ ] Loading spinner visible
- [ ] Messages update correctly
- [ ] Button disabled during loading
- [ ] No UI jank or flicker

---

#### Test 3B: Character Display Phase
**Steps**:
1. Continue from Test 3A
2. Observe character display phase

**Expected Results**:
```
✅ 4 character cards appear
✅ Animated entrance
✅ Large loading spinner below
✅ Message: "准备开始创作..."
✅ Details: "正在初始化编剧团队..."
✅ Displays for exactly 3 seconds
```

**Pass Criteria**:
- [ ] All 4 characters visible
- [ ] Loading indicator present
- [ ] Smooth transition to script phase

---

#### Test 3C: Copy Button Loading
**Steps**:
1. Generate script
2. Click "复制" button
3. Observe loading state

**Expected Results**:
```
✅ Button shows: "⟳ 正在复制..."
✅ Small spinner in button
✅ Button disabled
✅ Duration: ~500ms
✅ Success message: "已复制！"
```

**Pass Criteria**:
- [ ] Loading indicator in button
- [ ] Success feedback clear

---

#### Test 3D: Export Button Loading
**Steps**:
1. Generate script
2. Click "导出文本" button
3. Observe loading state

**Expected Results**:
```
✅ Button shows: "⟳ 正在导出..."
✅ Small spinner in button
✅ File downloads after loading
✅ Duration: ~500ms
```

**Pass Criteria**:
- [ ] Loading state visible
- [ ] File downloads successfully

---

### **Test 4: Retry Logic** ⭐ PRIORITY

#### Test 4A: Network Failure Retry
**Steps**:
1. Open DevTools → Network tab
2. Enable "Offline" mode
3. Enter valid theme
4. Click "开始创作"
5. Observe console
6. Wait 5 seconds
7. Disable "Offline" mode
8. Observe recovery

**Expected Console Output**:
```
🔄 AI API retry 1/5 in 2s Error: Network timeout
(wait 2 seconds)
🔄 AI API retry 2/5 in 4s Error: Network timeout
(wait 4 seconds)
🔄 AI API retry 3/5 in 8s Error: Network timeout
(disable offline mode)
(wait 8 seconds)
✅ Request succeeded on attempt 4
```

**Expected Results**:
```
✅ Automatic retry attempts visible in console
✅ Exponential backoff: 2s, 4s, 8s, 16s, 32s
✅ Up to 5 retry attempts
✅ Success when network restored
✅ No crashes or errors
```

**Pass Criteria**:
- [ ] Retry messages in console
- [ ] Exponential backoff working
- [ ] Recovery successful
- [ ] No unhandled errors

---

#### Test 4B: Transient Error Retry
**Steps**:
1. Monitor console during normal generation
2. Look for any retry attempts
3. Check final success

**Expected Results**:
```
✅ If transient error occurs: Automatic retry
✅ No user intervention needed
✅ Generation continues
✅ User might not even notice
```

**Pass Criteria**:
- [ ] Transparent retry mechanism
- [ ] User experience smooth

---

### **Test 5: Memory Leak Prevention** ⭐ PRIORITY

#### Test 5A: Timeout Cleanup on Navigation
**Steps**:
1. Enter valid theme and click "开始创作"
2. Wait for character display phase (3-second timer active)
3. **During the 3-second countdown**, click browser back button or refresh
4. Open DevTools → Performance → Memory
5. Take heap snapshot
6. Analyze for detached timers

**Expected Results**:
```
✅ No "detached timer" warnings in console
✅ Timers properly cleaned up on unmount
✅ Memory doesn't increase on repeated navigation
✅ No lingering callbacks
```

**Pass Criteria**:
- [ ] No detached timers
- [ ] Clean memory profile
- [ ] No console warnings

---

#### Test 5B: Long Session Memory Test
**Steps**:
1. Open DevTools → Performance → Memory
2. Take baseline memory snapshot
3. Generate complete script (start to finish)
4. Click "重新开始"
5. Repeat steps 3-4 five more times
6. Take final memory snapshot
7. Compare baseline vs. final

**Expected Results**:
```
✅ Memory increase: < 10MB after 5 iterations
✅ No significant memory growth
✅ Garbage collection working
✅ No accumulated timeouts/intervals
```

**Pass Criteria**:
- [ ] Memory stable over time
- [ ] No accumulating leaks
- [ ] Performance consistent

---

### **Test 6: Error Boundaries** ⭐ PRIORITY

#### Test 6A: Error Boundary Catch
**Steps**:
1. In .env.local, temporarily set invalid API key:
   ```
   CUSTOM_AI_API_KEY=invalid_key_123
   ```
2. Restart dev server: `npm run dev`
3. Open application
4. Try to generate script

**Expected Results**:
```
✅ Error boundary catches error
✅ Error UI displays with:
   - Red alert icon
   - Message: "出现错误"
   - Description: "应用程序遇到了一个错误..."
   - "重试" button
   - "刷新页面" button
✅ No white screen
✅ In dev mode: Error details shown
```

**Pass Criteria**:
- [ ] Error caught gracefully
- [ ] User-friendly error display
- [ ] Retry button works
- [ ] No white screen crash

---

#### Test 6B: Error Recovery
**Steps**:
1. Continue from Test 6A
2. Close browser, fix API key in .env.local
3. Restart server
4. Click "重试" button in error UI

**Expected Results**:
```
✅ Error clears
✅ Application recovers
✅ Can retry operation
```

**Pass Criteria**:
- [ ] Recovery successful
- [ ] App functional after error

---

### **Test 7: Complete Integration Flow** ⭐ PRIORITY

#### Full End-to-End Test
**Steps**:
1. Open http://localhost:3000
2. Clear any existing state (if any)
3. Enter theme: "一个太空探险者发现外星文明的故事"
4. Click "开始创作"
5. Wait for character generation (observe loading)
6. Watch character cards appear
7. Wait 3 seconds for transition
8. Monitor script generation:
   - Observe "导演正在规划场景..." message
   - Watch scene heading appear in script
   - Observe "演员们正在表演..." message
   - Watch dialogue lines appear
   - Observe "正在总结场景..." message
   - See next scene begin
9. Let it generate 2-3 complete scenes
10. Click "暂停"
11. Verify generation pauses
12. Click "继续"
13. Let it complete or click "重新开始"
14. Test "角色列表" sidebar
15. Test "复制" button
16. Test "导出文本" button

**Expected Results** (Full Flow):
```
Phase 1: Input (0-2s)
✅ Input validation works
✅ Button responds immediately

Phase 2: Initialization (2-8s)
✅ Loading state with spinner
✅ Message: "正在生成角色..."
✅ 4 characters generated
✅ Character cards animate in

Phase 3: Character Display (3s)
✅ Character cards visible
✅ Loading spinner with message
✅ Smooth 3-second display

Phase 4: Script Generation (varies)
✅ Status bar shows phase
✅ Scene headings appear
✅ Dialogue lines stream in
✅ Activity log updates in real-time
✅ Scene summaries created

Phase 5: Controls
✅ Pause/Resume works
✅ Reset clears everything
✅ Character list accessible
✅ Copy works
✅ Export downloads file

Phase 6: Completion
✅ "✓ 剧本创作完成" message
✅ Script fully visible
✅ All buttons functional
```

**Pass Criteria**:
- [ ] All phases complete successfully
- [ ] No errors in console
- [ ] Smooth transitions
- [ ] All features functional

---

### **Test 8: Performance Metrics**

#### Performance Benchmarks
**Steps**:
1. Open DevTools → Performance tab
2. Start recording
3. Generate complete script
4. Stop recording
5. Analyze metrics

**Expected Metrics**:
```
✅ First Contentful Paint: < 1s
✅ Time to Interactive: < 2s
✅ Loading state appears: < 100ms
✅ Script line rendering: < 16ms (60fps)
✅ Memory usage: < 100MB
✅ No long tasks (> 50ms)
✅ No layout thrashing
```

**Pass Criteria**:
- [ ] Meets performance budgets
- [ ] Smooth 60fps scrolling
- [ ] No janky animations

---

### **Test 9: Cross-Browser Compatibility**

#### Browser Matrix
| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | [ ] Pass | Primary target |
| Edge | Latest | [ ] Pass | Chromium-based |
| Firefox | Latest | [ ] Pass | Test separately |
| Safari | Latest | [ ] Pass | WebKit engine |

**Steps** (for each browser):
1. Open http://localhost:3000
2. Run Test 7 (Complete Integration Flow)
3. Check for browser-specific issues

**Pass Criteria**:
- [ ] Consistent behavior across browsers
- [ ] No browser-specific errors
- [ ] UI renders correctly

---

### **Test 10: Edge Cases**

#### Edge Case Matrix

| Test Case | Input | Expected Result | Status |
|-----------|-------|----------------|--------|
| Empty spaces | "     " | Error: 请输入主题 | [ ] |
| Chinese only | "一个故事关于爱情" | ✅ Works | [ ] |
| English only | "A detective story" | ✅ Works | [ ] |
| Mixed | "一个detective的故事" | ✅ Works | [ ] |
| Numbers | "2024年的故事" | ✅ Works | [ ] |
| Emoji | "😀 一个快乐的故事" | ✅ Emoji sanitized | [ ] |
| Max length | (exactly 200 chars) | ✅ Works | [ ] |
| Min length | "一个 故事" (5 chars, 2 words) | ✅ Works | [ ] |

---

## Test Results Summary

### Test Execution Checklist

#### Priority Tests (Must Pass) ✅
- [ ] **Test 1**: Rate Limiting (1A, 1B)
- [ ] **Test 2**: Input Validation (2A-2I)
- [ ] **Test 3**: Loading States (3A-3D)
- [ ] **Test 4**: Retry Logic (4A-4B)
- [ ] **Test 5**: Memory Leaks (5A-5B)
- [ ] **Test 6**: Error Boundaries (6A-6B)
- [ ] **Test 7**: Integration Flow

#### Secondary Tests (Nice to Have) ⭐
- [ ] **Test 8**: Performance Metrics
- [ ] **Test 9**: Cross-Browser
- [ ] **Test 10**: Edge Cases

### Overall Status
- **Tests Passed**: _____ / 35
- **Tests Failed**: _____
- **Tests Skipped**: _____
- **Overall Grade**: [ ] PASS [ ] FAIL [ ] PARTIAL

### Sign-Off
- **Tester Name**: ________________
- **Date**: 2026-01-18
- **Environment**: Development
- **Build Version**: 1.0.0

---

## Troubleshooting Guide

### Common Issues

#### Issue: "Cannot read property 'current' of undefined"
**Solution**: Restart dev server, clear browser cache

#### Issue: Rate limiting not working
**Check**: Look for console errors, verify rate-limiter.ts imported correctly

#### Issue: Loading states don't appear
**Check**: useLoadingState hook properly initialized

#### Issue: Retry logic not visible
**Check**: Open console, look for "🔄 AI API retry" messages

#### Issue: Memory leaks detected
**Check**: Verify useSafeTimeout used instead of setTimeout

---

## Automated Test Script

For automated testing, see: `test_full_flow.js`

```bash
# Run automated tests
node test_full_flow.js
```

---

## Test Data

### Sample Valid Themes
```
✅ "一个赛博侦探追捕失控的仿生人"
✅ "太空探险者发现外星文明的故事"
✅ "古代武侠世界中的恩怨情仇"
✅ "时间旅行者试图改变历史"
✅ "AI觉醒后与人类共存的未来"
```

### Sample Invalid Themes
```
❌ "" (empty)
❌ "ab" (too short)
❌ "https://test.com" (URL)
❌ "email@test.com" (email)
❌ "<script>alert(1)</script>" (XSS)
❌ (201+ characters)
```

---

## Test Environment Variables

Create `.env.local` with:
```bash
CUSTOM_AI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
CUSTOM_AI_API_KEY=your-valid-api-key-here
CUSTOM_AI_MODEL=your-model-id-here
ENABLE_STRUCTURED_OUTPUTS=false
```

---

## Conclusion

This comprehensive testing guide covers all critical functionality:
- ✅ Rate limiting protection
- ✅ Input validation and sanitization
- ✅ Loading state feedback
- ✅ Automatic retry logic
- ✅ Memory leak prevention
- ✅ Error boundary recovery
- ✅ Complete integration flow
- ✅ Performance benchmarks
- ✅ Cross-browser compatibility
- ✅ Edge case handling

**Total Test Coverage**: 35+ individual test cases across 10 major categories

**Estimated Testing Time**: 
- Quick test: 5-10 minutes
- Full test suite: 60-90 minutes
- Automated tests: 10-15 minutes

---

**Ready to start testing!** 🚀

Begin with Priority Tests (Test 1-7) and report any failures immediately.
