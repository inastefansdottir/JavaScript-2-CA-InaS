import express from "express";
const router = express.Router();

router.get("/login", (req, res) => {
  res.status(200).render("login", { title: "Log In - Petify" });
});

router.get("/signup", (req, res) => {
  res.status(200).render("signup", { title: "Signed up - Petify" });
});

export default router;
