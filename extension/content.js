// Utility function to check if the current page is a product page
function isProductPage() {
    const url = window.location.href;
  
    // Heuristic 1: Check for common product-related keywords in the URL
    const productKeywords = ["product", "item", "dp", "itm", "sku", "buy"];
    if (productKeywords.some((keyword) => url.toLowerCase().includes(keyword))) {
      return true;
    }
  
    // Heuristic 2: Check for structured data (JSON-LD) that indicates a product
    const jsonLdElements = document.querySelectorAll('script[type="application/ld+json"]');
    for (const element of jsonLdElements) {
      try {
        const jsonData = JSON.parse(element.textContent);
        if (jsonData["@type"] === "Product" || (Array.isArray(jsonData["@type"]) && jsonData["@type"].includes("Product"))) {
          return true;
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }
  
    // Heuristic 3: Check for common DOM elements found on product pages
    const addToCartButton = document.querySelector('[id*="add-to-cart"], [class*="add-to-cart"], [name*="add-to-cart"]');
    const productTitle = document.querySelector('[id*="product-title"], [class*="product-title"], [name*="product-title"]');
    const priceElement = document.querySelector('[id*="price"], [class*="price"], [name*="price"]');
  
    if (addToCartButton || productTitle || priceElement) {
      return true;
    }
  
    // If none of the heuristics match, it's not a product page
    return false;
}

  // Function to inject the UI
function injectUI() {
    console.log("Injecting UI..."); // Debugging log
  
    // Inject Tailwind CSS from the local file
    const tailwindLink = document.createElement("link");
    tailwindLink.href = chrome.runtime.getURL("dist/tailwind.css"); // Load the local Tailwind CSS file
    tailwindLink.rel = "stylesheet";
    document.head.appendChild(tailwindLink);
  
    // Create the blip (small button with logo)
    const blip = document.createElement("div");
    blip.id = "extension-blip";
    blip.className = "fixed top-1/2 right-4 bg-blue-500 text-white rounded-2xl shadow-lg cursor-pointer flex items-center justify-center w-12 h-12 z-50";
    blip.innerHTML = `<img src="${chrome.runtime.getURL("icon.png")}" alt="Logo" class="w-8 h-8">`; // Replace "logo.png" with your actual logo file name
    //blip.style = "position: fixed; top: 50%; right: 10px; background: blue; color: white; width: 50px; height: 50px; border-radius: 50%; z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: pointer;";
    document.body.appendChild(blip);
  
    // Create the sidebar
    const sidebar = document.createElement("div");
    sidebar.id = "extension-sidebar";
    sidebar.className = "fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform translate-x-full transition-transform duration-300";
    sidebar.style.zIndex = "9999";
    sidebar.innerHTML = `
    <div class="flex justify-between w-full text-xl p-4">
        <img id="minimize-btn" src="${chrome.runtime.getURL("doubleRightArrow.png")}" alt="Minimize Button" class="text-gray-500 hover:text-gray-700 focus:outline-none w-8 h-8 cursor-pointer">
        <h2 class="flex items-center text-center text-xl font-bold justify-center mx-auto">Echo Review</h2>
    </div>
    <div class="p-4 h-full w-full overflow-y-auto">
        <div style="width: 100%; margin: 0;" id="loading-spinner" class="flex items-center justify-center h-[80%] w-full">
          <div style="padding: 3rem;" class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
        <div id="api-response" class="hidden">
            <div id="pros-section" class="mb-4">
                <h3 class="text-lg font-semibold mx-auto">Pros</h3>
                <p id="pros-content" class="text-gray-700">No Verified Pros</p>
            </div>
            <div id="cons-section" class="mb-4">
                <h3 class="text-lg font-semibold">Cons</h3>
                <p id="cons-content" class="text-gray-700">No Verified Cons</p>
            </div>
            <div id="summary-section" class="mb-4">
                <h3 class="text-lg font-semibold">Summary</h3>
                <p id="summary-content" class="text-gray-700">Summary Unavailable</p>
            </div>
            <div id="review-section" class="mb-4">
                <h3 class="text-lg font-semibold">Detailed Review</h3>
                <p id="review-content" class="text-gray-700">Detailed Review Unavailable</p>
            </div>
            <div id="rating-section" class="mb-4">
                <h3 class="text-lg font-semibold">Rating</h3>
                <div id="rating-content" class="text-gray-700">Rating Unavailable</div>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(sidebar);
  
    // Add event listener to toggle the sidebar
    blip.addEventListener("click", () => {
      const isOpen = sidebar.style.transform === "translateX(0px)";
      sidebar.style.transform = isOpen ? "translateX(100%)" : "translateX(0px)";
    });

    // Add event listener to minimize the sidebar
    const minimizeBtn = document.getElementById("minimize-btn");
    minimizeBtn.addEventListener("click", () => {
        sidebar.style.transform = "translateX(100%)"; // Close the sidebar
    });

    console.log("injectUI() is running on:", window.location.href);
}


  
  // Function to make the API request
function fetchProductData(url) {
    const apiUrl = "https://echobackend.hackathonx.net/api/v1/scraper"; // Replace with your API endpoint
  
    // Send the API request
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ url: url }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("API response:", data);
        //console.log(data.data);
        // Hide the loading spinner
        const loadingSpinner = document.getElementById("loading-spinner");
        loadingSpinner.classList.add("hidden");

        // Display the API response
        const apiResponse = document.getElementById("api-response");
        apiResponse.classList.remove("hidden");
        //apiResponse.classList.add("mt-4 text-sm text-gray-700 break-words");
        //apiResponse.textContent = JSON.stringify(data, null, 2); // Display the response as formatted JSON
        if (data.data.output.pros) {
            const prosContent = document.getElementById("pros-content");
            prosContent.innerHTML = ""; // Clear previous content
        
            // Create an unordered list element
            const ul = document.createElement("ul"); 
            ul.style = "list-style-type: disc; padding-left: 20px;"; // Style the list
            // Loop through the pros array and create a list item for each pro
            data.data.output.pros.forEach(pro => {
                const li = document.createElement("li"); // Create a list item
                li.textContent = pro; // Set the text content to the pro statement
                ul.appendChild(li); // Add the list item to the unordered list
            });
        
            // Append the unordered list to the pros-content div
            prosContent.appendChild(ul); // Add the list to the pros content div
        }
      
        if (data.data.output.cons) {
            const consContent = document.getElementById("cons-content");
            consContent.innerHTML = ""; // Clear previous content
        
            // Create an unordered list element
            const ul = document.createElement("ul"); 
            ul.style = "list-style-type: disc; padding-left: 20px;"; // Style the list
            // Loop through the pros array and create a list item for each pro
            data.data.output.cons.forEach(con => {
                const li = document.createElement("li"); // Create a list item
                li.textContent = con; // Set the text content to the pro statement
                ul.appendChild(li); // Add the list item to the unordered list
            });
        
            // Append the unordered list to the pros-content div
            consContent.appendChild(ul); // Add the list to the pros content div
        }
      
        if (data.data.output.summary) {
            const summaryContent = document.getElementById("summary-content");
            summaryContent.textContent = data.data.output.summary; // Assuming `summary` is a string
        }
    
        if (data.data.output.detailed_review) {
            const reviewContent = document.getElementById("review-content");
            reviewContent.textContent = data.data.output.detailed_review;; // Assuming `overall review` is a string
        }
    
        if (data.data.output.rating) {
            const ratingContent = document.getElementById("rating-content");
            const rating = parseFloat(data.rating); // Ensure the rating is a number
            ratingContent.innerHTML = generateStarRating(rating); // Generate stars 
       }
    })
    .catch((error) => {
        console.error("Error fetching product data:", error);
    });
}
  
function main() {
    if (isProductPage()) {
        console.log("This is a product page:", window.location.href);
    
        // Inject the UI
        injectUI();

        // Make the API request
        fetchProductData(window.location.href);
    }
}

/**
 * Generate star rating HTML based on the rating value.
 * @param {number} rating - The rating value (e.g., 4.5).
 * @returns {string} - HTML string with star icons.
 */
function generateStarRating(rating) {
    const fullStar = `<span class="text-yellow-500">&#9733;</span>`; // Unicode for ★
    const halfStar = `<span class="text-yellow-500">&#9734;</span>`; // Unicode for ☆ (half-star placeholder)
    const emptyStar = `<span class="text-gray-300">&#9733;</span>`; // Unicode for ★ (gray
}
// Run the main logic immediately
main();

// Also run it after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", main);