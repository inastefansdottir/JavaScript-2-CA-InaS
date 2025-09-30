import express from "express";

const router = express.Router();

router.get("/create", (req, res) => {
  res.status(200).render("create-post", {
    title: "Create Post - Petify",
    description:
      "Share your pet's cutest moments on Petify! Post photos, stories, and make tails wag.",
    currentPage: "create"
  });
});

router.get("/edit/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).render("edit-post", {
    postId: id,
    title: "Edit Post - Petify",
    description:
      "Make changes to your Petify post Update your story, photos, or add something new about your furry friend."
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).render("post", {
    postId: id,
    title: "Post - Petify",
    description:
      "See this post on Petify. Join the pet community and share your thoughts."
  });
});

export default router;
