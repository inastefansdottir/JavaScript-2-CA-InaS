import { addToLocalStorage, getFromLocalStorage } from "./utils.js";

const API_BASE_URL = "https://v2.api.noroff.dev";
const AUTH_REGISTER_URL = `${API_BASE_URL}/auth/register`;
const AUTH_LOGIN_URL = `${API_BASE_URL}/auth/login`;
const POSTS_URL = `${API_BASE_URL}/social/posts`;

const NOROFF_API_KEY = "d7e6b3d7-dfed-4144-a72f-17de3a3e8a1c";

export async function registerUser(userDetails) {
  try {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(AUTH_REGISTER_URL, fetchOptions);
    const json = await response.json();

    // Return both the status and the body
    return {
      ok: response.ok,
      status: response.status,
      ...json
    };
  } catch (error) {
    console.log(error);
  }
}

export async function loginUser(userDetails) {
  try {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(AUTH_LOGIN_URL, fetchOptions);
    const json = await response.json();

    const accessToken = json.data?.accessToken;
    if (accessToken) {
      addToLocalStorage("accessToken", accessToken);
    }

    return json;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchPosts() {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    console.log(accessToken);
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };
    const response = await fetch(
      `${POSTS_URL}?_author=true&_comments=true&_reactions=true`,
      fetchOptions
    );
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId) {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };
    const response = await fetch(
      `${POSTS_URL}/${postId}?_author=true&_comments=true&_reactions=true`,
      fetchOptions
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to fetch post");
    }

    return json.data;
  } catch (error) {
    console.log("Error in getPostById", error);
  }
}

export async function toggleReaction(postId, symbol) {
  try {
    const accessToken = getFromLocalStorage("accessToken");
    console.log("Access token:", accessToken);
    const response = await fetch(
      `${POSTS_URL}/${postId}/react/${encodeURIComponent(symbol)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": NOROFF_API_KEY
        }
      }
    );
    const json = await response.json();

    console.log(`${POSTS_URL}/${postId}/react/${encodeURIComponent(symbol)}`);

    if (!response.ok) {
      throw new Error(json.message || "Failed to fetch post");
    }

    return json.data;
  } catch (error) {
    console.error("Error toggling reaction:", error);
  }
}
