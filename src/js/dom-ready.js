/**
 * Runs a callback when the DOM is ready.
 * Safe to call at any point — if the document has already loaded,
 * the callback fires synchronously.
 */
function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}
