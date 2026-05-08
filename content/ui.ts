export type TranslationStatus = "idle" | "loading" | "success" | "error";

const ICON_MAP: Record<TranslationStatus, string> = {
  idle: String.fromCodePoint(0x1f310),
  loading: String.fromCodePoint(0x23f3),
  success: String.fromCodePoint(0x2705),
  error: String.fromCodePoint(0x274c)
};

export function createTranslateButton(onClick: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "discord-translator-button";
  button.textContent = ICON_MAP.idle;
  button.title = "Translate message";
  button.setAttribute("aria-label", "Translate message");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });

  return button;
}

export function setButtonStatus(
  button: HTMLButtonElement,
  status: TranslationStatus
): void {
  button.dataset.status = status;
  button.textContent = ICON_MAP[status];
}

export function renderTranslationResult(
  container: HTMLElement,
  originalText: string,
  translatedText: string,
  showBilingual: boolean
): void {
  let resultNode = container.querySelector<HTMLElement>(".discord-translator-result");

  if (!resultNode) {
    resultNode = document.createElement("div");
    resultNode.className = "discord-translator-result";
    container.appendChild(resultNode);
  }

  resultNode.innerHTML = "";

  if (showBilingual) {
    const original = document.createElement("div");
    original.className = "discord-translator-original";
    original.textContent = originalText;
    resultNode.appendChild(original);
  }

  const translated = document.createElement("div");
  translated.className = "discord-translator-translated";
  translated.textContent = translatedText;
  resultNode.appendChild(translated);
}
