import { Router } from "express";
import {
  bookingById,
  getOwnerBookings,
  changeVerificationStatus,
  postBooking,
  postSold,
  deleteBooking,
  getAllBookings,
} from "../controller/booking.js";
import { checkUserSignin } from "../controller/auth-user.js";
import {
  requireOwnerSignin,
  isBookingOwner,
  requireSuperadminSignin,
} from "../controller/auth-owner.js";
import { busBySlug } from "../controller/bus.js";

const router = Router();

router.get("/my", requireOwnerSignin, getOwnerBookings);
router.get("/all", requireSuperadminSignin, getAllBookings);

router.post("/sold/:busSlug", requireOwnerSignin, postSold);
router.post("/book/:busSlug", checkUserSignin, postBooking);

router.patch("/:bookingId", requireOwnerSignin, changeVerificationStatus);
router.delete("/:bookingId", requireOwnerSignin, isBookingOwner, deleteBooking);

router.param("busSlug", busBySlug);
router.param("bookingId", bookingById);

export default router;
