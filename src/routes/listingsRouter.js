import express from "express";
import { getAllListings, getListingId } from "../controllers/listingsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, getAllListings);
router.get("/:id", authMiddleware, getListingId);

export default router;
