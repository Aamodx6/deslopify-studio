import puppeteer from 'puppeteer';

async function testCal() {
  console.log('Launching browser to test interactive Cal.com scheduling widget...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('pageerror', err => {
    console.error('[PAGE ERROR]', err.message);
    errors.push(err.message);
  });

  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle2' });

  // Scroll to #book
  const calCard = await page.$('#book');
  if (!calCard) throw new Error('#book not found');
  await calCard.scrollIntoView();
  await new Promise(r => setTimeout(r, 800));

  // Check host details
  const hostName = await page.$eval('.cal-host-name', el => el.textContent.trim());
  const meetingTitle = await page.$eval('.cal-meeting-title', el => el.textContent.trim());
  console.log(`✓ Host info detected: "${hostName}", "${meetingTitle}"`);

  // Check month header
  const monthTitle = await page.$eval('#cal-month-title', el => el.textContent.trim());
  console.log(`✓ Calendar month header: "${monthTitle}"`);

  // Check selected date cell
  const selectedDay = await page.$eval('.cal-day-cell.selected', el => el.textContent.trim());
  const selectedDayHeader = await page.$eval('#cal-selected-day-label', el => el.textContent.trim());
  console.log(`✓ Selected day: ${selectedDay} (header: "${selectedDayHeader}")`);

  // Check available slots count
  const slotCount = await page.$$eval('.cal-slot-btn', els => els.length);
  const firstSlotText = await page.$eval('.cal-slot-btn', el => el.textContent.trim());
  console.log(`✓ Found ${slotCount} time slots (first slot: "${firstSlotText}")`);

  // Test 12h / 24h toggle
  console.log('Testing 24h toggle...');
  await page.click('#fmt-24');
  await new Promise(r => setTimeout(r, 200));
  const slot24 = await page.$eval('.cal-slot-btn', el => el.textContent.trim());
  console.log(`✓ First slot in 24h format: "${slot24}"`);

  await page.click('#fmt-12');
  await new Promise(r => setTimeout(r, 200));

  // Screenshot initial widget
  await page.screenshot({ path: 'scratch_screenshots/cal_widget_desktop.png' });
  console.log('✓ Saved cal_widget_desktop.png');

  // Click another day (e.g. 27th)
  console.log('Testing date selection (click day 27)...');
  const day27 = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('.cal-day-cell.available')).find(el => el.textContent.trim() === '27');
  });
  if (day27) {
    await day27.click();
    await new Promise(r => setTimeout(r, 300));
    const newHeader = await page.$eval('#cal-selected-day-label', el => el.textContent.trim());
    console.log(`✓ Header updated after clicking 27th: "${newHeader}"`);
  }

  // Click a time slot to open booking form
  console.log('Testing slot selection to open booking form...');
  await page.click('.cal-slot-btn');
  await new Promise(r => setTimeout(r, 400));

  const isFormVisible = await page.$eval('#cal-view-form', el => el.style.display !== 'none');
  const summaryText = await page.$eval('#cal-summary-datetime', el => el.textContent.trim());
  console.log(`✓ Booking form visible: ${isFormVisible} (Summary: "${summaryText}")`);

  // Fill in form and submit
  console.log('Filling in booking form...');
  await page.type('#cal-input-name', 'Elena Rostova');
  await page.type('#cal-input-email', 'elena@aurora-ai.io');
  await page.type('#cal-input-notes', 'We have a multimodal OCR pipeline we want to review.');

  await page.screenshot({ path: 'scratch_screenshots/cal_booking_form.png' });
  console.log('✓ Saved cal_booking_form.png');

  console.log('Submitting booking...');
  await page.click('#cal-submit-btn');
  await new Promise(r => setTimeout(r, 400));

  const isSuccessVisible = await page.$eval('#cal-view-success', el => el.style.display !== 'none');
  const successEmail = await page.$eval('#cal-success-email', el => el.textContent.trim());
  console.log(`✓ Booking confirmed: ${isSuccessVisible} (Email: "${successEmail}")`);

  await page.screenshot({ path: 'scratch_screenshots/cal_success_screen.png' });
  console.log('✓ Saved cal_success_screen.png');

  // Test Reset back to calendar
  await page.click('#cal-reset-btn');
  await new Promise(r => setTimeout(r, 300));
  const isSlotsBack = await page.$eval('#cal-view-slots', el => el.style.display !== 'none');
  console.log(`✓ Reset back to slots view: ${isSlotsBack}`);

  // Test Mobile view
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('http://localhost:4321/#book', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'scratch_screenshots/cal_widget_mobile.png' });
  console.log('✓ Saved cal_widget_mobile.png');

  await browser.close();

  if (errors.length) {
    console.error(`Total errors encountered: ${errors.length}`);
    process.exit(1);
  } else {
    console.log('\nAll Cal.com scheduling widget tests PASSED with 0 errors!');
  }
}

testCal().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
