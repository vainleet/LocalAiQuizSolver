let panel = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

function createPanel() {
  if (panel) panel.remove();

  panel = document.createElement("div");
  panel.id = "ollama-panel";
  panel.innerHTML = `
    <div class="op-header">
      <div class="op-header-left">
        <div class="op-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <span class="op-title">Ollama</span>
      </div>
      <div class="op-header-right">
        <button class="op-btn-icon op-settings-btn" title="Настройки">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
        <button class="op-btn-icon op-close-btn" title="Закрыть">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="op-settings-panel" id="op-settings" style="display:none;">
      <div class="op-field">
        <label>Хост Ollama</label>
        <input type="text" id="op-host" placeholder="http://localhost:11434" />
      </div>
      <div class="op-field">
        <label>Модель</label>
        <input type="text" id="op-model" placeholder="gemma3:4b" />
      </div>
      <button class="op-save-btn" id="op-save-settings">Сохранить</button>
    </div>

    <div class="op-body" id="op-body">
      <div class="op-selection-block">
        <div class="op-selection-label">Выделенный текст</div>
        <div class="op-selection-text" id="op-selected-text"></div>
      </div>

      <div class="op-question-block">
        <textarea class="op-textarea" id="op-question" placeholder="Задайте вопрос или оставьте пустым для объяснения..."></textarea>
        <button class="op-ask-btn" id="op-ask-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Спросить
        </button>
      </div>

      <div class="op-response-block" id="op-response-block" style="display:none;">
        <div class="op-response-label">Ответ</div>
        <div class="op-response-text" id="op-response-text"></div>
        <button class="op-copy-btn" id="op-copy-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Копировать
        </button>
      </div>
    </div>

    <div class="op-loading" id="op-loading" style="display:none;">
      <div class="op-spinner"></div>
      <span>Генерирую ответ...</span>
    </div>
  `;

  document.body.appendChild(panel);
  setupPanelEvents();
  loadSettings();
  positionPanel();
}

function positionPanel() {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    const panelW = 380;
    const margin = 12;

    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + margin;

    if (left + panelW > window.innerWidth - margin) {
      left = window.innerWidth - panelW - margin;
    }
    if (left < margin) left = margin;

    panel.style.left = left + "px";
    panel.style.top = top + "px";
  } else {
    panel.style.right = "24px";
    panel.style.top = "80px";
  }
}

function setupPanelEvents() {
  panel.querySelector(".op-close-btn").addEventListener("click", () => {
    panel.classList.add("op-hide");
    setTimeout(() => panel?.remove(), 200);
    panel = null;
  });

  panel.querySelector(".op-settings-btn").addEventListener("click", () => {
    const s = panel.querySelector("#op-settings");
    s.style.display = s.style.display === "none" ? "block" : "none";
  });

  panel.querySelector("#op-save-settings").addEventListener("click", () => {
    const host = panel.querySelector("#op-host").value.trim();
    const model = panel.querySelector("#op-model").value.trim();
    chrome.storage.sync.set({ ollamaHost: host, ollamaModel: model });
    const btn = panel.querySelector("#op-save-settings");
    btn.textContent = "Сохранено ✓";
    setTimeout(() => btn.textContent = "Сохранить", 1500);
    panel.querySelector("#op-settings").style.display = "none";
  });

  panel.querySelector("#op-ask-btn").addEventListener("click", askOllama);

  panel.querySelector("#op-question").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) askOllama();
  });

  panel.querySelector("#op-copy-btn").addEventListener("click", () => {
    const text = panel.querySelector("#op-response-text").textContent;
    navigator.clipboard.writeText(text);
    const btn = panel.querySelector("#op-copy-btn");
    btn.textContent = "Скопировано ✓";
    setTimeout(() => {
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Копировать`;
    }, 1500);
  });

  const header = panel.querySelector(".op-header");
  header.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return;
    isDragging = true;
    const rect = panel.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    panel.style.transition = "none";
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  });
}

function onDrag(e) {
  if (!isDragging || !panel) return;
  panel.style.left = (e.clientX - dragOffset.x + window.scrollX) + "px";
  panel.style.top = (e.clientY - dragOffset.y + window.scrollY) + "px";
  panel.style.right = "auto";
}

function stopDrag() {
  isDragging = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
}

function loadSettings() {
  chrome.storage.sync.get(["ollamaHost", "ollamaModel"], (data) => {
    if (data.ollamaHost) panel.querySelector("#op-host").value = data.ollamaHost;
    if (data.ollamaModel) panel.querySelector("#op-model").value = data.ollamaModel;
  });
}

function askOllama() {
  const selectedText = panel.querySelector("#op-selected-text").textContent;
  const question = panel.querySelector("#op-question").value.trim();

  const prompt = question
    ? `Текст: "${selectedText}"\n\nВопрос: ${question}\n\nОтветь на русском языке.`
    : `Объясни следующий текст кратко и понятно на русском языке:\n\n"${selectedText}"`;

  chrome.storage.sync.get(["ollamaHost", "ollamaModel"], (data) => {
    showLoading(true);
    panel.querySelector("#op-response-block").style.display = "none";

    chrome.runtime.sendMessage(
      {
        action: "queryOllama",
        prompt,
        model: data.ollamaModel || "gemma3:4b",
        host: data.ollamaHost || "http://localhost:11434"
      },
      (response) => {
        showLoading(false);
        if (response?.success) {
          const block = panel.querySelector("#op-response-block");
          block.style.display = "block";
          panel.querySelector("#op-response-text").textContent = response.response;
        } else {
          const block = panel.querySelector("#op-response-block");
          block.style.display = "block";
          panel.querySelector("#op-response-text").innerHTML =
            `<span class="op-error">Ошибка: ${response?.error || "Нет ответа от Ollama"}</span>`;
        }
      }
    );
  });
}

function showLoading(show) {
  panel.querySelector("#op-loading").style.display = show ? "flex" : "none";
  panel.querySelector("#op-body").style.display = show ? "none" : "block";
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "showPanel") {
    createPanel();
    const el = panel.querySelector("#op-selected-text");
    el.textContent = message.selectedText;
    panel.classList.add("op-show");
  }
});
