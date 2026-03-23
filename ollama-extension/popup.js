document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["ollamaHost", "ollamaModel"], (data) => {
    if (data.ollamaHost) document.getElementById("host").value = data.ollamaHost;
    if (data.ollamaModel) document.getElementById("model").value = data.ollamaModel;
  });

  document.getElementById("save").addEventListener("click", () => {
    const host = document.getElementById("host").value.trim();
    const model = document.getElementById("model").value.trim();
    chrome.storage.sync.set({ ollamaHost: host, ollamaModel: model }, () => {
      const status = document.getElementById("status");
      status.classList.add("success");
      setTimeout(() => status.classList.remove("success"), 2000);
    });
  });
});
