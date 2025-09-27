import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Routers
import authRouter from "../routes/auth.js";
import indexRouter from "../routes/index.js";
import postRouter from "../routes/post.js";
import profileRouter from "../routes/profile.js";

// Middleware to pass current page info
app.use((req, res, next) => {
  res.locals.currentPage = ""; // default
  next();
});

// View engine (EJS)
app.set("view engine", "ejs");
app.set("views", join(__dirname, "../views"));

// Middleware
app.use(express.json());

// Fix static folder resolution
app.use(express.static(join(__dirname, "../public")));

// Routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/posts", postRouter);
app.use("/", indexRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
