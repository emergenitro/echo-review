import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { HfInference } from '@huggingface/inference'

const inference = new HfInference(process.env.HF_TOKEN);
const app = express();

app.use(cors());
app.use(express.json());
app.use(cors());

app.post('/api/v1/scraper', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res
      .status(400)
      .json({ error: 'URL is required in the request body.' });
  }

  try {
    // Scrape product details from the provided URL
    const scraperAPIURL = `http://api.scraperapi.com/?api_key=${process.env.API_KEY}&url=${url}`;

    const response = await axios.get(scraperAPIURL);
    const html = response.data;

    console.log(html);

    // Parse the HTML using JSDOM
    const $ = cheerio.load(html);

    const productData = {};
    productData.title = $('h1').first().text().trim() || 'N/A';
    // If it's Amazon Prime, choose the next h1 element
    if (productData.title.includes('Amazon Prime')) {
      productData.title = $('h1').eq(1).text().trim() || 'N/A';
    }
    productData.price = $('#priceblock_ourprice, #priceblock_dealprice').text().trim() || 'N/A';
    productData.description = $('#productDescription p').text().trim() || 'N/A';
    productData.image = $('#landingImage').attr('src') || 'N/A';

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
      ? searchResults.slice(0, 40).map((result) => ({
        title: result.title,
        snippet: result.snippet,
        link: result.link,
      }))
      : [];

    const out = await inference.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        {
          role: "system",
          content: `You are a reviewer with multiple snippets of reviews about a certain product. Using the reviews, articulate its pros, cons and other information to give users an unbiased perspective about the product, and especially highlight what other people have said about it from their personal experiences, while considering X as a number from 1 to 5 with one decimal point as a multiple of 0.5 for the rating. BE SPECIFIC. You must only respond with the valid JSON in this exact format:
                {
                  "pros": ["pro1", "pro2", "pro3"],
                  "cons": ["con1", "con2", "con3"],
                  "summary": "Your summary here",
                  "detailed_review": "Your detailed review here",
                  "rating": X
                }
            `
        },
        {
          role: "system",
          content: "Make sure you close the JSON object with a closing curly brace '}' and open it with an opening curly brace '{'. In fact, that should be the first character of your response."
        },
        {
          role: "user",
          content: `These are the snippets of reviews about ${productData.title}. Reviews : ${reviews} `
        },
      ],
      max_tokens: 512,
      temperature: 0.5,
    });

    // Check if the last character is a closing curly brace, and if not, add it
    if (out.choices[0].message.content.slice(-1) !== '}') {
      out.choices[0].message.content += '}';
    }

    res.json({
      success: true,
      data: {
        product: productData,
        reviews: reviews,
        output: JSON.parse(out.choices[0].message.content)
      },
    });
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
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