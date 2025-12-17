import User from "../model/User.js";
import { comparePassword, generatehash } from "../util/bcrypt.js";
import { generateToken } from "../util/jwt.js";

export async function userSignup(req, res) {
  if (!req.body) {
    return res.status(400).json({
      status: false,
      message: "Please provide required user details for signup",
    });
  }
  try {
    let { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).send({ error: "Provide all the fields" });
    } else {
      let isUser = await User.findOne({ email });
      if (isUser) {
        return res.status(200).send({ error: "Email already exist" });
      } else {
        let hashedPassword = generatehash(password);
        let userDetails = new User({ email, name, password: hashedPassword });
        await userDetails.save();
        return res
          .status(201)
          .send({ message: "User Registration Successfully" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Somthing went wrong", msg: error.message });
  }
}

export const login = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: false,
      message: "Please provide required user details for login",
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Provide all required fields" });
    }
    let isUser = await User.findOne({ email });

    if (!isUser) {
      return res.status(401).json({ error: "User is not Registered" });
    }

    let isPassword = await comparePassword(password, isUser.password);

    if (!isPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    let token = generateToken({ id: isUser._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      token: token,
      _id: isUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("Token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    res.status(200).send({ message: "Logout Successfull" });
  } catch (error) {
    res.status(500).send({ error: "Somthing went wrong", msg: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    let { id } = req;
    let userDetails = await User.findById(id).select("-password -_id -__v");
    return res.status(200).send({ userDetails });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Somthing went to wrong", msg: error.message });
  }
};
