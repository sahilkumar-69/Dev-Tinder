import UserModel from "../models/user.model.js";
// import { isURL, isEmail, isStrongPassword } from "validator";
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    // if (!isEmail(email)) {
    //   throw new Error("Invalid email");
    // }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = user.generateAuthToken();
    return res.status(200).cookie("token", token).json({
      success: true,
      data: user,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error,
      message: error.message,
    });
  }
};
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      throw new Error("All fields are required");
    }

    // if (!isEmail(email)) {
    //   throw new Error("Invalid email");
    // }
    // if (!isURL(req?.body.photoUrl)) {
    //   throw new Error("Invalid photo url");
    // }

    // if (!isStrongPassword(password)) {
    //   throw new Error("Password is not strong enough");
    // }

    const user = await UserModel.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }

    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password,
      photoUrl: req?.body.photoUrl,
      about: req?.body.about,
      skills: req?.body.skills,
    });

    const token = newUser.generateAuthToken();
    return res.status(200).cookie("token", token).json({
      success: true,
      message: "Signup successful",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { expires: new Date() }).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editProfile = async (req, res) => {};

export { login, signup, logout, editProfile };
