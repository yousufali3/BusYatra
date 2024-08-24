import Location from "../models/Location.js";
import _ from "lodash";

export const locationById = async (req, res, next, id) => {
  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(400).json({
        error: "Location not found",
      });
    }
    req.location = location; // adds location object in req with location info
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const add = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({}).sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const read = (req, res) => {
  res.json(req.location);
};

export const update = async (req, res) => {
  try {
    let location = req.location;
    location = _.extend(location, req.body);
    await location.save();
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    let location = req.location;
    await location.remove();
    res.json({ message: "Location removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
