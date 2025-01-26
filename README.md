# EchoReview - The voice of everyone
Ever wanted to buy a product, but didn't know how it performed? So you went on the internet scouring for reviews and feedback about products spending so much time in the process. EchoReview is a platform that scrapes and consolidates reviews for any product of your choice from various websites and presents them in a website and Chrome extension with convenience and simplicity.

A combined Chrome extension and website that consolidates reviews for a given product from multiple online sources, then uses a large language model (LLM) to generate a summarized analysis of pros, cons, and overall rating.

## Features
- Chrome extension detects product pages and displays a summary side panel.
- Website interface scrapes product details, searches for reviews, and integrates them into an LLM for analysis.
- Server uses Node.js and Express with Cheerios for web scraping and a Hugging Face endpoint for text generation.
- Tailwind CSS used for styling both the extension and website.

## Installation
1. **Extension**  
   - Navigate to the `extension` folder and run `npm install`.
   - Build Tailwind if needed (`npx tailwindcss -i tailwind.css -o dist/tailwind.css`).
   - Load the `extension` folder as an unpacked extension in Chrome’s Extensions page.

2. **Website**  
   - Navigate to the `website` folder and run `npm install` in both `backend` and `frontend`.
   - In `backend`, run `npm run dev` to start the API.
   - In `frontend`, run `npm run dev` to launch the website locally.

## Usage
- Open the website to manually input a product URL for a quick summary.
- Install the extension to see an automatic summary on supported e-commerce sites.
- The backend fetches reviews and uses the LLM to generate consolidated feedback.

## License
Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.