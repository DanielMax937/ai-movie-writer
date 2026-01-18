# Comprehensive Test Plan - AI Movie Writer

## Test Execution Date: 2026-01-18

---

## Test Categories

### 1. P0 Critical Issues Testing
### 2. P1 High Priority Issues Testing
### 3. Integration Testing
### 4. Performance Testing
### 5. Edge Cases Testing

---

## 1. P0 Critical Issues Testing

### Test 1.1: Environment Variables Access ✓
**What to Test**: Server-side environment configuration
**Steps**:
1. Check that .env.local exists with required variables
2. Verify application starts without errors
3. Check console for environment-related errors

**Expected Result**: Application starts successfully, no undefined environment variable errors

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 1.2: Character Name Normalization ✓
**What to Test**: Fuzzy character name matching
**Steps**:
1. Start script generation
2. Observe generated character names
3. Check if characters with variations (e.g., "张三" vs "张三（侦探）") can speak

**Expected Result**: All characters can participate in scenes regardless of name variations

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 1.3: Error Boundaries ✓
**What to Test**: Error boundary catches errors gracefully
**Steps**:
1. Intentionally cause an error (e.g., invalid API key in .env.local)
2. Verify error boundary displays error UI
3. Check "Retry" and "Refresh" buttons work

**Expected Result**: Error displayed with retry option, no white screen

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 1.4: Activity Log ID Collision ✓
**What to Test**: Unique ID generation for logs
**Steps**:
1. Start script generation
2. Observe rapid log additions
3. Open dev tools, check for React key warnings

**Expected Result**: No duplicate key warnings, all logs have unique IDs

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 1.5: Orchestrator Race Conditions ✓
**What to Test**: No stale state in orchestrator
**Steps**:
1. Start script generation
2. Rapidly pause/resume multiple times
3. Check console for errors
4. Verify script continues correctly

**Expected Result**: No errors, script generation continues smoothly

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

## 2. P1 High Priority Issues Testing

### Test 2.1: Request Retry Logic ✓
**What to Test**: Automatic retry on failures
**Steps**:
1. Temporarily disable network (dev tools -> Network -> Offline)
2. Try to start script generation
3. Re-enable network
4. Observe console for retry attempts

**Expected Result**: Console shows retry attempts (e.g., "🔄 AI API retry 1/5 in 2s")

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 2.2: Loading States ✓
**What to Test**: Proper loading feedback
**Steps**:
1. Click "开始创作" button
2. Verify loading spinner appears with message
3. Check loading message updates (e.g., "正在生成角色..." → "准备开始创作...")
4. Test copy and export buttons for loading states

**Expected Result**: 
- Clear loading indicators for all operations
- Loading messages update appropriately
- Buttons disabled during loading

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 2.3: Input Validation ✓
**What to Test**: Theme input validation
**Steps**:
1. Try submitting empty theme → Should show error
2. Try "abc" (too short) → Should show error "主题太短"
3. Try very long text (>200 chars) → Should show error
4. Try "https://example.com" → Should show error "不能包含网址"
5. Try valid theme → Should work

**Expected Result**: All invalid inputs rejected with helpful error messages

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 2.4: Rate Limiting ✓
**What to Test**: Protection against excessive requests
**Steps**:
1. Click "开始创作" button
2. Immediately click again multiple times
3. Verify rate limit error appears
4. Test copy/export buttons rapidly

**Expected Result**: 
- Error message: "请求过于频繁，请等待 X 秒后重试"
- Cannot spam requests

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 2.5: Memory Leak Prevention ✓
**What to Test**: Timers cleaned up on unmount
**Steps**:
1. Start script generation
2. Wait for character display phase
3. Navigate away (or refresh page) during 3-second delay
4. Open Chrome Dev Tools → Performance → Memory
5. Check for detached DOM nodes or lingering timers

**Expected Result**: No memory leaks, timers properly cleaned up

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

## 3. Integration Testing

### Test 3.1: Complete Script Generation Flow ✓
**What to Test**: Full end-to-end workflow
**Steps**:
1. Enter valid theme: "一个赛博侦探追捕失控的仿生人"
2. Click "开始创作"
3. Observe character generation (loading state)
4. Watch character display for 3 seconds
5. Monitor script generation (planning, acting, summarizing)
6. Wait for completion
7. Test copy and export

