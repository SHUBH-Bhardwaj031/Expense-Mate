import bcrypt from "bcrypt";
import mongoose from "mongoose";

//creating schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Name is required !"],
    minLength: [3, "Atleast 3 characters are required!"],
    maxLength: [20, "Atmost 20 characters are allowed !"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required !"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email [abc@gmail.com]!!"],
  },
  password: {
    type: String,
    required: [true, "Password is required !"],
    minLength: [6, "Alteast 6 characters are required "],
  },
  age: {
    type: Number,
    required: [true, "Age is required !"],
    min: [10, "Your age must be > 10"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Gender is required !"],
    validate: {
      validator: function (v) {
        console.log("validating gender");
        //custom logic..
        return true;
      },
      message: "Invalid gender by validator",
    },
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

//hashing password before saving..
userSchema.pre("save", async function (next) {
  //logic goes here....
  // getting user
  const user = this;

  console.log(user);
  //only hash if password is modified...

  if (!user.isModified("password")) {
    return next();
  }

  //getting salft
  const salt = await bcrypt.genSalt(15);
  //hashing password
  const hashedPassword = await bcrypt.hash(user.password, salt);
  //reassign password to user
  user.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
