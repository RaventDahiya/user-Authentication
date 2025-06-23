import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbconnection = () => {
  mongoose
    .connect(`${process.env.MONGODB_URL}`)
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((err) => {
      console.log("error while connecting to mongodb");
    });
};

export default dbconnection;
