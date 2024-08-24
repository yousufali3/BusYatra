import Bus from "../models/Bus.js";
import _ from "lodash";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { checkDateAvailability } from "../utils/index.js";

export const busBySlug = async (req, res, next, slug) => {
  const bus = await Bus.findOne({ slug }).populate("owner", "name role");
  if (!bus) {
    return res.status(400).json({
      error: "Bus not found",
    });
  }
  req.bus = bus; // adds bus object in req with bus info
  next();
};

export const read = (req, res) => {
  return res.json(req.bus);
};

export const getBuses = async (req, res) => {
  const buses = await Bus.find()
    .populate("owner", "name")
    .populate("travel", "name")
    .sort({ created: -1 });

  res.json(buses);
};

export const getAllAvailableBuses = async (req, res) => {
  const buses = await Bus.find({ isAvailable: true })
    .populate("owner", "name phone")
    .populate("travel", "name")
    .sort({ created: -1 });

  res.json(buses);
};

export const getAllUnavailableBuses = async (req, res) => {
  const buses = await Bus.find({ isAvailable: false })
    .populate("owner", "name phone")
    .populate("travel", "name")
    .sort({ created: -1 });

  res.json(buses);
};

export const getAvailableBusesOfOwner = async (req, res) => {
  const buses = await Bus.find({ owner: req.ownerauth, isAvailable: true })
    .populate("owner", "name")
    .populate("travel", "name")
    .sort({ created: -1 });

  res.json(buses);
};

export const getUnavailableBusesOfOwner = async (req, res) => {
  const buses = await Bus.find({ owner: req.ownerauth, isAvailable: false })
    .populate("owner", "name")
    .populate("travel", "name")
    .sort({ created: -1 });

  res.json(buses);
};

export const searchBus = async (req, res) => {
  if (_.size(req.query) < 1)
    return res.status(400).json({ error: "Invalid query" });

  const { startLocation, endLocation, journeyDate } = req.query;

  const bus = await Bus.find({
    startLocation,
    endLocation,
    journeyDate,
    isAvailable: true,
  })
    .populate("travel", "name")
    .populate("startLocation", "name")
    .populate("endLocation", "name");

  return res.json(bus);
};

export const searchBusByFilter = async (req, res) => {
  const { startLocation, endLocation, journeyDate, travel, type } = req.body;
  const bus = await Bus.find({
    startLocation,
    endLocation,
    journeyDate,
    isAvailable: true,
    travel: { $in: travel },
    type: { $in: type },
  })
    .populate("travel", "name")
    .populate("startLocation", "name")
    .populate("endLocation", "name");
  res.json(bus);
};

export const create = async (req, res) => {
  const busExists = await Bus.findOne({ busNumber: req.body.busNumber });
  if (busExists)
    return res.status(403).json({
      error: "Bus is already added!",
    });

  if (req.file !== undefined) {
    const { filename: image } = req.file;

    // Compress image
    await sharp(req.file.path)
      .resize(800)
      .jpeg({ quality: 100 })
      .toFile(path.resolve(req.file.destination, "resized", image));
    fs.unlinkSync(req.file.path);
    req.body.image = "busimage/resized/" + image;
  }

  if (req.body.boardingPoints) {
    req.body.boardingPoints = req.body.boardingPoints.split(",");
  }

  if (req.body.droppingPoints) {
    req.body.droppingPoints = req.body.droppingPoints.split(",");
  }

  const bus = new Bus(req.body);
  bus.seatsAvailable = req.body.numberOfSeats;

  if (!checkDateAvailability(req.body.journeyDate)) {
    bus.isAvailable = false;
  }

  bus.owner = req.ownerauth;

  await bus.save();

  res.json(bus);
};

export const update = async (req, res) => {
  if (req.file !== undefined) {
    const { filename: image } = req.file;

    // Compress image
    await sharp(req.file.path)
      .resize(800)
      .jpeg({ quality: 100 })
      .toFile(path.resolve(req.file.destination, "resized", image));
    fs.unlinkSync(req.file.path);
    req.body.image = "busimage/resized/" + image;
  }

  let bus = req.bus;
  bus = _.extend(bus, req.body);

  if (!checkDateAvailability(req.body.journeyDate)) {
    bus.isAvailable = false;
  }

  await bus.save();

  res.json(bus);
};

export const remove = async (req, res) => {
  let bus = req.bus;
  await bus.remove();
  res.json({ message: "Bus removed successfully" });
};
