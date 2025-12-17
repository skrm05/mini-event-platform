import mongoose from "mongoose";
import { config } from "dotenv";
config();
export default async function dbConnect() {
  try {
    // console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db connected");
  } catch (error) {
    console.log("db connection error", error);
  }
}
