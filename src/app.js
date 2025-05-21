import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoute.js";

import salesRoutes from "./routes/salesRouter.js";
import cors from "cors";

const app = express();

// Middlewars
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Rutas
app.use("/api/users", userRoutes);

app.use("/api/sales", salesRoutes);

// Ruta base
app.get("/", (req, res) => {
    res.json({
        message: "API TP2 - Mflix",
        endpoints: [
            { method: "GET", path: "/api/users", description: "Lista todos los usuarios" },
            { method: "GET", path: "/api/users/:id", description: "Obtiene un usuario por ID" },
            { method: "GET", path: "/api/movies", description: "Lista todas las películas (soporta paginado)" },
            { method: "GET", path: "/api/movies/:id", description: "Obtiene una película por ID" }
        ],
        pagination: {
            endpoint: "/api/movies",
            params: [
                { name: "page", description: "Número de página (opcional, por defecto 1)" },
                { name: "pageSize", description: "Cantidad de películas por página (opcional, por defecto 10)" }
            ]
        }
    });
});

export default app;