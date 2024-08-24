import express from "express";
import { ownerById, read, update, getAllOwners } from "../controller/owner.js";
import { requireOwnerSignin, isAuth } from "../controller/auth-owner.js";
import { uploadOwnerAvatar } from "../utils/index.js";

const router = express.Router();

router.get("/", getAllOwners);

router.get("/:ownerId", read);
router.put("/:ownerId", requireOwnerSignin, isAuth, uploadOwnerAvatar, update);

router.param("ownerId", ownerById);

export default router;
