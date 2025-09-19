import { protectPage } from "./auth.js";
import { createPost } from "./api.js";
import { getUser } from "./utils.js";

protectPage();

const createForm = document.getElementById("form");

const imageInput = document.getElementById("image");
const altInput = document.getElementById("alt");
const bodyInput = document.getElementById("body");

const bodyCounter = document.getElementById("bodyCounter");

// Update body counter on input
bodyInput.addEventListener("input", () => {
  const length = bodyInput.value.length;
  bodyCounter.textContent = `${length}/10000`;
});

createForm.addEventListener("submit", async e => {
  e.preventDefault();

  const submitBtn = createForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  const mediaUrl = imageInput.value.trim();
  const altText = altInput.value.trim();
  const body = bodyInput.value.trim();

  const name = getUser();

  const title = body ? body.substring(0, 20) + "..." : `Post by ${name}`;

  const postData = {
    title,
    body,
    media: {
      url: mediaUrl,
      alt: altText
    }
  };

  try {
    const data = await createPost(postData);

    if (data) {
      alert("Your post was published!");
      location.href = "/"; // redirect to feed
    } else {
      alert("Failed to publish post. Check console for details.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while publishing your post.");
  } finally {
    submitBtn.disabled = false;
  }
});
