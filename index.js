import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbconnection from "./src/utils/dbconnection.js";
import userRoutes from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config({
  path: ".env",
});

const port = process.env.PORT || 3000;

dbconnection();

app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
