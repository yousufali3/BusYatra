import Travel from "../models/Travel.js";
import _ from "lodash";

export const travelById = async (req, res, next, id) => {
  try {
    const travel = await Travel.findById(id);
    if (!travel) {
      return res.status(400).json({ error: "Travel not found" });
    }
    req.travel = travel; // adds travel object in req with travel info
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const add = async (req, res) => {
  try {
    const travel = new Travel(req.body);
    await travel.save();
    res.json(travel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTravels = async (req, res) => {
  try {
    const travels = await Travel.find({}).sort({ name: 1 });
    res.json(travels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const read = (req, res) => {
  res.json(req.travel);
};

export const update = async (req, res) => {
  try {
    let travel = req.travel;
    travel = _.extend(travel, req.body);
    await travel.save();
    res.json(travel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    let travel = req.travel;
    await travel.remove();
    res.json({ message: "Travel removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
