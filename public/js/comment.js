import { addComment } from "./api.js";
import { getLoggedInUser } from "./utils.js";

/**
 * Initialize comment forms on the page
 * Handles form submission, sends comment to API, and updates the DOM
 * @param {string} postId - ID of the post to add comments to
 */
export function initCommentForm(postId) {
  const forms = document.querySelectorAll(".add-comment-form");
  const commentInputs = document.querySelectorAll(".write-comment");
  const commentsSection = document.getElementById("commentsSection");

  if (forms.length === 0 || commentInputs.length === 0 || !commentsSection) {
    console.warn("Comment form, input, or comments section not found.");
    return;
  }

  forms.forEach((form, index) => {
    const commentInput = commentInputs[index];

    // Listen for form submission
    form.addEventListener("submit", async e => {
      e.preventDefault();

      const commentText = commentInput.value.trim();
      if (!commentText) return; // Ignore empty comments

      const user = getLoggedInUser(); // Current logged-in user

      try {
        const newComment = await addComment(postId, commentText); // send to API

        if (newComment) {
          // Create DOM element for the new comment
          const commentElement = document.createElement("div");
          commentElement.classList.add("comment");
          commentElement.innerHTML = `
            <a href="/profile/${user.name}">
              <img
                src="${user.avatarUrl}"
                alt="user profile picture"
                class="small-profile-icon align-self"
              />
            </a>
            <div class="text-wrapper">
              <strong class="description-name">${user.name}</strong> 
              <p class="body-text">${newComment.body}</p>
            </div>
          `;

          // Add the new comment to the bottom
          commentsSection.appendChild(commentElement);
          commentInput.value = "";

          // Update the comment count
          const commentCountSpan = document.getElementById("commentCountSpan");
          if (commentCountSpan) {
            const currentCount = parseInt(commentCountSpan.textContent) || 0;
            commentCountSpan.textContent = currentCount + 1;
          }
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    });
  });
}
