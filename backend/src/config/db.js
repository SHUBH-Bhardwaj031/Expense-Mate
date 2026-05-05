import mongoose from "mongoose";
import { mongoURI } from "../utils/constants.js";

async function connectDb() {
  try {
    await mongoose.connect(mongoURI);
    console.log("connected to db");
  } catch (e) {
    console.log(e);
    console.log("error in connecting db");
  }
}

connectDb();

export default connectDb;
