import express from "express";

const router = express.Router();

router.get("/edit", (req, res) => {
  res.status(200).render("edit-post", { title: "Edit Post - Petify" });
});

router.get("/create", (req, res) => {
  res.status(200).render("create-post", {
    title: "Create Post - Petify",
    currentPage: "create"
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).render("post", { postId: id, title: "Post - Petify" });
});

export default router;
