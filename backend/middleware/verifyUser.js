import { verifyToken } from "../util/jwt.js";

export const verifyUser = async (req, res, next) => {
  try {
    console.log("verify");
    let { token } = req.cookies;
    console.log("token");
    let { id } = verifyToken(token);
    console.log("id");
    if (!id) {
      return res.status(401).send({ error: "Invalid Token" });
    } else {
      req.id = id;
      next();
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
