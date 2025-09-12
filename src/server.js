// src/server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const API_BASE_URL = "https://v2.api.noroff.dev/";

// Fix __dirname in ES modules
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(_dirname, "../views"));

// Middleware
app.use(express.json());
app.use(express.static(path.join(_dirname, "../public")));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home - Petify" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Log In - Petify" });
});

app.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up - Petify" });
});

app.get("/profile", (req, res) => {
  res.render("profile", { title: "Profile - Petify" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
