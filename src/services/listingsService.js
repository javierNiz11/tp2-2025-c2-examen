import {
    findAllListings,
    findListingById,
    findListingsByPropertyType,     // TAREA 1
    findListingsWithTotalPrice,     // <-- TAREA 2 (¡ARREGLADO!)
    findListingsByHostId,           // TAREA 3
    patchAvailability,              // TAREA 4
    findTopHosts                    // TAREA 5
} from "../data/listingsData.js";

/**
 * Función base (ya existente)
 */
export const getListings = async (page, pageSize) => {
    return await findAllListings(page, pageSize);
}

/**
 * Función base (ya existente)
 */
export const getListingById = async (id) => {
    return await findListingById(id);
}

// --- INICIO DE NUEVAS FUNCIONES PARA EL EXAMEN ---

/**
 * TAREA 1: Servicio para filtrar por tipo de propiedad
 */
export const getListingsByPropertyType = async (type, page, pageSize) => {
    return await findListingsByPropertyType(type, page, pageSize);
}

/**
 * TAREA 2: Servicio para obtener listings con precio total
 * ¡AQUÍ ESTABA EL BUG!
 */
export const getListingsWithTotalPrice = async (page, pageSize) => {
    // BUG ARREGLADO: El nombre de la función no tenía "All"
    return await findListingsWithTotalPrice(page, pageSize);
}

/**
 * TAREA 3: Servicio para filtrar por ID de host
 */
export const getListingsByHostId = async (hostId, page, pageSize) => {
    return await findListingsByHostId(hostId, page, pageSize);
}

/**
 * TAREA 4: Servicio para actualizar disponibilidad
 */
export const updateAvailability = async (id, availabilityUpdates) => {
    const result = await patchAvailability(id, availabilityUpdates);
    if (result.matchedCount === 0) {
        throw new Error("Propiedad no encontrada para actualizar.");
    }
    return result;
}

/**
 * TAREA 5: Servicio para obtener ranking de top hosts
 */
export const getTopHosts = async (limit) => {
    return await findTopHosts(limit);
}

