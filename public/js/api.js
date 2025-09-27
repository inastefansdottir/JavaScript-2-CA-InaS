import { saveToken, getToken, saveUser } from "./utils.js";

const API_BASE_URL = "https://v2.api.noroff.dev";
const AUTH_REGISTER_URL = `${API_BASE_URL}/auth/register`;
const AUTH_LOGIN_URL = `${API_BASE_URL}/auth/login`;
const POSTS_URL = `${API_BASE_URL}/social/posts`;
const PROFILE_URL = `${API_BASE_URL}/social/profiles`;

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

export async function loginUser({ email, password }) {
  try {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(AUTH_LOGIN_URL, fetchOptions);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.errors?.[0]?.message || "Invalid email or password");
    }

    const accessToken = json.data?.accessToken;
    const user = json.data;

    if (accessToken) {
      saveToken("accessToken", accessToken);
      saveUser(user.name);
      if (user) {
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            name: user.name,
            email: user.email,
            avatarUrl: user.avatar?.url
          })
        );
      }
      window.location.href = "/";
    }

    return json;
  } catch (error) {
    throw error;
  }
}

export async function fetchPosts() {
  try {
    const accessToken = getToken("accessToken");
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
    const accessToken = getToken("accessToken");
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

export async function createPost(postData) {
  try {
    const accessToken = getToken("accessToken");
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };
    const response = await fetch(POSTS_URL, fetchOptions);

    const json = await response.json();

    if (!response.ok) {
      console.error("Failed to create post:", json);
      return null; // return null instead of throwing
    }

    return json.data;
  } catch (error) {
    console.error("Error in createPost:", error);
    return null; // return null on error
  }
}

export async function toggleReaction(postId, symbol) {
  try {
    const accessToken = getToken("accessToken");
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

    if (!response.ok) {
      throw new Error(json.message || "Failed to fetch post");
    }

    return json.data;
  } catch (error) {
    console.error("Error toggling reaction:", error);
  }
}

export async function addComment(postId, comment, replyToId = null) {
  try {
    const accessToken = getToken("accessToken");
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      },
      body: JSON.stringify({
        body: comment,
        ...(replyToId && { replyToId })
      })
    };

    const response = await fetch(
      `${POSTS_URL}/${postId}/comment`,
      fetchOptions
    );
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to add comment");
    }

    return json.data;
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

export async function getProfile(name) {
  try {
    const accessToken = getToken("accessToken");
    const response = await fetch(`${PROFILE_URL}/${name}?_followers=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to fetch profile");
    }

    return json.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
}

export async function getProfilePosts(name) {
  try {
    const accessToken = getToken("accessToken");
    const response = await fetch(`${PROFILE_URL}/${name}/posts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to fetch profile posts");
    }

    return json.data;
  } catch (error) {
    console.error("Error fetching profile posts:", error);
  }
}

export async function updateAvatar(name, imageUrl) {
  try {
    const accessToken = getToken("accessToken");
    const fetchOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      },
      body: JSON.stringify({
        avatar: {
          url: imageUrl,
          alt: `${name}'s profile picture`
        }
      })
    };

    const response = await fetch(`${PROFILE_URL}/${name}`, fetchOptions);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to update avatar");
    }

    return json.data;
  } catch (error) {
    console.error("Error updating avatar:", error);
  }
}

export async function updatePostDescription(postId, bodytext) {
  try {
    const accessToken = getToken("accessToken");
    const fetchOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      },
      body: JSON.stringify({ body: bodytext })
    };

    const response = await fetch(`${POSTS_URL}/${postId}`, fetchOptions);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to update post");
    }

    return json.data;
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

export async function followProfile(profileName) {
  try {
    const accessToken = getToken("accessToken");
    const fetchOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };

    const response = await fetch(
      `${PROFILE_URL}/${profileName}/follow?_followers=true`,
      fetchOptions
    );
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to follow profile");
    }

    return json.data;
  } catch (error) {
    console.error("Error following profile:", error);
  }
}

export async function unfollowProfile(profileName) {
  try {
    const accessToken = getToken("accessToken");
    const fetchOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };

    const response = await fetch(
      `${PROFILE_URL}/${profileName}/unfollow?_followers=true`,
      fetchOptions
    );
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to unfollow profile");
    }

    return json.data;
  } catch (error) {
    console.error("Error unfollowing profile:", error);
  }
}

export async function deletePost(postId) {
  try {
    const accessToken = getToken("accessToken");
    const fetchOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };

    const response = await fetch(`${POSTS_URL}/${postId}`, fetchOptions);

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}

export async function deleteComment(postId, commentId) {
  try {
    const accessToken = getToken("accessToken");
    const fetchOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };

    const response = await fetch(
      `${POSTS_URL}/${postId}/comment/${commentId}`,
      fetchOptions
    );

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }

    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
}

export async function searchPosts(query) {
  try {
    const accessToken = getToken("accessToken");
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };

    const response = await fetch(
      `${POSTS_URL}/search?q=${encodeURIComponent(query)}`,
      fetchOptions
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to search posts");
    }

    return json.data || [];
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}

export async function searchProfiles(query) {
  try {
    const accessToken = getToken("accessToken");
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": NOROFF_API_KEY
      }
    };

    const response = await fetch(
      `${PROFILE_URL}/search?q=${encodeURIComponent(query)}`,
      fetchOptions
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to search profiles");
    }

    return json.data || [];
  } catch (error) {
    console.error("Error searching profiles:", error);
    return [];
  }
}
