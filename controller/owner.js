import Owner from "../models/Owner.js";
import _ from "lodash";
import sharp from "sharp";
import path from "path";
import fs from "fs";

export const getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.find()
      .sort({ created: -1 })
      .select("name email phone createdAt updatedAt role");
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const ownerById = async (req, res, next, id) => {
  try {
    const owner = await Owner.findById(id);
    if (owner) {
      owner.salt = undefined;
      owner.hashed_password = undefined;
      req.ownerprofile = owner;
      next();
    } else {
      res.status(400).json({ error: "Owner not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const read = (req, res) => {
  res.json(req.ownerprofile);
};

export const update = async (req, res) => {
  let formbody = {};

  try {
    if (req.file !== undefined) {
      const { filename: photo } = req.file;

      // Compress photo
      await sharp(req.file.path)
        .resize(800)
        .jpeg({ quality: 100 })
        .toFile(path.resolve(req.file.destination, "resized", photo));
      fs.unlinkSync(req.file.path);
      req.body.photo = "ownerAvatar/resized/" + photo;
      formbody = { photo: req.body.photo };
    }

    let owner = req.ownerauth;

    if (req.body.oldPassword && req.body.newPassword) {
      if (!owner.authenticate(req.body.oldPassword)) {
        return res.status(401).json({
          error: "Password does not match",
        });
      } else {
        formbody = { ...formbody, password: req.body.newPassword };
      }
    }

    owner = _.extend(owner, formbody);

    await owner.save();

    owner.hashed_password = undefined;
    owner.salt = undefined;

    res.json(owner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
