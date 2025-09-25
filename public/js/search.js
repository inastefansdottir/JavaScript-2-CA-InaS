import { searchPosts, searchProfiles } from "./api.js";

const searchBar = document.getElementById("searchBar");
const searchToggle = document.getElementById("searchToggle");
const searchInput = searchBar.querySelector(".search-input");
const searchResults = document.getElementById("searchResults");

let isOpen = false;

// Toggle search bar open/close
searchToggle.addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation(); // prevent document click from firing at the same time

  if (!isOpen) {
    searchBar.classList.add("open");
    searchInput.focus();

    isOpen = true;
  } else {
    closeSearch();
  }
});

// Handle input typing
searchInput.addEventListener("input", async e => {
  const query = e.target.value.trim();

  if (!query) {
    searchResults.innerHTML = "";
    searchResults.classList.add("hidden");
    return;
  }

  // Fetch posts + profiles in parallel
  const [profiles, posts] = await Promise.all([
    searchProfiles(query),
    searchPosts(query)
  ]);

  renderResults(profiles, posts);
});

// Close when clicking outside
document.addEventListener("click", e => {
  if (isOpen && !searchBar.contains(e.target)) {
    closeSearch();
  }
});

// Function to close the search
function closeSearch() {
  searchBar.classList.remove("open");
  searchInput.value = ""; // clear input
  isOpen = false;

  // Hide dropdown
  searchResults.innerHTML = "";
  searchResults.classList.add("hidden");
}

// Render search results
function renderResults(profiles, posts) {
  searchResults.innerHTML = "";

  // Normalize query for case-sensetive matching
  const query = searchInput.value.trim().toLowerCase();

  let results = [
    ...profiles.map(profile => ({ type: "profile", ...profile })),
    ...posts.map(post => ({ type: "post", ...post }))
  ];

  // Sort everything together by relevence
  results.sort((a, b) => {
    const textA = (a.type === "profile" ? a.name : a.title).toLowerCase();
    const textB = (b.type === "profile" ? b.name : b.title).toLowerCase();

    // Exact match
    if (textA === query && textB !== query) return -1;
    if (textB === query && textA !== query) return 1;

    // Starts with
    if (textA.startsWith(query) && !textB.startsWith(query)) return -1;
    if (textB.startsWith(query) && !textA.startsWith(query)) return 1;

    // Includes
    if (textA.includes(query) && !textB.includes(query)) return -1;
    if (textB.includes(query) && !textA.includes(query)) return 1;

    return 0;
  });

  // If nothing found
  if (!results.length) {
    searchResults.innerHTML = "<p class='no-results'>No results found</p>";
    searchResults.classList.remove("hidden");
    return;
  }

  // Render results mixed
  results.forEach(result => {
    const div = document.createElement("div");
    div.classList.add("search-item");

    if (result.type === "profile") {
      div.classList.add("profile-result");
      div.innerHTML = `
        <img src="${
          result.avatar?.url || "/images/placeholder-profile-image.png"
        }" class="profile-img" />
        <span class="search-username">${result.name}</span>
      `;
      div.addEventListener("click", () => {
        window.location.href = `/profile/${result.name}`;
      });
    } else {
      div.classList.add("post-result");
      div.innerHTML = `
        <img src="${
          result.media?.url || "/images/default-image.png"
        }" class="post-img" />
        <span class="title">${result.title}</span>
      `;
      div.addEventListener("click", () => {
        window.location.href = `/post/${result.id}`;
      });
    }

    searchResults.appendChild(div);
  });

  searchResults.classList.remove("hidden");
}
