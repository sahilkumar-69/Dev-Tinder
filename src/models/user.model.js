import jwt from "jsonwebtoken";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      required: true,
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
    },
    age: {
      type: Number,
      min: [18, "Age must be greater than 18"],
      max: [100, "Its time to take rest, {VALUE}"],
    },
    about: {
      type: String,
      default: "Welcome to Dev Tinder",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};
userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);

  return isMatch;
};

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // next();
});

const UserModel = model("User", userSchema);
export default UserModel;
