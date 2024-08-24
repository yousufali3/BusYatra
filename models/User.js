import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Use uuid v4 for generating salt
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    address: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
    },
    info: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    phone: {
      type: Number,
      max: 9999999999,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    resetPasswordLink: {
      type: String, // Updated type to String
      default: "", // Properly set the default value
    },
    salt: {
      type: String, // Ensure 'salt' is of type String
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual field
userSchema
  .virtual("password")
  .set(function (password) {
    // Create temporary variable called _password
    this._password = password;
    // Generate a unique salt using uuidv4
    this.salt = uuidv4();
    // Encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

export default mongoose.model("User", userSchema);
