# Discord Translator Extension

A Chrome Manifest V3 extension for translating Discord Web messages and composer input.

## Included MVP capabilities

- Manual message translation with `🌐 / ⏳ / ✅ / ❌` status button
- Auto translation mode for newly observed Discord messages
- Composer translation triggered through the extension command
- Multiple translation engines: Google, LibreTranslate, OpenAI, Claude, Gemini, DeepSeek
- Popup settings for source language, target language, engine, model, API key, and display preferences
- Local settings storage with `chrome.storage.sync`
- In-memory translation cache and request queue

## Project structure

```text
discord-translator-extension/
├── api/
├── background/
├── content/
├── popup/
├── public/
├── storage/
└── utils/
```

## Local development

```bash
npm install
npm run build
```

Then load the generated `dist/` folder in Chrome via `chrome://extensions` -> `Load unpacked`.

## Notes

- The popup "Writing Shortcut Label" is a display/config field for now. Chrome command shortcuts still need to be changed from `chrome://extensions/shortcuts`.
- Discord DOM structures can change over time, so the selectors in `content/observer.ts` may need periodic maintenance.
- API keys stay local inside browser storage. No relay server is included in this MVP.
