import { addComment } from "./api.js";
import { getLoggedInUser } from "./utils.js";

export function initCommentForm(postId) {
  const form = document.getElementById("addCommentForm");
  const commentInput = document.getElementById("writeComment");
  const commentsSection = document.getElementById("commentsSection");

  if (!form || !commentInput || !commentsSection) {
    console.warn("Comment form, input, or comments section not found.");
    return;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const commentText = commentInput.value.trim();
    if (!commentText) return;

    const user = getLoggedInUser() || {
      name: "Username"
    };

    try {
      const newComment = await addComment(postId, commentText);

      if (newComment) {
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
        const currentCount = parseInt(commentCountSpan.textContent) || 0;
        commentCountSpan.textContent = currentCount + 1;
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  });

  console.log(getLoggedInUser());
}
