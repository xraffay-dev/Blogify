const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { error } = require("console");
const { createTokenForUser } = require("../utils/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/public/images/defaultpfp.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString();
  const hashedPassowrd = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassowrd;

  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
      console.log("User not found");
      throw new Error("Login Failed");
    }
    const hashedPassword = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");
    if (hashedPassword === user.password) {
      return createTokenForUser(user);
    } else {
      console.log("Wrong Password");
      throw new Error("Login Failed");
    }
  }
);

const User = mongoose.model("user", userSchema);
//https://mongoosejs.com/docs/models.html

module.exports = User;
