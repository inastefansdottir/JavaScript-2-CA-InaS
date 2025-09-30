import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).render("index", {
    title: "Home - Petify",
    description:
      "Discover adorable pet posts from the Petify community Like, comment, and share your love for animals.",
    currentPage: "home"
  });
});

router.get("/discover", (req, res) => {
  res.status(200).render("discover", {
    title: "Discover - Petify",
    description:
      "Discover adorable pet posts from the Petify community Like, comment, and share your love for animals.",
    currentPage: "discover"
  });
});

export default router;
