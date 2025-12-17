import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
let secratkey = process.env.JWT_SECRET;

export function generateToken(data, expiresIn = "7d") {
  try {
    return jwt.sign(data, secratkey, { expiresIn });
  } catch (error) {
    throw new Error({ error: "Somthing wet wrong", msg: error.message });
  }
}
export function verifyToken(token) {
  console.log(token);
  try {
    return jwt.verify(token, secratkey);
  } catch (error) {
    throw new Error(error.message);
  }
}
