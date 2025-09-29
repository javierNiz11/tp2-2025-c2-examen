import express from "express";
import { getAllListings, getListingById } from "../controllers/listingsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, getAllListings);
router.get("/:id", authMiddleware, getListingById);

export default router;
