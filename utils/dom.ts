export function getMessageText(container: HTMLElement): string {
  const selectors = [
    '[id^="message-content-"]',
    '[class*="messageContent"]',
    '[class*="markup"]'
  ];

  for (const selector of selectors) {
    const target = container.querySelector<HTMLElement>(selector);
    const text = target?.innerText?.trim();

    if (text) {
      return text;
    }
  }

  return container.innerText.trim();
}

export function isElementVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();

  return rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= window.innerHeight &&
    rect.left <= window.innerWidth;
}

export function createShadowHost(className: string): ShadowRoot {
  const host = document.createElement("span");
  host.className = className;
  return host.attachShadow({ mode: "open" });
}
