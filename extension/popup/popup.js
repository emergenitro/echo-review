document.addEventListener("DOMContentLoaded", async () => {
    const loading = document.getElementById("loading");
    const content = document.getElementById("content");
    const productName = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productDescription = document.getElementById("product-description");
  
    // Show loading spinner
    loading.classList.remove("hidden");
  
    // Get the active tab's URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;
  
    // Check if the URL is a product page (simple example)
    if (url.includes("product")) {
      // Simulate API call
      setTimeout(() => {
        const productInfo = {
          name: "Sample Product",
          price: "$99.99",
          description: "This is a sample product description."
        };
  
        // Hide loading spinner and show content
        loading.classList.add("hidden");
        content.classList.remove("hidden");
  
        // Update the UI with product info
        productName.textContent = productInfo.name;
        productPrice.textContent = productInfo.price;
        productDescription.textContent = productInfo.description;
      }, 2000);
    } else {
      loading.textContent = "Not a product page.";
    }
  });