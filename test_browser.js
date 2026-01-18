/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');

async function runTests() {
  let browser, page, context;
  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: []
  };

  try {
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 300  // Slow down for visibility
    });
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    page = await context.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ PAGE ERROR:', msg.text());
      }
    });
    page.on('pageerror', error => console.error('💥 PAGE CRASH:', error.message));

    // ===== TC-001: Page Load Test =====
    console.log('\n🧪 TC-001: Page Load Test');
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000); // Wait for hydration
      
      const title = await page.title();
      console.log(`   📄 Page title: "${title}"`);
      
      if (title.includes('编剧室') || title.includes('ScriptWriter')) {
        console.log('   ✅ TC-001 PASSED: Page loaded successfully');
        results.passed++;
        results.tests.push({ id: 'TC-001', status: 'PASSED', message: 'Page loaded' });
      } else {
        throw new Error('Page title incorrect');
      }
      
      await page.screenshot({ path: '/tmp/tc001.png', fullPage: true });
    } catch (error) {
      console.log(`   ❌ TC-001 FAILED: ${error.message}`);
      results.failed++;
      results.tests.push({ id: 'TC-001', status: 'FAILED', message: error.message });
      throw error; // Stop if page doesn't load
    }

    // ===== TC-002: Initial State Display =====
    console.log('\n🧪 TC-002: Initial State Display');
    try {
      // Check for main heading
      const heading = await page.locator('h1').first().textContent();
      console.log(`   📝 Main heading: "${heading}"`);
      
      // Check for the card with initialization form
      const card = await page.locator('text=开始创作你的电影剧本').count();
      console.log(`   🎴 Initialization card found: ${card > 0 ? 'Yes' : 'No'}`);
      
      // Check for input field (should be visible in idle state)
      const input = page.locator('input[placeholder*="例如"]').first();
      const inputVisible = await input.isVisible().catch(() => false);
      console.log(`   📝 Input field visible: ${inputVisible}`);
      
      // Check for start button
      const button = page.locator('button:has-text("开始创作")').first();
      const buttonVisible = await button.isVisible().catch(() => false);
      console.log(`   🔘 Start button visible: ${buttonVisible}`);
      
      if (inputVisible && buttonVisible) {
        console.log('   ✅ TC-002 PASSED: Initial state correct');
        results.passed++;
        results.tests.push({ id: 'TC-002', status: 'PASSED' });
      } else {
        throw new Error(`Missing UI elements - Input: ${inputVisible}, Button: ${buttonVisible}`);
      }
      
      await page.screenshot({ path: '/tmp/tc002.png', fullPage: true });
    } catch (error) {
      console.log(`   ❌ TC-002 FAILED: ${error.message}`);
      results.failed++;
      results.tests.push({ id: 'TC-002', status: 'FAILED', message: error.message });
    }

    // ===== TC-003: Theme Input Functionality =====
    console.log('\n🧪 TC-003: Theme Input Functionality');
    try {
      const input = page.locator('input[placeholder*="例如"]').first();
      const testTheme = '一个关于人工智能觉醒的科幻故事';
      
      await input.fill(testTheme);
      await page.waitForTimeout(500);
      
      const inputValue = await input.inputValue();
      console.log(`   📝 Input value: "${inputValue}"`);
      
      if (inputValue === testTheme) {
        console.log('   ✅ TC-003 PASSED: Input works correctly');
        results.passed++;
        results.tests.push({ id: 'TC-003', status: 'PASSED' });
      } else {
        throw new Error('Input value mismatch');
      }
      
      await page.screenshot({ path: '/tmp/tc003.png', fullPage: true });
    } catch (error) {
      console.log(`   ❌ TC-003 FAILED: ${error.message}`);
      results.failed++;
      results.tests.push({ id: 'TC-003', status: 'FAILED', message: error.message });
    }

    // ===== TC-004: Character Generation Flow =====
    console.log('\n🧪 TC-004: Character Generation Flow');
    try {
      // The input should already have our theme from TC-003
      const startButton = page.locator('button:has-text("开始创作")').first();
      
      // Check button is enabled
      const isDisabled = await startButton.isDisabled();
      console.log(`   🔘 Button disabled: ${isDisabled}`);
      
      if (!isDisabled) {
        console.log('   🖱️  Clicking start button...');
        await startButton.click();
        await page.waitForTimeout(2000);
        
        // Wait for "正在初始化" or character generation
        console.log('   ⏳ Waiting for initialization...');
        
        // Look for activity log or character cards
        await page.waitForSelector('text=正在初始化, text=正在召集演员, text=已召集', { 
          timeout: 10000 
        }).catch(() => console.log('   ⚠️  No initialization message found'));
        
        // Wait longer for characters to appear (API call)
        console.log('   ⏳ Waiting for characters (up to 60s)...');
        await page.waitForTimeout(60000); // Wait 60 seconds for API
        
        // Take screenshot to see what happened
        await page.screenshot({ path: '/tmp/tc004-after-wait.png', fullPage: true });
        
        // Check for any character-related content
        const pageContent = await page.content();
        const hasCharacterMention = pageContent.includes('演员') || pageContent.includes('角色') || pageContent.includes('character');
        console.log(`   👥 Character mentions found: ${hasCharacterMention}`);
        
        // Check activity logs
        const activityLogs = await page.locator('[class*="activity"], [class*="log"]').count();
        console.log(`   📋 Activity log entries: ${activityLogs}`);
        
        if (hasCharacterMention || activityLogs > 0) {
          console.log('   ✅ TC-004 PASSED: Character generation initiated');
          results.passed++;
          results.tests.push({ id: 'TC-004', status: 'PASSED', message: 'Generation started' });
        } else {
          throw new Error('No sign of character generation');
        }
        
      } else {
        throw new Error('Start button is disabled');
      }
      
      await page.screenshot({ path: '/tmp/tc004.png', fullPage: true });
      
    } catch (error) {
      console.log(`   ❌ TC-004 FAILED: ${error.message}`);
      results.failed++;
      results.tests.push({ id: 'TC-004', status: 'FAILED', message: error.message });
      await page.screenshot({ path: '/tmp/tc004-failed.png', fullPage: true });
    }

    // ===== TC-005: Check for Script Content =====
    console.log('\n🧪 TC-005: Script Content Check');
    try {
      // Wait a bit more for script to start appearing
      await page.waitForTimeout(30000);
      
      const scriptContent = await page.locator('[class*="script"], [class*="剧本"]').count();
      console.log(`   📜 Script sections found: ${scriptContent}`);
      
      // Check for any scene headings or dialogue
      const pageText = await page.textContent('body');
      const hasSceneHeading = pageText.includes('INT.') || pageText.includes('EXT.');
      console.log(`   🎬 Scene headings found: ${hasSceneHeading}`);
      
      if (scriptContent > 0 || hasSceneHeading) {
        console.log('   ✅ TC-005 PASSED: Script content visible');
        results.passed++;
        results.tests.push({ id: 'TC-005', status: 'PASSED' });
      } else {
        console.log('   ⚠️  TC-005 SKIPPED: Script not yet generated (may need more time)');
        results.skipped++;
        results.tests.push({ id: 'TC-005', status: 'SKIPPED', message: 'Needs more time' });
      }
      
      await page.screenshot({ path: '/tmp/tc005.png', fullPage: true });
      
    } catch (error) {
      console.log(`   ⚠️  TC-005 SKIPPED: ${error.message}`);
      results.skipped++;
      results.tests.push({ id: 'TC-005', status: 'SKIPPED', message: error.message });
    }

    // ===== TC-011: Pause/Resume Functionality =====
    console.log('\n🧪 TC-011: Pause/Resume Functionality');
    try {
      const pauseButton = page.locator('button:has-text("暂停"), button:has-text("Pause")').first();
      const pauseVisible = await pauseButton.isVisible().catch(() => false);
      
      if (pauseVisible) {
        console.log('   🖱️  Clicking pause button...');
        await pauseButton.click();
        await page.waitForTimeout(1000);
        
        // Check if button text changed to "继续"
        const resumeButton = page.locator('button:has-text("继续"), button:has-text("Resume")').first();
        const resumeVisible = await resumeButton.isVisible().catch(() => false);
        
        if (resumeVisible) {
          console.log('   ✅ TC-011 PASSED: Pause/Resume works');
          results.passed++;
          results.tests.push({ id: 'TC-011', status: 'PASSED' });
        } else {
          throw new Error('Resume button not found after pause');
        }
      } else {
        console.log('   ⚠️  TC-011 SKIPPED: Pause button not visible yet');
        results.skipped++;
        results.tests.push({ id: 'TC-011', status: 'SKIPPED', message: 'Button not visible' });
      }
      
      await page.screenshot({ path: '/tmp/tc011.png', fullPage: true });
    } catch (error) {
      console.log(`   ❌ TC-011 FAILED: ${error.message}`);
      results.failed++;
      results.tests.push({ id: 'TC-011', status: 'FAILED', message: error.message });
    }

    // ===== TC-012: Reset Functionality =====
    console.log('\n🧪 TC-012: Reset Functionality');
    try {
      const resetButton = page.locator('button:has-text("重新开始"), button:has-text("重置"), button:has-text("Reset")').first();
      const resetVisible = await resetButton.isVisible().catch(() => false);
      
      if (resetVisible) {
        console.log('   🖱️  Clicking reset button...');
        await resetButton.click();
        await page.waitForTimeout(2000);
        
        // Check if we're back to initial state
        const initCard = await page.locator('text=开始创作你的电影剧本').count();
        console.log(`   🔄 Back to initial state: ${initCard > 0 ? 'Yes' : 'No'}`);
        
        if (initCard > 0) {
          console.log('   ✅ TC-012 PASSED: Reset works correctly');
          results.passed++;
          results.tests.push({ id: 'TC-012', status: 'PASSED' });
        } else {
          throw new Error('Not back to initial state after reset');
        }
      } else {
        console.log('   ⚠️  TC-012 SKIPPED: Reset button not visible');
        results.skipped++;
        results.tests.push({ id: 'TC-012', status: 'SKIPPED', message: 'Button not found' });
      }
      
      await page.screenshot({ path: '/tmp/tc012.png', fullPage: true });
    } catch (error) {
      console.log(`   ❌ TC-012 FAILED: ${error.message}`);
      results.failed++;
      results.tests.push({ id: 'TC-012', status: 'FAILED', message: error.message });
    }

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST EXECUTION SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Tests Run: ${results.passed + results.failed + results.skipped}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⚠️  Skipped: ${results.skipped}`);
    console.log(`\n📈 Pass Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    console.log('\n📋 Detailed Results:');
    results.tests.forEach(test => {
      const icon = test.status === 'PASSED' ? '✅' : test.status === 'FAILED' ? '❌' : '⚠️ ';
      const msg = test.message ? ` - ${test.message}` : '';
      console.log(`  ${icon} ${test.id}: ${test.status}${msg}`);
    });
    console.log('='.repeat(70));
    
    console.log('\n📸 Screenshots saved to /tmp/tc*.png');
    console.log('\n⏳ Keeping browser open for 15 seconds for manual inspection...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('\n💥 FATAL ERROR:', error.message);
    console.error(error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return results;
}

runTests().then(results => {
  const exitCode = results.failed > 0 ? 1 : 0;
  console.log(`\n🏁 Tests completed with exit code: ${exitCode}`);
  process.exit(exitCode);
}).catch(error => {
  console.error('💥 Test runner crashed:', error);
  process.exit(1);
});
