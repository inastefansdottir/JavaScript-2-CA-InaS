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
