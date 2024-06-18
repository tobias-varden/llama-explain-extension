
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
      "id": "llm-Lookup",
      "title": "LLM Lookup",
      "contexts": ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "llm-Lookup") {
    createPopup(info.selectionText)
  }
});

function createPopup(selectedText) {
  console.log("Creating popup for..." + selectedText);
  const encodedText = encodeURIComponent(selectedText);
  const popupUrl = `explanation.html?text=${encodedText}`;

  chrome.windows.create({
    url: popupUrl,
    type: "popup",
    width: 500,
    height: 400
  });
}