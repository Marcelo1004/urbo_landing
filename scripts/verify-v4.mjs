import puppeteer from 'puppeteer';
import * as path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\marce\\.gemini\\antigravity\\brain\\6a2f1f62-9aec-45ea-8cee-72b354e41d0b';

async function run() {
  console.log('Launching browser verification for URBO V4...');
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });

  page.on('pageerror', err => {
    errors.push(`PageError: ${err.message}`);
  });

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait 2.5 seconds for GSAP Hero timeline to complete
    await new Promise(r => setTimeout(r, 2500));

    // 1. Hero Dark Mode
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'v4-hero-dark.png') });
    console.log('Captured v4-hero-dark.png');

    // 2. Light Mode Toggle
    const themeBtn = await page.$('button[aria-label="Cambiar a modo claro"], button[aria-label="Cambiar a modo oscuro"]');
    if (themeBtn) {
      await themeBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'v4-hero-light.png') });
      console.log('Captured v4-hero-light.png');
      // Switch back to dark mode
      await themeBtn.click();
      await new Promise(r => setTimeout(r, 800));
    }

    // 3. Solution section tabs
    const solutionSection = await page.$('#solucion');
    if (solutionSection) {
      await solutionSection.scrollIntoView();
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'v4-solution-tabs.png') });
      console.log('Captured v4-solution-tabs.png');
    }

    // 4. Roadmap Three.js 3D WebGL scene
    const roadmapSection = await page.$('#roadmap');
    if (roadmapSection) {
      await roadmapSection.scrollIntoView();
      await new Promise(r => setTimeout(r, 1500));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'v4-roadmap-threejs.png') });
      console.log('Captured v4-roadmap-threejs.png');

      // Click projection toggle button
      const projButtons = await page.$$('button');
      for (const btn of projButtons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.includes('proyección')) {
          console.log('Clicking projection button...');
          await btn.click();
          await new Promise(r => setTimeout(r, 2000));
          await page.screenshot({ path: path.join(ARTIFACT_DIR, 'v4-roadmap-projected.png') });
          console.log('Captured v4-roadmap-projected.png');
          break;
        }
      }
    }

    // 5. Final CTA Optical Glass Card State A & State B
    const ctaSection = await page.$('#unirse');
    if (ctaSection) {
      await ctaSection.scrollIntoView();
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'v4-contact-state-a.png') });
      console.log('Captured v4-contact-state-a.png');

      // Look for flip/toggle button
      const toggleCardBtn = await page.$('button[aria-label="Ver datos de contacto directo"]');
      if (toggleCardBtn) {
        await toggleCardBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: path.join(ARTIFACT_DIR, 'v4-contact-state-b.png') });
        console.log('Captured v4-contact-state-b.png');
      }
    }

    // 6. Mobile Viewport Check
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'v4-mobile.png') });
    console.log('Captured v4-mobile.png');

  } catch (err) {
    console.error('Error during execution:', err);
    errors.push(err.message);
  } finally {
    await browser.close();
  }

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(`Total errors captured: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  } else {
    console.log('SUCCESS: Zero console or runtime errors during complete session!');
  }
}

run();