**Expected Result**: 
- Complete script generated successfully
- All phases work correctly
- Copy and export work

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 3.2: Pause and Resume ✓
**What to Test**: Pause/resume functionality
**Steps**:
1. Start script generation
2. Click "暂停" during generation
3. Verify generation stops
4. Click "继续"
5. Verify generation resumes

**Expected Result**: Pause/resume works correctly, no state corruption

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 3.3: Reset Functionality ✓
**What to Test**: Reset clears state properly
**Steps**:
1. Generate partial script
2. Click "重新开始"
3. Verify all state cleared
4. Start new script generation

**Expected Result**: Clean reset, new generation starts fresh

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 3.4: Error Recovery ✓
**What to Test**: Recovery from API errors
**Steps**:
1. Start generation
2. If error occurs, observe retry attempts
3. Check error message display
4. Verify recovery after retries

**Expected Result**: 
- Automatic retry on transient errors
- Clear error messages
- Successful recovery

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

## 4. Performance Testing

### Test 4.1: Long Session Stability ✓
**What to Test**: No degradation over time
**Steps**:
1. Generate 3-5 complete scripts in succession
2. Monitor memory usage (Chrome Dev Tools → Performance)
3. Check for console warnings/errors
4. Verify responsiveness remains good

**Expected Result**: 
- No memory leaks
- Consistent performance
- No accumulated errors

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 4.2: Large Script Rendering ✓
**What to Test**: Rendering performance with many lines
**Steps**:
1. Generate script with 10+ scenes
2. Scroll through script panel
3. Check for lag or jank

**Expected Result**: Smooth scrolling, no performance issues

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 4.3: Rapid Operations ✓
**What to Test**: System handles rapid user actions
**Steps**:
1. Rapidly click various buttons
2. Quickly type in input field
3. Rapidly switch between UI elements

**Expected Result**: No crashes, rate limiting works, UI remains responsive

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

## 5. Edge Cases Testing

### Test 5.1: Network Interruption ✓
**What to Test**: Handling of network failures
**Steps**:
1. Start generation
2. Disable network mid-generation
3. Observe retry behavior
4. Re-enable network
5. Verify recovery

**Expected Result**: 
- Automatic retries visible in console
- Eventually succeeds when network restored

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 5.2: Chinese Character Handling ✓
**What to Test**: Proper handling of Chinese text
**Steps**:
1. Input theme with Chinese characters
2. Verify validation works
3. Check generated script displays correctly

**Expected Result**: All Chinese text handled properly

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 5.3: Special Characters in Input ✓
**What to Test**: Sanitization of special characters
**Steps**:
1. Try input with emojis: "😀 探险故事"
2. Try with special chars: "<script>alert('xss')</script>"
3. Try with newlines and extra spaces

**Expected Result**: Input sanitized, XSS prevented, extra whitespace normalized

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 5.4: Browser Compatibility ✓
**What to Test**: Works in different browsers
**Steps**:
1. Test in Chrome/Edge
2. Test in Firefox
3. Test in Safari (if available)

**Expected Result**: Consistent behavior across browsers

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

### Test 5.5: Empty/Invalid Responses ✓
**What to Test**: Handling of unexpected API responses
**Steps**:
1. Monitor console during generation
2. Look for parsing errors or validation failures
3. Verify application doesn't crash

**Expected Result**: Graceful handling of invalid responses

**Status**: [ ] Pass [ ] Fail [ ] Not Tested

---

## Test Execution Summary

### Priority Tests (Must Pass)
- [ ] P0 Tests (5 tests)
- [ ] P1 Tests (5 tests)
- [ ] Integration Tests (4 tests)

### Optional Tests (Nice to Have)
- [ ] Performance Tests (3 tests)
- [ ] Edge Cases Tests (5 tests)

### Total Tests: 22

---

## Automated Test Commands

```bash
# Linter Check
npm run lint

# Type Check
npm run type-check

# Build Check
npm run build

# Start Dev Server
npm run dev
```

---

## Bug Reporting Template

**Test ID**: [e.g., Test 2.3]  
**Status**: FAIL  
**Steps to Reproduce**:  
1. 
2. 
3. 

**Expected Result**:  
[What should happen]

**Actual Result**:  
[What actually happened]

**Console Errors**:  
```
[Paste errors here]
```

**Screenshots**:  
[Attach if applicable]

---

## Sign-off

**Tester**: _______________  
**Date**: 2026-01-18  
**Overall Status**: [ ] PASS [ ] FAIL [ ] PARTIAL  

**Notes**:
