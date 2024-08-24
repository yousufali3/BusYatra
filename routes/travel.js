import express from "express";
import { requireSuperadminSignin } from "../controller/auth-owner.js";
import {
  add,
  update,
  read,
  remove,
  getTravels,
  travelById,
} from "../controller/travel.js";

const router = express.Router();

router.route("/").get(getTravels).post(requireSuperadminSignin, add);

router
  .route("/:id")
  .get(requireSuperadminSignin, read)
  .put(requireSuperadminSignin, update)
  .delete(requireSuperadminSignin, remove);

router.param("id", travelById);

export default router;
