import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import Guest from "../models/Guest.js";
import _ from "lodash";

export const bookingById = async (req, res, next, id) => {
  try {
    const booking = await Booking.findById(id).populate("bus owner guest user");

    if (!booking) {
      return res.status(400).json({
        error: "Booking not found",
      });
    }
    req.booking = booking; // adds booking object in req with booking info
    next();
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate(
      "bus owner guest user self"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.ownerauth }).populate(
      "bus owner guest user self"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);

    if (req.userauth) {
      booking.user = req.userauth;
    } else {
      const { name, email, phone, address } = req.body;
      let user = await Guest.findOne({ phone });

      if (user) {
        user = _.extend(user, req.body);
        await user.save();
        booking.guest = user;
      } else {
        const guest = new Guest({ name, email, phone, address });
        await guest.save();
        booking.guest = guest;
      }
    }

    const bus = await Bus.findOne({ slug: req.bus.slug });

    if (
      bus.seatsAvailable < (req.body.passengers || booking.passengers) ||
      bus.isAvailable !== true ||
      bus.soldSeat.includes(booking.seatNumber) ||
      bus.bookedSeat.includes(booking.seatNumber)
    ) {
      return res.status(400).json({
        error: "Not available",
      });
    }

    bus.seatsAvailable -= req.body.passengers || booking.passengers;
    bus.bookedSeat.push(booking.seatNumber);

    booking.bus = bus;
    booking.owner = bus.owner;

    await booking.save();
    await bus.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postSold = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    booking.self = req.ownerauth;

    const bus = await Bus.findOne({ slug: req.bus.slug });

    if (
      bus.seatsAvailable < booking.passengers ||
      bus.isAvailable !== true ||
      bus.soldSeat.includes(booking.seatNumber) ||
      bus.bookedSeat.includes(booking.seatNumber)
    ) {
      return res.status(400).json({
        error: "Not available",
      });
    }

    bus.seatsAvailable -= booking.passengers;
    bus.soldSeat.push(booking.seatNumber);

    booking.bus = bus;
    booking.owner = bus.owner;
    booking.verification = "payed";

    await booking.save();
    await bus.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changeVerificationStatus = async (req, res) => {
  try {
    const booking = req.booking;
    booking.verification = req.body.verification;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = req.booking;
    const bus = await Bus.findOne({ slug: booking.bus.slug });

    if (booking.verification === "payed") {
      const removeIndexSold = bus.soldSeat
        .map((seat) => seat.toString())
        .indexOf(booking.seatNumber);

      bus.soldSeat.splice(removeIndexSold, 1);
    } else {
      const removeIndexBook = bus.bookedSeat
        .map((seat) => seat.toString())
        .indexOf(booking.seatNumber);

      bus.bookedSeat.splice(removeIndexBook, 1);
    }

    await booking.remove();
    await bus.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
