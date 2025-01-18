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
    blip.className = "fixed top-1/2 right-4 bg-blue-500 text-white rounded-full shadow-lg cursor-pointer flex items-center justify-center w-12 h-12 z-50";
    blip.innerHTML = `<img src="${chrome.runtime.getURL("icon.png")}" alt="Logo" class="w-8 h-8">`; // Replace "logo.png" with your actual logo file name
    //blip.style = "position: fixed; top: 50%; right: 10px; background: blue; color: white; width: 50px; height: 50px; border-radius: 50%; z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: pointer;";
    document.body.appendChild(blip);
  
    // Create the sidebar
    const sidebar = document.createElement("div");
    sidebar.id = "extension-sidebar";
    sidebar.className = "fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform translate-x-full transition-transform duration-300 z-50";
    sidebar.innerHTML = `
      <div class="p-4 h-full w-full overflow-y-auto">
        <div style="width: 100%; margin: 0;" id="loading-spinner" class="flex items-center justify-center h-full w-full">
          <div style="padding: 3rem;" class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
        <div id="api-response" class="hidden"></div>
      </div>
    `;
    document.body.appendChild(sidebar);
  
    // Add event listener to toggle the sidebar
    blip.addEventListener("click", () => {
      const isOpen = sidebar.style.transform === "translateX(0px)";
      sidebar.style.transform = isOpen ? "translateX(100%)" : "translateX(0px)";
    });

    console.log("injectUI() is running on:", window.location.href);
}
  
  // Function to make the API request
function fetchProductData(url) {
    const apiUrl = "https://your-api-endpoint.com"; // Replace with your API endpoint
  
    // Send the API request
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productUrl: url }),
    })
    .then((response) => response.json())
    .then((data) => {
        // Hide the loading spinner
        const loadingSpinner = document.getElementById("loading-spinner");
        loadingSpinner.classList.add("hidden");

        // Display the API response
        const apiResponse = document.getElementById("api-response");
        apiResponse.classList.remove("hidden");
        apiResponse.textContent = JSON.stringify(data, null, 2); // Display the response as formatted JSON
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
        //fetchProductData(window.location.href);
    }
}

// Run the main logic immediately
main();

// Also run it after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", main);