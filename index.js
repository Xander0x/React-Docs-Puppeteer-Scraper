require('dotenv').config();
const puppeteer = require('puppeteer-core');
const fs = require('fs').promises;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true
  });

  const page = await browser.newPage();
  await page.goto('https://react.dev/reference/react');

 // Find all <li> elements that contain a div, indicating they are parent items.
  const directory = await page.evaluate(() => {
    const items = document.querySelectorAll('li:has(div)');
    const directory = [];

// For each item, extract the title and its subcategories.
    items.forEach(item => {
      const titleElement = item.querySelector('a[title]');
      const subcategoryElements = item.querySelectorAll('div ul a[title]');
      if (titleElement && subcategoryElements.length > 0) {
        const title = titleElement.title;
        const subcategories = Array.from(subcategoryElements).map(a => {
          return { title: a.title, href: a.href };
        });
        directory.push({ title, subcategories });
      }
    });

    return directory;
  });
  
  // Iterate over each category and its subcategories.
  for (const category of directory) {
    for (const subcategory of category.subcategories) {
      await page.goto(subcategory.href);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before scraping.
      
      const content = await page.evaluate(() => {
        let articles = document.querySelectorAll('article');
        let result = [];
    
        articles.forEach(article => {
          let headers = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
          headers.forEach(header => {
            let sibling = header.nextElementSibling;
            let children = [];

            while (sibling && !sibling.matches('h1, h2, h3, h4, h5, h6')) {
              let text = sibling.textContent.trim();
              // Wrap in backticks if there's a <code> element.
              if (sibling.querySelector('code')) {
                text = '```' + text + '```';
              }
              children.push(text);
              sibling = sibling.nextElementSibling;
            }
        
            result.push({
              tag: header.tagName,
              text: header.textContent.trim(),
              content: children,
            });
          });
        });

        return result;
      });
      
      // Update the subcategory object with data.
      subcategory.data = content;
    }
  }

  await fs.writeFile('output.json', JSON.stringify(directory, null, 2));
  await browser.close();
})();
