const textarea = document.getElementById("notes");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

// Load notes initially
function loadNotes() {
  chrome.storage.local.get(["notes"], (res) => {
    textarea.value = res.notes || "";
  });
}
loadNotes();

// Save notes whenever user types
textarea.addEventListener("input", () => {
  const text = textarea.value;
  chrome.storage.local.set({ notes: text });
});

// Download notes
downloadBtn.addEventListener("click", () => {
  const text = textarea.value || "";
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my_notes.txt";
  a.click();
  URL.revokeObjectURL(url);
});

// Clear notes
clearBtn.addEventListener("click", () => {
  chrome.storage.local.set({ notes: "" }, () => {
    textarea.value = "";
  });
});

// Auto-update if storage changes elsewhere
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.notes) {
    textarea.value = changes.notes.newValue || "";
  }
});
