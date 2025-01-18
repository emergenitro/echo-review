const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

function unicodeToChar(text) {
  return text.replace(/\\u[\dA-F]{4}/gi, (match) =>
    String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
  );
}

app.post('/api/v1/scraper', async (req, res) => {
  const { url } = req.body;
  console.log(req.body)
  if (!url) {
    return res.status(400).json({ error: 'URL is required in the request body.' });
  }

  try {
    const encodedURL = encodeURIComponent(url);
    const scraperAPIURL = `http://api.scraperapi.com/?api_key=${process.env.API_KEY}&url=${encodedURL}&render=true`

    const response = await axios.get(scraperAPIURL);
    const html = response.data;

    // Parse the HTML using JSDOM
    const dom = new JSDOM(html);
    const document = dom.window.document;


    const productData = {};
    const titleElement = document.querySelectorAll('h1')[0];
    productData.title = titleElement ? titleElement.textContent.trim() : 'N/A';
    const priceElement = document.querySelector('#priceblock_ourprice') || document.querySelector('#priceblock_dealprice');
    productData.price = priceElement ? priceElement.textContent.trim() : 'N/A';
    const descriptionElement = document.querySelector('#productDescription p');
    productData.description = descriptionElement ? descriptionElement.textContent.trim() : 'N/A';
    const imageElement = document.querySelector('#landingImage');
    productData.image = imageElement ? imageElement.src : 'N/A';
    res.json({ success: true, data: productData });
  } catch (error) {
    console.error('Error fetching or parsing the page:', error.message);
    res.status(500).json({ success: false, error: 'An error occurred while scraping the page.' });
  }
});


app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});