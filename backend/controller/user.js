import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ created: -1 })
      .select("name email phone createdAt updatedAt address");

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (user) {
      user.salt = undefined;
      user.hashed_password = undefined;
      req.userprofile = user;
      next();
    } else {
      res.status(400).json({ error: "User not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error finding user" });
  }
};

export const read = (req, res) => {
  return res.json(req.userprofile);
};
