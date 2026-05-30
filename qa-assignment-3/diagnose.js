const { chromium } = require('@playwright/test');
const { writeFileSync } = require('fs');
(async () => {
  const browser = await chromium.launch({ headless: true });

  // Provision fresh demo
  const page = await browser.newPage();
  await page.goto('https://demo.prestashop.com/#/en/front', { waitUntil: 'domcontentloaded', timeout: 30000 });
  let shopBase = '';
  for (let i = 0; i < 30; i++) {
    const srcs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('iframe')).map(e => e.src)
        .filter(s => s && !s.includes('doubleclick') && !s.includes('google') && s !== '')
    );
    if (srcs.length > 0) { shopBase = new URL(srcs[0]).origin; break; }
    await new Promise(r => setTimeout(r, 2000));
  }
  writeFileSync('.shopurl', shopBase, 'utf-8');
  console.log('Shop:', shopBase);

  // Login page
  const login = await browser.newPage();
  await login.goto(shopBase + '/login', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await login.waitForTimeout(1000);
  const allForms = await login.evaluate(() =>
    Array.from(document.querySelectorAll('form')).map(f => ({
      id: f.id,
      action: f.action ? f.action.toString().slice(-30) : '',
      inputs: Array.from(f.querySelectorAll('input')).map(i => ({
        id: i.id, name: i.name, type: i.type, class: i.className.slice(0,40)
      })),
      buttons: Array.from(f.querySelectorAll('button')).map(b => ({
        type: b.type, text: b.textContent?.trim().slice(0,20), class: b.className.slice(0,40)
      }))
    }))
  );
  console.log('\n=== ALL FORMS ON LOGIN PAGE ===');
  console.log(JSON.stringify(allForms, null, 2));

  // Category page — inspect full #js-product-list-top and breadcrumb
  const cat = await browser.newPage();
  await cat.goto(shopBase + '/3-clothes', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await cat.waitForTimeout(1000);
  const catData = await cat.evaluate(() => {
    const listTop = document.querySelector('[id*="product-list-top"], [class*="products__sort"], [class*="listing-top"]');
    const breadcrumb = document.querySelector('[class*="breadcrumb"], [aria-label*="readcrumb"]');
    const filterWrapper = document.querySelector('[id*="filter"], [id*="facet"], [class*="facetedsearch"]');
    return {
      listTop: listTop ? listTop.id + '|' + listTop.className.slice(0,50) + ':\n' + listTop.outerHTML.slice(0,500) : 'NOT FOUND',
      breadcrumb: breadcrumb ? breadcrumb.tagName + '#' + breadcrumb.id + '.' + breadcrumb.className.slice(0,40) + ':\n' + breadcrumb.outerHTML.slice(0,300) : 'NOT FOUND',
      filter: filterWrapper ? filterWrapper.id + '|' + filterWrapper.className.slice(0,50) + ':\n' + filterWrapper.outerHTML.slice(0,300) : 'NOT FOUND',
    };
  });
  console.log('\n=== CATEGORY DATA ===');
  console.log(JSON.stringify(catData, null, 2));

  // Product page
  const prodLinks = await cat.evaluate(() =>
    Array.from(document.querySelectorAll('.product-miniature a[href*=".html"]')).map(a => a.href).slice(0,1)
  );
  if (prodLinks[0]) {
    const prod = await browser.newPage();
    await prod.goto(prodLinks[0], { waitUntil: 'domcontentloaded', timeout: 15000 });
    await prod.waitForTimeout(500);
    const prodData = await prod.evaluate(() => {
      const cover = document.querySelector('[class*="cover"], .product__image, .product-image-container img');
      const addBtn = document.querySelector('[data-button-action="add-to-cart"], button[name="add"]');
      const badge = document.querySelector('[class*="badge"], .header-block__badge');
      return {
        cover: cover ? cover.tagName + '.' + cover.className.slice(0,60) : 'NOT FOUND',
        addBtn: addBtn ? addBtn.tagName + '[' + addBtn.getAttribute('data-button-action') + '].' + addBtn.className.slice(0,40) : 'NOT FOUND - try: ' +
          Array.from(document.querySelectorAll('button')).filter(b => b.textContent?.toLowerCase().includes('cart')).map(b => b.className.slice(0,40)).join(', '),
        badge: badge ? badge.className + ': "' + badge.textContent?.trim() + '"' : 'NOT FOUND',
      };
    });
    console.log('\n=== PRODUCT DATA ===');
    console.log(JSON.stringify(prodData, null, 2));
  }

  await browser.close();
})().catch(e => console.error('Error:', e.message));
