import jsonwebtoken from "jsonwebtoken";
import { ACCESS_SECRET } from "../utils/constants.js";

export const authMiddleware = (req, resp, next) => {
  console.log("this is my custom middleware..");
  console.log(req.headers);
  let { authorization } = req.headers;
  console.log(authorization);

  if (!authorization) {
    return resp.status(403).json({
      message: "no acccess token found!!",
    });
  }

  if (!authorization.startsWith("Bearer ")) {
    return resp.status(403).json({
      message: "Invalid token , token is not starting with bearer",
    });
  }

  //Bearer asgasfawfawfgaw
  authorization = authorization.substring(7);

  try {
    const payload = jsonwebtoken.verify(authorization, ACCESS_SECRET);

    console.log("userid", payload.sub);
    req.userId = payload.sub;

    next();
  } catch (e) {
    resp.status(403).json({
      message: e.message,
    });
  }
};
//logic
// token ko nikalenge
// token ko kaise verify
// agar varify ho gya
// to ham next() access
//otherwise --> error return
