import {
    getListings,
    getListingById,
    getListingsByPropertyType,     // <-- TAREA 1
    getListingsWithTotalPrice,      // <-- TAREA 2
    getListingsByHostId,            // <-- TAREA 3
    updateAvailability,             // <-- TAREA 4
    getTopHosts                     // <-- TAREA 5 (¡ARREGLADO!)
} from "../services/listingsService.js";

/**
 * Función base (ya existente)
 */
export const getAllListings = async (req, res) => {
    try {
        // Validar y parsear paginación
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10; // Default 10

        if (isNaN(page) || page <= 0) {
            return res.status(400).json({ message: "Parámetro 'page' inválido." });
        }
        if (isNaN(pageSize) || pageSize <= 0 || pageSize > 100) {
            return res.status(400).json({ message: "Parámetro 'pageSize' inválido (debe ser entre 1 y 100)." });
        }

        const listings = await getListings(page, pageSize);
        res.json(listings);
    } catch (error) {
        console.log("Error fetching listings: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Función base (modificada para mejor manejo de errores)
 */
export const getListingId = async (req, res) => {
    try {
        const id = req.params.id;
        const listing = await getListingById(id);

        if (!listing) {
            // Si no se encuentra el listing, devolver 404
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }

        res.json(listing);
    } catch (error) {
        console.log("Error fetching listing: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// --- INICIO DE NUEVAS FUNCIONES PARA EL EXAMEN ---

/**
 * TAREA 1: Controlador para filtrar por tipo de propiedad
 */
export const getListingsByPropertyTypeController = async (req, res) => {
    try {
        const type = req.params.type;
        if (!type) {
            return res.status(400).json({ message: "El parámetro 'type' es requerido." });
        }

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

        const { listings, total } = await getListingsByPropertyType(type, page, pageSize);

        if (listings.length === 0) {
            return res.status(404).json({ message: `No se encontraron propiedades de tipo '${type}'` });
        }

        res.json({
            data: listings,
            pagination: {
                page,
                pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        console.log("Error en getListingsByPropertyTypeController: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

/**
 * TAREA 2: Controlador para listings con precio total
 */
export const getListingsWithTotalPriceController = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

        const { listings, total } = await getListingsWithTotalPrice(page, pageSize);

        res.json({
            data: listings,
            pagination: {
                page,
                pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        console.log("Error en getListingsWithTotalPriceController: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

/**
 * TAREA 3: Controlador para filtrar por ID de host
 */
export const getListingsByHostIdController = async (req, res) => {
    try {
        const hostId = req.params.host_id;
        if (!hostId) {
            return res.status(400).json({ message: "El parámetro 'host_id' es requerido." });
        }

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

        const { listings, total } = await getListingsByHostId(hostId, page, pageSize);

        if (listings.length === 0) {
            return res.status(404).json({ message: `No se encontraron propiedades para el host ID '${hostId}'` });
        }

        res.json({
            data: listings,
            pagination: {
                page,
                pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        console.log("Error en getListingsByHostIdController: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

/**
 * TAREA 4: Controlador para actualizar disponibilidad
 */
export const updateListingAvailabilityController = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        // Validar que el body no esté vacío y tenga campos permitidos
        const allowedUpdates = ["available_30", "available_60", "available_90", "available_365"];
        const receivedKeys = Object.keys(updates);
        const validKeys = receivedKeys.filter(key => allowedUpdates.includes(key));

        if (validKeys.length === 0) {
            return res.status(400).json({
                message: "El cuerpo de la solicitud está vacío o no contiene campos válidos para actualizar.",
                allowedFields: allowedUpdates
            });
        }
        
        // Creamos un objeto solo con las keys válidas para evitar inyectar campos no deseados
        const validUpdates = {};
        validKeys.forEach(key => {
            const value = parseInt(updates[key]);
            if (isNaN(value) || value < 0) {
                return res.status(400).json({ message: `El valor para '${key}' debe ser un número positivo.` });
            }
            validUpdates[key] = value;
        });

        const result = await updateAvailability(id, validUpdates);

        res.json({ message: "Disponibilidad actualizada exitosamente", modifiedCount: result.modifiedCount });

    } catch (error) {
        console.log("Error en updateListingAvailabilityController: ", error);
        // Manejar el error de "Propiedad no encontrada" que viene del servicio
        if (error.message === "Propiedad no encontrada para actualizar.") {
            return res.status(404).json({ message: `Propiedad con ID '${req.params.id}' no encontrada.` });
        }
        // Manejar el error de ID inválido que viene de la capa de datos
        if (error.message.includes("ID de propiedad no válido")) {
            return res.status(400).json({ message: "ID de propiedad no válido." });
        }
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

/**
 * TAREA 5: Controlador para obtener ranking de top hosts
 * ¡AQUÍ ESTABA EL BUG!
 */
export const getTopHostsController = async (req, res) => { // <-- BUG ARREGLADO
    try {
        // Validar y parsear el límite
        const limit = req.query.limit ? parseInt(req.query.limit) : 10; // Default 10
        if (isNaN(limit) || limit <= 0 || limit > 50) {
            return res.status(400).json({ message: "Parámetro 'limit' inválido (debe ser entre 1 y 50)." });
        }

        // BUG ARREGLADO: El nombre de la función es 'getTopHosts'
        const ranking = await getTopHosts(limit); 

        if (ranking.length === 0) {
            return res.status(404).json({ message: "No se encontraron datos para generar el ranking." });
        }

        res.json(ranking);
    } catch (error) {
        console.log("Error en getTopHostsController: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

