const retailerPatterns = {
    "amazon.com": /\/dp\/|\/gp\/product\//, // Matches Amazon product pages
    "shopee.com": /\/product\/\d+\/\d+/,   // Matches Shopee product pages
    "lazada.com": /\/products\/.+/,        // Matches Lazada product pages
    "ebay.com": /\/itm\//,                 // Matches eBay product pages
    "walmart.com": /\/ip\//,               // Matches Walmart product pages
    "aliexpress.com": /\/item\/.+/,        // Matches AliExpress product pages
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        // Check if the URL is a product page
        if (isProductPage(tab.url)) {
            chrome.action.setPopup({ tabId, popup: "popup/popup.html" });
            chrome.storage.local.set({ productUrl: tab.url });
        } else {
            chrome.action.setPopup({ tabId, popup: "" });
        }
    }
});

function isProductPage(url) {
    try {
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname.replace("www.", "");
  
      if (retailerPatterns[domain]) {
        if (retailerPatterns[domain].test(parsedUrl.pathname)) {
          console.log(`Matched product page for retailer: ${domain}`);
          return true;
        }
      }
    } catch (error) {
      console.error("Invalid URL:", url);
    }
  
    return false;
  }