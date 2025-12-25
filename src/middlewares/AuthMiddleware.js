import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const Authenticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "token not found", success: false });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ error: "invalid token", success: false });
    }

    const user = await User.findById(decode._id);
    if (!user) {
      return res.status(401).json({ error: "user not found", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default Authenticate;
