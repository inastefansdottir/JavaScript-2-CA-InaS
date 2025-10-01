/**
 * Attach a share functionality to a given button
 * Uses the Web Share API if available, otherwise falls back to alerts
 * @param {HTMLButtonElement} button - The button element that triggers sharing
 * @param {string} [shareUrl=window.location.href] - The URL to share. Defaults to the current page URL
 */
export function shareFunction(button, shareUrl = window.location.href) {
  button.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: shareUrl
        });
      } catch (error) {
        alert("Oops! Something went wrong while trying to share.");
      }
    } else {
      alert("Sharing is not supported in your browser.");
    }
  });
}
