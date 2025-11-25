chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveSelection",
    title: "Save selected text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveSelection") {
    chrome.storage.local.get(["notes"], (res) => {
      const existing = res.notes || "";

      const updated = existing
        ? existing + "\n" + info.selectionText
        : info.selectionText;

      if (updated.length > 500000) {
      console.warn("Notes too large, not saving.");
      return;
    }

      chrome.storage.local.set({ notes: updated });
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "save_selected_text") {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      chrome.tabs.sendMessage(
        tab.id,
        { action: "GET_SELECTION" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn("No content script:", chrome.runtime.lastError);
            return;
          }

          if (!response || !response.text) return;

          chrome.storage.local.get(["notes"], (data) => {
            const existing = data.notes || "";
            const updated = existing
              ? `${existing}\n${response.text}`
              : response.text;

            chrome.storage.local.set({ notes: updated });
          });
        }
      );
    });

  }
});

