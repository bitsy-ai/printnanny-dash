import { detect } from "detect-browser";
import { error } from "@/stores/alerts";

const SUPPORTED_BROWSERS = ["chrome", "chromium-webview"];

function checkBrowserSupport(): boolean {
  const browser = detect();
  if (browser && SUPPORTED_BROWSERS.includes(browser.name)) {
    return true;
  }
  error(
    `Your browser (${browser?.name}) is not supported`,
    `Please re-open this page using Google Chrome: https://www.google.com/chrome/

  Track support for other browsers by subscribing to this issue: https://github.com/bitsy-ai/printnanny-os/issues/281`
  );
  return false;
}

export { checkBrowserSupport };
