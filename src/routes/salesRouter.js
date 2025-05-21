import express from "express";
import { getAllSales } from "../controllers/salesController.js";

const router = express.Router();
router.get("/", getAllSales);

export default router;
