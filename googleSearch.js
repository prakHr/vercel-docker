const express = require('express');
const { chromium } = require('playwright-core');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON in request bodies
app.use(express.json());

async function getDescriptionFromUrl(url) {
  let description = null;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    
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
    await page.goto("https://www.google.com", { waitUntil: "domcontentloaded", timeout: 10000 });

    if (await page.locator("button:has-text('I agree')").count() > 0) {
      await page.locator("button:has-text('I agree')").click();
    }

    const searchInput = await page.locator("textarea[name='q']");
    await searchInput.fill(query);
    await searchInput.press("Enter");

    await page.waitForSelector("a:has(h3)", { timeout: 10000 });
    
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
    await page.goto("https://www.google.com", { waitUntil: "domcontentloaded", timeout: 10000 });

    if (await page.locator("button:has-text('I agree')").count() > 0) {
      await page.locator("button:has-text('I agree')").click();
    }

    const searchInput = await page.locator("textarea[name='q']");
    await searchInput.fill(query);
    await searchInput.press("Enter");

    await page.waitForSelector("a:has(h3)", { timeout: 10000 });

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

// POST route to handle incoming requests
app.post("/api/search", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const result = await extractSingleUrl(query);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during the search' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
