chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "askOllama",
    title: "Спросить Ollama: \"%s\"",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "askOllama" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {
      action: "showPanel",
      selectedText: info.selectionText
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "queryOllama") {
    queryOllama(message.prompt, message.model, message.host, sendResponse);
    return true;
  }
});

async function queryOllama(prompt, model, host, sendResponse) {
  const ollamaHost = (host || "http://localhost:11434").replace(/\/$/, "");
  const ollamaModel = model || "gemma3:4b";

  try {
    const response = await fetch(`${ollamaHost}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost"
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}: ${response.statusText}${text ? " — " + text : ""}`);
    }

    const data = await response.json();
    sendResponse({ success: true, response: data.response });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
