export function backButton() {
  // Event listener for back button
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.addEventListener("click", e => {
      e.preventDefault();
      window.history.back(); // go back to previous page
    });
  }
}
