import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'scratch_screenshots';
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR);

async function verify() {
  console.log('Launching headless Chrome for interactive motion & layout tests...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test Homepage
  console.log('\n[1] Testing Homepage hero and tickers...');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_homepage_hero.png') });
  console.log('  ✓ Saved 01_homepage_hero.png');

  // 2. Test Pricing Configurator & Subscription Toggle
  console.log('\n[2] Testing Pricing Section & Sliders...');
  const pricingSection = await page.$('#pricing');
  if (pricingSection) {
    await pricingSection.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));

    // Read initial price
    const initialPrice = await page.$eval('#cfg-price', el => el.textContent.trim());
    console.log(`  Initial Pay-per-screen Price: ${initialPrice}`);

    // Click slider to change tier
    const sliderBox = await page.$eval('#cfg-slider', el => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width * 0.75, y: r.top + r.height / 2 };
    });
    await page.mouse.click(sliderBox.x, sliderBox.y);
    await new Promise(r => setTimeout(r, 600));

    const updatedPrice = await page.$eval('#cfg-price', el => el.textContent.trim());
    console.log(`  Updated Pay-per-screen Price after click: ${updatedPrice}`);

    // Test Subscription Toggle
    const initialSub = await page.$eval('#sub-price-num', el => el.textContent.trim());
    console.log(`  Initial Subscription: $${initialSub}`);

    // Click Weekly button
    const weeklyBtn = await page.$('button[data-plan="weekly"]');
    if (weeklyBtn) {
      await weeklyBtn.click();
      await new Promise(r => setTimeout(r, 600));
      const weeklySub = await page.$eval('#sub-price-num', el => el.textContent.trim());
      console.log(`  After switching to Weekly: $${weeklySub}`);
    }

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_pricing_interactive.png') });
    console.log('  ✓ Saved 02_pricing_interactive.png');
  }

  // 3. Test Footer Marble Jar & Drop Button
  console.log('\n[3] Testing Marble Jar Physics & Mood Picker...');
  const footer = await page.$('#footer');
  if (footer) {
    await footer.scrollIntoView();
    await new Promise(r => setTimeout(r, 1200));

    // Check marble drop button
    const dropBtn = await page.$('#jar-drop');
    if (dropBtn) {
      console.log('  Clicking "Drop a marble"...');
      await dropBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await dropBtn.click();
      await new Promise(r => setTimeout(r, 800));
    }

    const note = await page.$eval('#jar-note', el => el.textContent.trim());
    console.log(`  Jar note after drops: "${note}"`);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_footer_jar_active.png') });
    console.log('  ✓ Saved 03_footer_jar_active.png');
  }

  // 4. Test Subpages (Services, Work, Pricing)
  console.log('\n[4] Testing Subpages Layout...');
  await page.goto('http://localhost:4321/services', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_services_page.png') });
  console.log('  ✓ Saved 04_services_page.png');

  await page.goto('http://localhost:4321/work', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_work_page.png') });
  console.log('  ✓ Saved 05_work_page.png');

  // 5. Test Mobile Viewport (iPhone 14 / 390x844)
  console.log('\n[5] Testing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_mobile_hero.png') });
  console.log('  ✓ Saved 06_mobile_hero.png');

  // Test Mobile Navigation Drawer
  const hamburger = await page.$('.hamburger-btn');
  if (hamburger) {
    console.log('  Toggling mobile drawer...');
    await hamburger.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_mobile_drawer_open.png') });
    console.log('  ✓ Saved 07_mobile_drawer_open.png');
  }

  // Check horizontal overflow
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`  Mobile horizontal overflow: ${hasHorizontalScroll ? 'WARNING: Detected' : 'NONE (Perfect)'}`);

  await browser.close();
  console.log('\nAll motion, interaction, and segmentation tests complete!');
}

verify().catch(console.error);
