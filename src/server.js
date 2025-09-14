// src/server.js
import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

import authRouter from "../routes/auth.js";
import indexRouter from "../routes/index.js";
import postRouter from "../routes/post.js";
import profileRouter from "../routes/profile.js";

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json());
app.use(express.static(path.resolve("./public")));

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/posts", postRouter);
app.use("/", indexRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
