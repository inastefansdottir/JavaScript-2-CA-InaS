import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res
    .status(200)
    .render("profile", { title: "Profile - Petify", currentPage: "profile" });
});

router.get("/edit", (req, res) => {
  res.status(200).render("edit-profile", { title: "Edit Profile - Petify" });
});

router.get("/user", (req, res) => {
  res.status(200).render("user-profile", {
    title: "User profile - Petify"
  });
});

export default router;
