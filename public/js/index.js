import { protectPage } from "./auth.js";
import { fetchPosts } from "./api.js";

protectPage();

let displayContainer = document.getElementById("displayContainer");

function generatePosts(posts) {
  posts.forEach(post => {
    const thumbnailHtml = `
        <article class="post-thumbnail">
            <div class="divider"></div>
            <div class="profile-section">
                <img
                    src="${post.author?.avatar?.url}"
                    alt="profile picture"
                    class="small-profile-icon"
                />
                <span class="username">${post.author?.name}</span>
            </div>
            <img
                src="${post.media?.url}"
                alt="${post.media?.alt}"
                class="image-post"
            />
            <div class="buttons-wrapper">
                <button type="button" class="paw-button">
                    <img src="/images/paw-print-unclicked.svg" />
                </button>
                <span>${post._count?.reactions}</span>
                <a href="/post/?id=${post.id}&name=${post.author?.name}" class="comment-button">
                    <ion-icon name="chatbubble-outline"></ion-icon>
                </a>
                <span>${post._count?.comments}</span>
                <button type="button" class="share-button">
                    <ion-icon name="share-outline"></ion-icon>
                </button>
            </div>
            <p class="description-section">${post.body}</p>
        </article>
        `;

    displayContainer.innerHTML += thumbnailHtml;
    console.log(displayContainer);
  });
}

async function main() {
  const posts = await fetchPosts();
  generatePosts(posts);
}

main();
