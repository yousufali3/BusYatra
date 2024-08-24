import Owner from "../models/Owner.js";
import jwt from "jsonwebtoken";
import _ from "lodash";

export const signup = async (req, res) => {
  const ownerExists = await Owner.findOne({ email: req.body.email });
  if (ownerExists) {
    return res.status(403).json({
      error: "Email is taken!",
    });
  }
  const newOwner = new Owner(req.body);
  const owner = await newOwner.save();

  owner.salt = undefined;
  owner.hashed_password = undefined;
  res.json(owner);
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const owner = await Owner.findOne({ email });

  if (!owner) {
    return res.status(401).json({
      error: "Owner with that email does not exist.",
    });
  }

  if (!owner.authenticate(password)) {
    return res.status(401).json({
      error: "Email and password do not match",
    });
  }

  const payload = {
    _id: owner.id,
    name: owner.name,
    email: owner.email,
    role: owner.role,
    refresh_hash: owner.salt,
    avatar: owner.photo || null,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

  return res.json({ token });
};

export const refreshToken = async (req, res) => {
  if (req.body && req.body._id) {
    const owner = await Owner.findOne({ _id: req.body._id });

    const payload = {
      _id: owner.id,
      name: owner.name,
      email: owner.email,
      role: owner.role,
      refresh_hash: owner.salt,
      avatar: owner.photo || null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({ token });
  }
  return res.json({ error: "Invalid content" });
};

export const requireOwnerSignin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const owner = parseToken(token);

    const foundOwner = await Owner.findById(owner._id).select(
      "name role salt hashed_password"
    );

    if (foundOwner) {
      req.ownerauth = foundOwner;
      next();
    } else {
      res.status(401).json({ error: "Not authorized!" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

const parseToken = (token) => {
  try {
    return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } catch (err) {
    return false;
  }
};

export const requireSuperadminSignin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const owner = parseToken(token);

    const foundOwner = await Owner.findById(owner._id).select("name role");

    if (foundOwner && foundOwner.role === "superadmin") {
      req.ownerauth = foundOwner;
      next();
    } else {
      res.status(401).json({ error: "Not authorized!" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

export const isPoster = (req, res, next) => {
  const sameUser =
    req.bus &&
    req.ownerauth &&
    req.bus.owner._id.toString() === req.ownerauth._id.toString();
  const adminUser =
    req.bus && req.ownerauth && req.ownerauth.role === "superadmin";

  const isPoster = sameUser || adminUser;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
  next();
};

export const isBookingOwner = (req, res, next) => {
  const sameUser =
    req.booking &&
    req.ownerauth &&
    req.booking.owner._id.toString() === req.ownerauth._id.toString();

  const adminUser =
    req.booking && req.ownerauth && req.ownerauth.role === "superadmin";

  const isPoster = sameUser || adminUser;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
  next();
};

export const isAuth = (req, res, next) => {
  const user =
    req.ownerprofile &&
    req.ownerauth &&
    req.ownerprofile._id.toString() === req.ownerauth._id.toString();
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};
