const description = process.env.description || "No description provided";
console.log(description);

const { chromium } = require('playwright');

async function getDescriptionFromUrl(url) {
  let description = null;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 2000 });
      
      // Try to get meta description
      const descriptionElement = await page.locator("meta[name='description']");
      if (await descriptionElement.count() > 0) {
          description = await descriptionElement.getAttribute("content");
      } else {
          const paragraphElement = await page.locator("p");
          if (await paragraphElement.count() > 0) {
              description = await paragraphElement.first().textContent();
          }
      }
  } catch (error) {
      console.log(`An error occurred: ${error}`);
  } finally {
      await browser.close();
  }
  return description;
}

async function extractAllUrls(currUrl, query) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const urls = [];
  
  try {
      await page.goto("https://www.google.com", { waitUntil: "domcontentloaded", timeout: 2000 });

      if (await page.locator("button:has-text('I agree')").count() > 0) {
          await page.locator("button:has-text('I agree')").click();
      }

      const searchInput = await page.locator("textarea[name='q']");
      await searchInput.fill(query);
      await searchInput.press("Enter");

      await page.waitForSelector("a:has(h3)", { timeout: 2000 });
      
      const elements = await page.locator("a:has(h3)").all();
      for (const element of elements) {
          const url = await element.getAttribute("href");
          if (url && url !== currUrl) {
              urls.push(url);
          }
      }
  } catch (error) {
      console.log(`An error occurred: ${error}`);
  } finally {
      await browser.close();
  }
  return urls;
}

async function extractSingleUrl(query) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const urls = [];

  try {
      await page.goto("https://www.google.com", { waitUntil: "domcontentloaded", timeout: 2000 });

      if (await page.locator("button:has-text('I agree')").count() > 0) {
          await page.locator("button:has-text('I agree')").click();
      }

      const searchInput = await page.locator("textarea[name='q']");
      await searchInput.fill(query);
      await searchInput.press("Enter");

      await page.waitForSelector("a:has(h3)", { timeout: 2000 });

      const firstResult = await page.locator("a:has(h3)").first();
      const firstUrl = await firstResult.getAttribute("href");
      if (firstUrl) {
          urls.push(firstUrl);
      }
  } catch (error) {
      urls.push(`An error occurred: ${error}`);
  } finally {
      await browser.close();
  }

  return {
      firstLevelSearch: urls,
      secondLevelSearch: await extractAllUrls(urls[0], query)
  };
}



// const username = req.body.data;
// console.log(`username: ${username}`);
extractSingleUrl(description)
  .then(result => {
    console.log(result);  // Logs the result on the server
    // res.json(result);     // Sends the result back to the client
  })
  .catch(error => {
    console.error(error);
    // res.status(500).json({ error: 'An error occurred during the search' });
  });
