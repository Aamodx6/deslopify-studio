import puppeteer from 'puppeteer';

const routes = [
  '/',
  '/about-us',
  '/services',
  '/services-detail',
  '/work',
  '/work/indus-fintech',
  '/pricing',
  '/blog',
  '/contact-us'
];

async function run() {
  console.log('Launching browser for audit...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const allErrors = [];
  const allConsole = [];
  const failedRequests = [];

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    allConsole.push({ type, text, url: page.url() });
    if (type === 'error') {
      console.error(`[PAGE ERROR] (${page.url()}): ${text}`);
      allErrors.push({ url: page.url(), text });
    }
  });

  page.on('pageerror', err => {
    console.error(`[UNCAUGHT EXCEPTION] (${page.url()}): ${err.message}`);
    allErrors.push({ url: page.url(), text: err.message, stack: err.stack });
  });

  page.on('requestfailed', req => {
    console.error(`[REQUEST FAILED] ${req.url()}: ${req.failure()?.errorText}`);
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
  });

  for (const route of routes) {
    const url = `http://localhost:4321${route}`;
    console.log(`\nAuditing route: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      // Wait 1 second to let ticker and typing animations tick
      await new Promise(r => setTimeout(r, 1000));

      const pageMetrics = await page.evaluate(() => {
        const bodyHeight = document.body.scrollHeight;
        const sections = Array.from(document.querySelectorAll('section, header, footer, .canvas')).map(el => {
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            id: el.id,
            className: el.className,
            top: Math.round(rect.top + window.scrollY),
            height: Math.round(rect.height)
          };
        });
        return { bodyHeight, sections };
      });

      console.log(`  Page body height: ${pageMetrics.bodyHeight}px`);
      console.log(`  Sections detected: ${pageMetrics.sections.length}`);
      for (const s of pageMetrics.sections.slice(0, 8)) {
        console.log(`    <${s.tag} id="${s.id}" class="${s.className.slice(0, 30)}">: top=${s.top}px, height=${s.height}px`);
      }
    } catch (e) {
      console.error(`Failed to load ${url}:`, e.message);
    }
  }

  await browser.close();

  console.log('\n================ AUDIT SUMMARY ================');
  console.log(`Total Uncaught Errors: ${allErrors.length}`);
  for (const e of allErrors) {
    console.log(`  Error on ${e.url}: ${e.text}`);
  }
  console.log(`Total Failed Requests: ${failedRequests.length}`);
  for (const fr of failedRequests) {
    console.log(`  Failed req: ${fr.url} - ${fr.error}`);
  }
}

run().catch(console.error);
