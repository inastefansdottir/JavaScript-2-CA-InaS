import express from "express";
const router = express.Router();

router.get("/login", (req, res) => {
  res.status(200).render("login", {
    title: "Log In - Petify",
    description:
      "Log in to Petify Connect with fellow pet lovers and share your furry friend's best moments."
  });
});

router.get("/signup", (req, res) => {
  res.status(200).render("signup", {
    title: "Signed up - Petify",
    description:
      "Join Petify today! Create your free account and share your pet's cutest adventures with the world."
  });
});

export default router;
