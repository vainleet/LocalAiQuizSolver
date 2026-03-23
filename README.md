# LocalAiQuizSolver

Browser extension that solves quizzes and answers questions using your local Ollama AI - no API keys, no cloud, no data leaks.

## Requirements

- [Ollama](https://ollama.ai) installed and running
- Chrome or Edge browser

## Installation

**1. Set up Ollama**

Download and install Ollama from [ollama.ai](https://ollama.ai), then pull a model:
```bash
ollama pull gemma3:4b
```

Allow browser extensions to connect to Ollama by setting the `OLLAMA_ORIGINS` environment variable.

**Windows - set permanently via PowerShell:**
```powershell
[System.Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "Machine")
```
Then restart Ollama from the system tray.

**Linux / macOS:**
```bash
OLLAMA_ORIGINS="*" ollama serve
```

**2. Install the extension**

1. Download the latest release and unzip it
2. Open `chrome://extensions/` in your browser
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the unzipped folder

**3. Configure**

Click the extension icon in the toolbar and set your Ollama host and model if needed. Defaults are `http://localhost:11434` and `gemma3:4b`.

## Usage

1. Select any text on a webpage - a question, a quiz answer option, a paragraph
2. Right-click → **Ask Ollama**
3. A panel appears on the page with the AI response
4. Optionally type your own question about the selected text
5. Press **Ctrl+Enter** or click **Ask** to send

## Troubleshooting

**HTTP 403 Forbidden** - `OLLAMA_ORIGINS` is not set. Follow the setup step above and restart Ollama.

**Port already in use** - another Ollama process is running in the background. Kill it first:
```powershell
Get-Process | Where-Object {$_.Name -like "*ollama*"} | Stop-Process -Force
$env:OLLAMA_ORIGINS="*"; ollama serve
```

**Model not found** - make sure you've pulled the model: `ollama pull gemma3:4b`
