import jwt from "jsonwebtoken";

export const createToken = (user, token_type = "access_token") => {
  return jwt.sign(
    {
      email: user.email,
      username: user.username,
      sub: user._id,
      token_type,
    },
    process.env.ACCESS_SECRET, 
    {
      expiresIn: "1d",
    }
  );
};