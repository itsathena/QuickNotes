chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "GET_SELECTION") {
    const selected = window.getSelection().toString();
    sendResponse({ text: selected });
  }
});
