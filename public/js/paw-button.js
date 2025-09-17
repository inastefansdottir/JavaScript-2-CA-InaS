import { getUser } from "./utils.js";
import { toggleReaction } from "./api.js";

export function initPawButton(likeButton, likeCountSpan, postId, reactions) {
  const currentUser = getUser();

  // Total reactions (all symbols)
  let totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);

  // Find paw reaction
  let pawReaction = reactions.find(r => r.symbol === "🐾");
  let liked = pawReaction?.reactors.includes(currentUser);

  // Set initial button state
  if (liked) {
    likeButton.innerHTML = `<img src="/images/paw-print-clicked.svg" />`;
  }
  likeCountSpan.textContent = totalReactions;

  // Add click listener
  likeButton.addEventListener("click", async e => {
    e.preventDefault();

    // Call API to toggle paw reaction
    const result = await toggleReaction(postId, "🐾");

    // Update pawReaction and total reactions from API response
    pawReaction = result.reactions.find(r => r.symbol === "🐾");
    totalReactions = result.reactions.reduce((sum, r) => sum + r.count, 0);

    // Update button state
    liked = pawReaction?.reactors.includes(currentUser);
    likeButton.innerHTML = liked
      ? `<img src="/images/paw-print-clicked.svg" />`
      : `<img src="/images/paw-print-unclicked.svg" />`;

    // Update reaction count
    likeCountSpan.textContent = totalReactions;
  });
}
