import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb  " }));

dotenv.config({
  path: "/.env",
});

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/ravent", (req, res) => {
  res.send("<h1> YO YO</h1>");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
