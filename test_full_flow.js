/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');

/**
 * Comprehensive end-to-end test for AI ScriptWriter
 * Tests the complete flow from theme input to script generation
 */
async function runFullFlowTest() {
  let browser, page, context;
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  try {
    console.log('\n' + '='.repeat(70));
    console.log('🎬 AI SCRIPTWRITER - FULL FLOW TEST');
    console.log('='.repeat(70) + '\n');

    browser = await chromium.launch({ 
      headless: false,
      slowMo: 200
    });
    
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    page = await context.newPage();
    
    // Track console messages
    const consoleLogs = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      if (msg.type() === 'error') {
        console.log('   ❌ Browser Error:', text);
      }
    });

    // ===== Step 1: Load Page =====
    console.log('📍 Step 1: Loading application...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    console.log('   ✅ Page loaded\n');
    await page.screenshot({ path: '/tmp/full-flow-01-loaded.png', fullPage: true });

    // ===== Step 2: Enter Theme =====
    console.log('📍 Step 2: Entering theme...');
    const theme = '一个关于人工智能觉醒的科幻故事';
    const input = page.locator('input[placeholder*="例如"]').first();
    await input.fill(theme);
    await page.waitForTimeout(500);
    console.log(`   ✅ Theme entered: "${theme}"\n`);
    await page.screenshot({ path: '/tmp/full-flow-02-theme.png', fullPage: true });

    // ===== Step 3: Start Generation =====
    console.log('📍 Step 3: Starting script generation...');
    const startButton = page.locator('button:has-text("开始创作")').first();
    await startButton.click();
    console.log('   ✅ Start button clicked\n');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/full-flow-03-started.png', fullPage: true });

    // ===== Step 4: Wait for Character Generation =====
    console.log('📍 Step 4: Waiting for character generation (up to 60s)...');
    const startTime = Date.now();
    
    // Wait for characters or error
    let charactersGenerated = false;
    let attempts = 0;
    const maxAttempts = 30; // 30 * 2s = 60s
    
    while (attempts < maxAttempts && !charactersGenerated) {
      await page.waitForTimeout(2000);
      attempts++;
      
      const pageText = await page.textContent('body');
      
      // Check for character names or "已召集"
      if (pageText.includes('已召集') || pageText.includes('演员')) {
        charactersGenerated = true;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`   ✅ Characters generated in ${elapsed}s\n`);
        break;
      }
      
      // Check for errors
      if (pageText.includes('失败') || pageText.includes('错误')) {
        console.log('   ❌ Error detected during generation\n');
        break;
      }
      
      if (attempts % 5 === 0) {
        console.log(`   ⏳ Still waiting... (${attempts * 2}s elapsed)`);
      }
    }
    
    await page.screenshot({ path: '/tmp/full-flow-04-characters.png', fullPage: true });

    if (!charactersGenerated) {
      console.log('   ⚠️  Character generation took longer than expected\n');
      results.failed++;
      results.tests.push({ id: 'character-gen', status: 'FAILED', message: 'Timeout' });
    } else {
      results.passed++;
      results.tests.push({ id: 'character-gen', status: 'PASSED' });
    }

    // ===== Step 5: Wait for Script Content =====
    console.log('📍 Step 5: Waiting for script content (up to 120s)...');
    const scriptStartTime = Date.now();
    
    let scriptGenerated = false;
    attempts = 0;
    const maxScriptAttempts = 60; // 60 * 2s = 120s
    
    while (attempts < maxScriptAttempts && !scriptGenerated) {
      await page.waitForTimeout(2000);
      attempts++;
      
      const pageText = await page.textContent('body');
      
      // Check for scene headings
      if (pageText.includes('INT.') || pageText.includes('EXT.') || pageText.includes('内景') || pageText.includes('外景')) {
        scriptGenerated = true;
        const elapsed = ((Date.now() - scriptStartTime) / 1000).toFixed(1);
        console.log(`   ✅ Script generation started in ${elapsed}s\n`);
        break;
      }
      
      if (attempts % 10 === 0) {
        console.log(`   ⏳ Still waiting for script... (${attempts * 2}s elapsed)`);
        await page.screenshot({ path: `/tmp/full-flow-05-waiting-${attempts}.png`, fullPage: true });
      }
    }
    
    await page.screenshot({ path: '/tmp/full-flow-05-script.png', fullPage: true });

    if (!scriptGenerated) {
      console.log('   ⚠️  Script generation took longer than expected\n');
      results.failed++;
      results.tests.push({ id: 'script-gen', status: 'FAILED', message: 'Timeout' });
    } else {
      results.passed++;
      results.tests.push({ id: 'script-gen', status: 'PASSED' });
    }

    // ===== Step 6: Check Activity Log =====
    console.log('📍 Step 6: Checking activity log...');
    const activityText = await page.textContent('body');
    const hasLogs = activityText.includes('导演') || activityText.includes('演员') || activityText.includes('正在');
    
    if (hasLogs) {
      console.log('   ✅ Activity log is updating\n');
      results.passed++;
      results.tests.push({ id: 'activity-log', status: 'PASSED' });
    } else {
      console.log('   ⚠️  Activity log not found\n');
      results.failed++;
      results.tests.push({ id: 'activity-log', status: 'FAILED' });
    }

    // ===== Step 7: Test Pause/Resume =====
    console.log('📍 Step 7: Testing pause/resume...');
    const pauseButton = page.locator('button:has-text("暂停"), button:has-text("Pause")').first();
    const pauseVisible = await pauseButton.isVisible().catch(() => false);
    
    if (pauseVisible) {
      await pauseButton.click();
      await page.waitForTimeout(1000);
      console.log('   ✅ Paused\n');
      
      const resumeButton = page.locator('button:has-text("继续"), button:has-text("Resume")').first();
      await resumeButton.click();
      await page.waitForTimeout(1000);
      console.log('   ✅ Resumed\n');
      
      results.passed++;
      results.tests.push({ id: 'pause-resume', status: 'PASSED' });
    } else {
      console.log('   ⚠️  Pause button not available yet\n');
      results.tests.push({ id: 'pause-resume', status: 'SKIPPED' });
    }

    await page.screenshot({ path: '/tmp/full-flow-07-controls.png', fullPage: true });

    // ===== Step 8: Wait for More Content =====
    console.log('📍 Step 8: Waiting for more script content (30s)...');
    await page.waitForTimeout(30000);
    await page.screenshot({ path: '/tmp/full-flow-08-more-content.png', fullPage: true });
    console.log('   ✅ Continued generation\n');

    // ===== Step 9: Test Copy Function =====
    console.log('📍 Step 9: Testing copy to clipboard...');
    const copyButton = page.locator('button:has-text("复制"), button:has-text("Copy")').first();
    const copyVisible = await copyButton.isVisible().catch(() => false);
    
    if (copyVisible) {
      await copyButton.click();
      await page.waitForTimeout(1000);
      
      // Check for "已复制" feedback
      const feedbackText = await page.textContent('body');
      if (feedbackText.includes('已复制')) {
        console.log('   ✅ Copy function works\n');
        results.passed++;
        results.tests.push({ id: 'copy', status: 'PASSED' });
      } else {
        console.log('   ⚠️  Copy feedback not shown\n');
        results.failed++;
        results.tests.push({ id: 'copy', status: 'FAILED' });
      }
    } else {
      console.log('   ⚠️  Copy button not available\n');
      results.tests.push({ id: 'copy', status: 'SKIPPED' });
    }

    // ===== Final Screenshot =====
    await page.screenshot({ path: '/tmp/full-flow-final.png', fullPage: true });

    // ===== Print Summary =====
    console.log('\n' + '='.repeat(70));
    console.log('📊 FULL FLOW TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Tests: ${results.passed + results.failed}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`\n📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    console.log('\n📋 Test Results:');
    results.tests.forEach(test => {
      const icon = test.status === 'PASSED' ? '✅' : test.status === 'FAILED' ? '❌' : '⚠️ ';
      const msg = test.message ? ` - ${test.message}` : '';
      console.log(`  ${icon} ${test.id}: ${test.status}${msg}`);
    });
    console.log('='.repeat(70));
    
    console.log('\n📸 Screenshots saved to /tmp/full-flow-*.png');
    console.log('\n⏳ Keeping browser open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('\n💥 TEST FAILED:', error.message);
    console.error(error.stack);
    results.failed++;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return results;
}

runFullFlowTest().then(results => {
  const exitCode = results.failed > 0 ? 1 : 0;
  console.log(`\n🏁 Full flow test completed with exit code: ${exitCode}`);
  process.exit(exitCode);
}).catch(error => {
  console.error('💥 Test runner crashed:', error);
  process.exit(1);
});
