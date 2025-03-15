import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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

    const searchQuery = `${productData.title} reviews`;
    const alternativesQuery = `${productData.title} shopping alternatives`;
    const googleSearchURL = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      searchQuery
    )}&key=${googleSearchAPIKey}&cx=${googleSearchEngineID}`;
    const googleAlternativesURL = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      alternativesQuery
    )}&key=${googleSearchAPIKey}&cx=${googleSearchEngineID}`;

    const [googleResponse, alternativesResponse] = await Promise.all([
      axios.get(googleSearchURL),
      axios.get(googleAlternativesURL),
    ]);

    const searchResults = googleResponse.data.items;
    const alternativeResults = alternativesResponse.data.items || [];

    const reviews = searchResults
      ? searchResults.slice(0, 40).map((result) => ({
        title: result.title,
        snippet: result.snippet,
        link: result.link,
      }))
      : [];

    // Extract alternative products
    const alternatives = alternativeResults.slice(0, 2).map((result) => ({
      title: result.title,
      link: result.link,
    }));


    try {
      const out = await axios.post('https://ai.hackclub.com/chat/completions', {
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
            content: `These are the snippets of reviews about ${productData.title}. Reviews: ${reviews
              .map((review) => review.snippet)
              .join(' ')}`
          }
        ]
      });

      // Log the response structure to debug
      console.log("API Response structure:", JSON.stringify(out.data));

      // Safely extract the content based on the response structure
      let chatResponse;
      if (out.data && out.data.choices && out.data.choices.length > 0 && out.data.choices[0].message) {
        chatResponse = out.data.choices[0].message.content;
      } else {
        // If the structure doesn't match what we expect, try alternative paths
        chatResponse = out.data.content || out.data.response || out.data;
        console.log("Using alternative response structure");
      }

      // Make sure we have a string before trying to add a closing brace
      if (typeof chatResponse === 'string') {
        // Check if the last character is a closing curly brace, and if not, add it
        if (chatResponse.trim().slice(-1) !== '}') {
          chatResponse = chatResponse.trim() + '}';
        }

        // Try to parse the JSON
        try {
          const parsedResponse = JSON.parse(chatResponse);
          res.json({
            success: true,
            data: {
              alternatives: alternatives,
              output: parsedResponse,
            },
          });
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError, 'Raw response:', chatResponse);
          res.status(500).json({
            success: false,
            error: 'Could not parse the AI response as JSON.',
            rawResponse: chatResponse
          });
        }
      } else {
        // Handle case where we don't have a string response
        console.error('Unexpected response format:', chatResponse);
        res.status(500).json({
          success: false,
          error: 'Received unexpected response format from AI service.',
          rawResponse: chatResponse
        });
      }
    } catch (error) {
      console.error('Error calling AI service:', error.response?.data || error.message);
      res.status(500).json({
        success: false,
        error: 'An error occurred while calling the AI service.',
      });
    }

    res.json({
      success: true,
      data: {
        alternatives: alternatives,
        output: JSON.parse(chatResponse),
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