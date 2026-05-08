import type { ExtensionSettings } from "../storage/settings";
import { getMessageText, isElementVisible } from "../utils/dom";
import {
  createTranslateButton,
  renderTranslationResult,
  setButtonStatus
} from "./ui";

interface ObserverOptions {
  settings: ExtensionSettings;
  onTranslate: (text: string) => Promise<string>;
}

const processedMessages = new WeakSet<HTMLElement>();

function getMessageNodes(root: ParentNode): HTMLElement[] {
  const selectors = [
    'li[id^="chat-messages-"]',
    '[id^="chat-messages-"]',
    '[data-list-item-id^="chat-messages"]',
    'li[role="listitem"]'
  ].join(",");

  return Array.from(root.querySelectorAll<HTMLElement>(selectors)).filter((node) =>
    node.querySelector('[id^="message-content-"], [class*="messageContent"]')
  );
}

export function mountMessageObserver({
  settings,
  onTranslate
}: ObserverOptions): MutationObserver {
  const decorateMessage = (message: HTMLElement) => {
    if (processedMessages.has(message)) {
      return;
    }

    const text = getMessageText(message);

    if (!text) {
      return;
    }

    const actionBar =
      message.querySelector<HTMLElement>('[class*="buttonContainer"]') ??
      message.querySelector<HTMLElement>('[class*="contents"]') ??
      message;

    const button = createTranslateButton(async () => {
      setButtonStatus(button, "loading");

      try {
        const translatedText = await onTranslate(text);
        renderTranslationResult(message, text, translatedText, settings.showBilingual);
        setButtonStatus(button, "success");
      } catch {
        setButtonStatus(button, "error");
      }
    });

    actionBar.appendChild(button);
    processedMessages.add(message);

    if (
      settings.translationMode === "auto" &&
      (!settings.autoTranslateVisibleOnly || isElementVisible(message))
    ) {
      void button.click();
    }
  };

  getMessageNodes(document).forEach(decorateMessage);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }

        if (
          node.matches?.(
            'li[id^="chat-messages-"], [id^="chat-messages-"], [data-list-item-id^="chat-messages"], li[role="listitem"]'
          )
        ) {
          decorateMessage(node);
          return;
        }

        getMessageNodes(node).forEach(decorateMessage);
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return observer;
}
