document.addEventListener("DOMContentLoaded", async () => {
    const loadingDiv = document.getElementById("loading");
    const contentDiv = document.getElementById("content");
    const productData = document.getElementById("product-data");
  
    // Show loading spinner
    loadingDiv.classList.remove("hidden");
  
    // Get the product URL from storage
    chrome.storage.local.get("productUrl", async ({ productUrl }) => {
      if (productUrl) {
        try {
          // Log the API request details to the console
          console.log("Sending API request for URL:", productUrl);
  
          // Send the URL to the external API
          const response = await fetch("https://api.example.com/product-info", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: productUrl })
          });
  
          // Log the response status
          console.log("API response status:", response.status);
  
          if (!response.ok) {
            throw new Error("Failed to fetch product data");
          }
  
          const data = await response.json();
  
          // Log the API response data
          console.log("API response data:", data);
  
          // Hide loading spinner and show content
          loadingDiv.classList.add("hidden");
          contentDiv.classList.remove("hidden");
  
          // Display the product data
          productData.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
          // Log the error to the console
          console.error("Error during API request:", error);
  
          // Hide loading spinner and show error message
          loadingDiv.classList.add("hidden");
          contentDiv.classList.remove("hidden");
          productData.textContent = `Error: ${error.message}`;
        }
      } else {
        console.log("No product URL found in storage.");
      }
    });
  });