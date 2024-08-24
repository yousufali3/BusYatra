import express from "express";
import { requireSuperadminSignin } from "../controller/auth-owner.js";
import {
  add,
  update,
  read,
  remove,
  getLocations,
  locationById,
} from "../controller/location.js";

const router = express.Router();

router.route("/").get(getLocations).post(requireSuperadminSignin, add);

router
  .route("/:id")
  .get(requireSuperadminSignin, read)
  .put(requireSuperadminSignin, update)
  .delete(requireSuperadminSignin, remove);

router.param("id", locationById);

export default router;
