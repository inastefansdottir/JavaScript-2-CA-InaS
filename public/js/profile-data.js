import { getProfile } from "./api.js";

const profilePicture = document.getElementById("profilePicture");
const username = document.getElementById("username");
const followingCount = document.getElementById("followingCount");
const followersCount = document.getElementById("followersCount");
const postsCount = document.getElementById("postsCount");

const postsContainer = document.getElementById("postsContainer");

export async function initProfileData(name) {
  try {
    const profile = await getProfile(name);

    profilePicture.src =
      profile.avatar?.url || "/images/placeholder-profile-image.png";

    username.textContent = profile.name;
    followingCount.textContent = profile._count?.following ?? 0;
    followersCount.textContent = profile._count?.followers ?? 0;
    postsCount.textContent = profile._count?.posts ?? 0;

    return profile;
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

export function generateUserPosts(posts) {
  posts.forEach(post => {
    const postHtml = `
        <a href="/posts/${post.id}"
          ><img src="${post.media?.url || "/images/default-image.png"}"
          alt="${post.media?.alt || "post image"}"
          class="thumbnail"
          onerror="this.onerror=null; this.src='/images/default-image.png';"
        />
        `;

    postsContainer.insertAdjacentHTML("beforeend", postHtml);
  });
}
