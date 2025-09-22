import express from "express";

const router = express.Router();

router.get("/create", (req, res) => {
  res.status(200).render("create-post", {
    title: "Create Post - Petify",
    currentPage: "create"
  });
});

router.get("/edit/:id", (req, res) => {
  const { id } = req.params;
  res
    .status(200)
    .render("edit-post", { postId: id, title: "Edit Post - Petify" });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).render("post", { postId: id, title: "Post - Petify" });
});

export default router;
