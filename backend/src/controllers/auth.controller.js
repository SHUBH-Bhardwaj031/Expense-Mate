import User from "../models/users.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwtUtil.js";

export const loginUser = async (req, resp) => {
  const { email, password } = req.body;
  console.log("Email: ", email);
  console.log("password", password);

  //check the email and password
  if (!email || !password) {
    return resp.status(403).json({
      message: "Invalid Credentials !!",
    });
  }

  ///user fetch jiski emailhai:

  const user = await User.findOne({ email });
  if (!user) {
    return resp.status(403).json({
      message: "Invalid Username or Password !",
    });
  }

  // match the passwords
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return resp.status(403).json({
      message: "Invalid Username or Password !!",
    });
  }

  // token____

  //we have to create token
  const accessToken = createToken(user);
  resp.json({
    accessToken,
    user,
  });
};
