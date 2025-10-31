import express from "express";
import {
    getAllListings,
    getListingId,
    getListingsByPropertyTypeController, // TAREA 1
    getListingsWithTotalPriceController, // TAREA 2
    getListingsByHostIdController,       // TAREA 3
    updateListingAvailabilityController, // TAREA 4
    getTopHostsController                // TAREA 5
} from "../controllers/listingsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- RUTAS BASE (YA EXISTENTES) ---
// Protegidas con authMiddleware
router.get("/", authMiddleware, getAllListings);

// --- INICIO DE NUEVAS RUTAS PARA EL EXAMEN ---
// Todas deben estar protegidas con authMiddleware, como pidió el Líder Técnico

/**
 * IMPORTANTE:
 * Las rutas específicas (como 'property-type', 'with-total-price', 'top-hosts')
 * deben ir ANTES de la ruta dinámica '/:id' para evitar conflictos.
 */

/**
 * TAREA 1: Endpoint para obtener propiedades por tipo de alojamiento
 * Formato: GET /api/listings/property-type/:type
 */
router.get("/property-type/:type", authMiddleware, getListingsByPropertyTypeController);

/**
 * TAREA 2: Endpoint para obtener propiedades con precio total calculado
 * Formato: GET /api/listings/with-total-price
 */
router.get("/with-total-price", authMiddleware, getListingsWithTotalPriceController);

/**
 * TAREA 3: Endpoint para obtener propiedades por host específico
 * Formato: GET /api/listings/host/:host_id
 */
router.get("/host/:host_id", authMiddleware, getListingsByHostIdController);

/**
 * TAREA 5: Endpoint para obtener un ranking de hosts
 * Formato: GET /api/listings/top-hosts
 */
router.get("/top-hosts", authMiddleware, getTopHostsController);


// --- RUTAS DINÁMICAS (VAN AL FINAL) ---

/**
 * RUTA BASE DINÁMICA: Obtener una propiedad por ID
 * Esta ruta debe ir después de las rutas específicas.
 */
router.get("/:id", authMiddleware, getListingId);

/**
 * TAREA 4: Endpoint para actualizar la disponibilidad de una propiedad (PATCH)
 * Formato: PATCH /api/listings/:id
 */
router.patch("/:id", authMiddleware, updateListingAvailabilityController);


export default router;

