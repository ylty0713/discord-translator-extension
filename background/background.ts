import { getSettings } from "../storage/settings";
import { translateText } from "../content/translator";

chrome.runtime.onInstalled.addListener(() => {
  void getSettings();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "TRANSLATE_TEXT") {
    void (async () => {
      try {
        const settings = await getSettings();
        const translatedText = await translateText(message.payload.text, settings);
        sendResponse({ ok: true, translatedText });
      } catch (error) {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : "Unknown translation error"
        });
      }
    })();

    return true;
  }

  if (message?.type === "GET_SETTINGS") {
    void getSettings().then((settings) => {
      sendResponse({ ok: true, settings });
    });
    return true;
  }

  return false;
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "translate-composer") {
    return;
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab.id) {
    return;
  }

  await chrome.tabs.sendMessage(tab.id, {
    type: "TRIGGER_COMPOSER_TRANSLATION"
  });
});
