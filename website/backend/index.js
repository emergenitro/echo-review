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
  console.log(req.body);
  if (!url) {
    return res
      .status(400)
      .json({ error: 'URL is required in the request body.' });
  }

  try {
    // Scrape product details from the provided URL
    const encodedURL = encodeURIComponent(url);
    const scraperAPIURL = `http://api.scraperapi.com/?api_key=${process.env.API_KEY}&url=${encodedURL}&render=true`;

    const response = await axios.get(scraperAPIURL);
    const html = response.data;

    // Parse the HTML using JSDOM
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const productData = {};
    const titleElement = document.querySelectorAll('h1')[0];
    productData.title = titleElement ? titleElement.textContent.trim() : 'N/A';
    const priceElement =
      document.querySelector('#priceblock_ourprice') ||
      document.querySelector('#priceblock_dealprice');
    productData.price = priceElement
      ? priceElement.textContent.trim()
      : 'N/A';
    const descriptionElement = document.querySelector(
      '#productDescription p'
    );
    productData.description = descriptionElement
      ? descriptionElement.textContent.trim()
      : 'N/A';
    const imageElement = document.querySelector('#landingImage');
    productData.image = imageElement ? imageElement.src : 'N/A';

    // If no title is found, return just the product data
    if (!productData.title || productData.title === 'N/A') {
      return res.json({ success: true, data: { product: productData } });
    }

    // Use Google Custom Search API to find reviews for the product's title
    const googleSearchAPIKey = process.env.GOOGLE_API_KEY;
    const googleSearchEngineID = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!googleSearchAPIKey || !googleSearchEngineID) {
      return res.status(500).json({
        success: false,
        error: 'Google API key or Search Engine ID is not configured.',
      });
    }

    const searchQuery = `${productData.title} reviews reddit`;
    const googleSearchURL = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      searchQuery
    )}&key=${googleSearchAPIKey}&cx=${googleSearchEngineID}`;

    const googleResponse = await axios.get(googleSearchURL);
    const searchResults = googleResponse.data.items;

    // Extract relevant data from Google Search API results (only returning top 5 results for simplicity)
    const reviews = searchResults
      ? searchResults.slice(0, 5).map((result) => ({
        title: result.title,
        snippet: result.snippet,
        link: result.link,
      }))
      : [];

    // Combine product data with reviews
    res.json({
      success: true,
      data: {
        product: productData,
        reviews: reviews,
      },
    });
  } catch (error) {
    console.error('Error fetching or parsing data:', error.message);
    res
      .status(500)
      .json({
        success: false,
        error: 'An error occurred while fetching product or review data.',
      });
  }
});

app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});