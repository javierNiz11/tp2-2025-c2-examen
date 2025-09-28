import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoute.js";
import listingsRoutes from "./routes/listingsRouter.js";

import cors from "cors";

const app = express();

// Middlewars
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/listings", listingsRoutes);

// Ruta base
app.get("/", (req, res) => {
    res.json({
        message: "API TP2 - Examen 2025 C2"
    });
});

export default app;