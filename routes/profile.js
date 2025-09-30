import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).render("profile", {
    title: "Profile - Petify",
    description:
      "Your Petify profile, See your posts, reactions, and keep sharing the love with the pet community.",
    currentPage: "profile"
  });
});

router.get("/edit", (req, res) => {
  res.status(200).render("edit-profile", {
    title: "Edit Profile - Petify",
    description:
      "Manage your Petify account Update your avatar, view your details, or sign out anytime."
  });
});

router.get("/:name", (req, res) => {
  const name = req.params.name;
  res.status(200).render("user-profile", {
    title: `${name}'s Profile - Petify`,
    description: `See ${name}'s posts and pet updates on Petify.`,
    name
  });
});

export default router;
