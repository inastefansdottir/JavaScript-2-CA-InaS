const searchBar = document.getElementById("searchBar");
const searchToggle = document.getElementById("searchToggle");
const searchInput = searchBar.querySelector(".search-input");

let isOpen = false;

searchToggle.addEventListener("click", e => {
  console.log("Button clicked!");
  e.preventDefault();
  e.stopPropagation(); // prevent document click from firing at the same time

  if (!isOpen) {
    searchBar.classList.add("open");
    searchInput.focus();

    searchToggle.innerHTML =
      '<ion-icon name="arrow-forward-outline" class="arrow"></ion-icon>';
    searchToggle.type = "submit";

    isOpen = true;
  } else {
    searchBar.submit();
  }
});

// Close when clicking outside
document.addEventListener("click", e => {
  if (isOpen && !searchBar.contains(e.target)) {
    searchBar.classList.remove("open");
    searchInput.value = ""; // Clear input
    searchToggle.innerHTML =
      '<ion-icon name="search-outline" class="search-outline"></ion-icon>';
    searchToggle.type = "button";
    isOpen = false;
  }
});
