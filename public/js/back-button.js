/**
 * Initialize back button functionality
 * Adds click event to element with id "backButton" to go to the previous page
 */
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
