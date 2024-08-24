import express from "express";
import { requireOwnerSignin, isPoster } from "../controller/auth-owner.js";
import {
  read,
  create,
  update,
  remove,
  busBySlug,
  getBuses,
  searchBus,
  searchBusByFilter,
  getAvailableBusesOfOwner,
  getUnavailableBusesOfOwner,
  getAllAvailableBuses,
  getAllUnavailableBuses,
} from "../controller/bus.js";
import { uploadBusImage } from "../utils/index.js";

const router = express.Router();

router
  .route("/")
  .get(getBuses)
  .post(requireOwnerSignin, uploadBusImage, create);

router.get(
  "/owner-bus-available",
  requireOwnerSignin,
  getAvailableBusesOfOwner
);
router.get(
  "/owner-bus-unavailable",
  requireOwnerSignin,
  getUnavailableBusesOfOwner
);

router.get("/all-bus-available", getAllAvailableBuses);
router.get("/all-bus-unavailable", getAllUnavailableBuses);

router.get("/search", searchBus);
router.post("/filter", searchBusByFilter);

router
  .route("/:busSlug")
  .get(read)
  .put(requireOwnerSignin, isPoster, uploadBusImage, update)
  .delete(requireOwnerSignin, isPoster, remove);

router.param("busSlug", busBySlug);

export default router;
