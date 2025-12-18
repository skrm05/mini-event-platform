import { verifyToken } from "../util/jwt.js";

export const verifyUser = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    console.log("token=> ", token);
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("tokenHeaders=> ", token);

    if (!token) {
      return res.status(401).send({ error: "No Token Provided" });
    }

    let { id } = verifyToken(token);
    console.log("id=> ", id);
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
