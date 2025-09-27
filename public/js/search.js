import { searchPosts, searchProfiles } from "./api.js";

// Mobile elements
const mobileSearchBar = document.getElementById("searchBar");
const mobileSearchToggle = document.getElementById("searchToggle");
const mobileSearchInput = mobileSearchBar?.querySelector(".search-input");
const mobileSearchResults = document.getElementById("searchResults");

// Desktop elements
const desktopSearchPanel = document.querySelector(".desktop-search-panel");
const desktopSearchToggle = document.querySelector(".search-button"); // the button in your nav
const desktopSearchInput = desktopSearchPanel?.querySelector(
  ".desktop-search-input"
);
const desktopSearchResults = document.getElementById("desktopSearchResults");

let isDesktopOpen = false;
let isMobileOpen = false;

//  DESKTOP
if (desktopSearchToggle && desktopSearchPanel) {
  // Toggle the desktop search panel when clicking the search button
  desktopSearchToggle.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDesktopOpen) {
      // Open: shrink the nav + reveal the panel
      document.querySelector(".desktop-nav").classList.add("shrink");
      desktopSearchPanel.classList.add("open");
      desktopSearchInput.focus();
      isDesktopOpen = true;
    } else {
      // Close if already open
      closeDesktopSearch();
    }
  });

  // Close when clicking outside
  document.addEventListener("click", e => {
    if (
      isDesktopOpen &&
      !desktopSearchPanel.contains(e.target) &&
      !desktopSearchToggle.contains(e.target)
    ) {
      closeDesktopSearch();
    }
  });

  // Handle typing inside desktop search input
  desktopSearchInput?.addEventListener("input", async e => {
    const query = e.target.value.trim();
    if (!query) return clearResults(desktopSearchResults);

    // Fetch profiles and posts that match the query
    const [profiles, posts] = await Promise.all([
      searchProfiles(query),
      searchPosts(query)
    ]);

    // Render results in the desktop container
    renderResults(profiles, posts, desktopSearchResults);
  });
}

// Helper: close desktop search
function closeDesktopSearch() {
  document.querySelector(".desktop-nav").classList.remove("shrink");
  desktopSearchPanel.classList.remove("open");
  desktopSearchInput.value = "";
  clearResults(desktopSearchResults);
  isDesktopOpen = false;
}

//  MOBILE
if (mobileSearchToggle && mobileSearchBar) {
  // Toggle the mobile search bar when clicking the button
  mobileSearchToggle.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();

    if (!isMobileOpen) {
      mobileSearchBar.classList.add("open");
      mobileSearchInput.focus();
      isMobileOpen = true;
    } else {
      closeMobileSearch();
    }
  });

  // Close search when clicking outside of the bar or button
  document.addEventListener("click", e => {
    if (
      isMobileOpen &&
      !mobileSearchBar.contains(e.target) &&
      !mobileSearchToggle.contains(e.target)
    ) {
      closeMobileSearch();
    }
  });

  // Handle typing inside mobile search input
  mobileSearchInput?.addEventListener("input", async e => {
    const query = e.target.value.trim();
    if (!query) return clearResults(mobileSearchResults);

    // Fetch profiles and posts that match the query
    const [profiles, posts] = await Promise.all([
      searchProfiles(query),
      searchPosts(query)
    ]);

    // Render results in the mobile container
    renderResults(profiles, posts, mobileSearchResults);
  });
}

// Helper: Close mobile search
function closeMobileSearch() {
  mobileSearchBar.classList.remove("open");
  mobileSearchInput.value = "";
  clearResults(mobileSearchResults);
  isMobileOpen = false;
}

// SHARED

// Clears search results in a given container
function clearResults(container) {
  if (!container) return;
  container.innerHTML = "";
  container.classList.add("hidden");
}

// Render both profile and post results inside the given container
function renderResults(profiles, posts, container) {
  if (!container) return;
  container.innerHTML = "";

  // Determine which input to read query from (desktop or mobile)
  const query = (
    container === desktopSearchResults ? desktopSearchInput : mobileSearchInput
  ).value
    .trim()
    .toLowerCase();

  // Merge results into a single array with type info
  let results = [
    ...profiles.map(profile => ({ type: "profile", ...profile })),
    ...posts.map(post => ({ type: "post", ...post }))
  ];

  // Custom sorting so closest matches appear first
  results.sort((a, b) => {
    const textA = (a.type === "profile" ? a.name : a.title).toLowerCase();
    const textB = (b.type === "profile" ? b.name : b.title).toLowerCase();

    if (textA === query && textB !== query) return -1;
    if (textB === query && textA !== query) return 1;
    if (textA.startsWith(query) && !textB.startsWith(query)) return -1;
    if (textB.startsWith(query) && !textA.startsWith(query)) return 1;
    if (textA.includes(query) && !textB.includes(query)) return -1;
    if (textB.includes(query) && !textA.includes(query)) return 1;

    return 0;
  });

  // If nothing was found
  if (!results.length) {
    container.innerHTML = "<p class='no-results'>No results found</p>";
    container.classList.remove("hidden");
    return;
  }

  // Create and append DOM elements for each result
  results.forEach(result => {
    const div = document.createElement("div");
    div.classList.add("search-item");

    if (result.type === "profile") {
      // Profile result
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
      // Post resukt
      div.classList.add("post-result");
      div.innerHTML = `
        <img src="${
          result.media?.url || "/images/default-image.png"
        }" class="post-img" />
        <span class="title">${result.title}</span>
      `;
      div.addEventListener("click", () => {
        window.location.href = `/posts/${result.id}`;
      });
    }

    container.appendChild(div);
  });

  // Make results visible
  container.classList.remove("hidden");
}
