import User from "../models/User.js";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { sendEmail } from "../utils/mailer.js";

// Sign up a new user
export const signup = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(403).json({ error: "Email is taken!" });
    }

    const newuser = new User(req.body);
    const user = await newuser.save();

    user.salt = undefined;
    user.hashed_password = undefined;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sign in an existing user
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ error: "User with that email does not exist." });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "Email and password do not match" });
    }

    const payload = { _id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware to require user sign in
export const requireUserSignin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      const user = parseToken(token);

      const founduser = await User.findById(user._id).select("name");

      if (founduser) {
        req.userauth = founduser;
        next();
      } else {
        res.status(401).json({ error: "Not authorized!" });
      }
    } else {
      res.status(401).json({ error: "Not authorized" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware to check user sign in status
export const checkUserSignin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      const user = parseToken(token);

      const founduser = await User.findById(user._id).select("name");

      if (founduser) {
        req.userauth = founduser;
      }
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Parse JWT token
const parseToken = (token) => {
  try {
    return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } catch (err) {
    throw new Error(err.message);
  }
};

// Middleware to check if user has correct access
export const isUser = (req, res, next) => {
  const user =
    req.userprofile &&
    req.userauth &&
    req.userprofile._id.toString() === req.userauth._id.toString();
  if (!user) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

// Refresh JWT token
export const refreshToken = async (req, res) => {
  try {
    if (req.body && req.body.token) {
      const parsed = parseToken(`Bearer ${req.body.token}`);

      const user = await User.findById(parsed._id);

      const payload = { _id: user.id, name: user.name, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return res.json({ token });
    }
    return res.json({ error: "Invalid content" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Social login or signup
export const socialLogin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      user = new User(req.body);
      req.userprofile = user;
      await user.save();

      const token = jwt.sign(
        { _id: user._id, iss: "NODEAPI" },
        process.env.JWT_SECRET
      );
      const { _id, name, email } = user;

      return res.json({ token, user: { _id, name, email } });
    } else {
      req.userprofile = user;
      user = _.extend(user, req.body);
      await user.save();

      const token = jwt.sign(
        { _id: user._id, iss: "NODEAPI" },
        process.env.JWT_SECRET
      );
      const { _id, name, email } = user;

      return res.json({ token, user: { _id, name, email } });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Handle forgot password
export const forgotPassword = async (req, res) => {
  try {
    if (!req.body || !req.body.email) {
      return res.status(400).json({ message: "No Email in request body" });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "User with that email does not exist!" });
    }

    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRET
    );
    const emailData = {
      from: "noreply@dhangaadi.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
    };

    await user.updateOne({ resetPasswordLink: token });

    sendEmail(emailData);
    return res.status(200).json({
      message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Handle password reset
export const resetPassword = async (req, res) => {
  try {
    const { resetPasswordLink, newPassword } = req.body;
    let user = await User.findOne({ resetPasswordLink });
    if (!user) {
      return res.status(401).json({ error: "Invalid Link!" });
    }

    const updatedFields = { password: newPassword, resetPasswordLink: "" };
    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    await user.save();
    res.json({ message: `Great! Now you can login with your new password.` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
