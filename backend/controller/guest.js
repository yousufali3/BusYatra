import Guest from "../models/Guest.js";

export const getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.find()
      .sort({ created: -1 })
      .select("name email phone createdAt updatedAt address");
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
