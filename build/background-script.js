// background-script.ts
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id || -1 },
    files: ["build/content-script.js"],
  });
});
