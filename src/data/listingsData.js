import { getDb } from "./connection.js";
// No necesitamos ObjectId para esta colección, ya que los _id son strings
// import { ObjectId } from "mongodb";

/**
 * Función base (ya existente)
 * Busca todos los listings con paginación
 */
export async function findAllListings(page, pageSize) {
    const db = getDb();
    if (page && pageSize) {
        const skip = (page - 1) * pageSize;
        const listings = await db.collection("listingsAndReviews")
            .find()
            .skip(skip)
            .limit(pageSize)
            .toArray();
        return listings;
    } else {
        // Sin paginación: trae todos los documentos (¡cuidado con esto en producción!)
        const listings = await db.collection("listingsAndReviews").find().toArray();
        return listings;
    }
}

/**
 * Función base (ya existente)
 * Busca un listing por su _id (que es un string en esta DB)
 */
export async function findListingById(id) {
    const db = getDb();
    // El _id en esta colección es un String, no un ObjectId
    const listing = await db.collection("listingsAndReviews").findOne({ _id: id });
    return listing;
}

// --- INICIO DE NUEVAS FUNCIONES PARA EL EXAMEN ---

/**
 * TAREA 1: Filtrar por tipo de propiedad (property_type)
 * Implementa paginación
 */
export async function findListingsByPropertyType(type, page, pageSize) {
    const db = getDb();
    const query = { property_type: type };
    const skip = (page - 1) * pageSize;

    const listings = await db.collection("listingsAndReviews")
        .find(query)
        .skip(skip)
        .limit(pageSize)
        .toArray();
    
    // También contamos el total de documentos para ayudar a la paginación del frontend
    const total = await db.collection("listingsAndReviews").countDocuments(query);

    return { listings, total };
}

/**
 * TAREA 2: Calcular precio total (totalPrice)
 * Se usa un pipeline de agregación de MongoDB ($project)
 * Implementa paginación
 */
export async function findListingsWithTotalPrice(page, pageSize) {
    const db = getDb();
    const skip = (page - 1) * pageSize;

    // $ifNull se usa para tratar los campos faltantes (cleaning_fee, etc.) como 0
    const pipeline = [
        {
            $project: {
                _id: 1, // Incluir el _id
                name: 1, // Incluir el nombre
                property_type: 1, // Incluir el tipo
                price: 1, // Incluir el precio base
                // ... incluir otros campos que quieras retornar ...
                images: 1,
                address: 1,
                host: 1,

                // TAREA 2: Creación del campo 'totalPrice'
                totalPrice: {
                    $add: [
                        { $ifNull: ["$price", 0] },
                        { $ifNull: ["$cleaning_fee", 0] },
                        { $ifNull: ["$security_deposit", 0] },
                        { $ifNull: ["$extra_people", 0] }
                    ]
                }
            }
        },
        { $skip: skip },
        { $limit: pageSize }
    ];

    const listings = await db.collection("listingsAndReviews").aggregate(pipeline).toArray();
    const total = await db.collection("listingsAndReviews").countDocuments(); // Total de todos los listings

    return { listings, total };
}

/**
 * TAREA 3: Filtrar por ID de host (host.host_id)
 * Implementa paginación
 */
export async function findListingsByHostId(hostId, page, pageSize) {
    const db = getDb();
    // Buscamos dentro del objeto 'host'
    const query = { "host.host_id": hostId }; 
    const skip = (page - 1) * pageSize;

    const listings = await db.collection("listingsAndReviews")
        .find(query)
        .skip(skip)
        .limit(pageSize)
        .toArray();
    
    const total = await db.collection("listingsAndReviews").countDocuments(query);

    return { listings, total };
}

/**
 * TAREA 4: Actualizar disponibilidad (PATCH)
 * ¡¡AQUÍ ESTABA EL BUG!!
 * El _id NO es un ObjectId, es un String.
 */
export async function patchAvailability(id, availabilityUpdates) {
    const db = getDb();

    // BUG ARREGLADO: El _id es un String, no necesitamos new ObjectId(id)
    const filter = { _id: id }; 

    // Construimos el objeto de actualización para $set
    // Esto asegura que solo actualicemos los campos dentro de 'availability'
    const updateDoc = {
        $set: {}
    };

    // Mapeamos los campos del body a la estructura de la DB
    if (availabilityUpdates.available_30 !== undefined) {
        updateDoc.$set["availability.availability_30"] = availabilityUpdates.available_30;
    }
    if (availabilityUpdates.available_60 !== undefined) {
        updateDoc.$set["availability.availability_60"] = availabilityUpdates.available_60;
    }
    if (availabilityUpdates.available_90 !== undefined) {
        updateDoc.$set["availability.availability_90"] = availabilityUpdates.available_90;
    }
    if (availabilityUpdates.available_365 !== undefined) {
        updateDoc.$set["availability.availability_365"] = availabilityUpdates.available_365;
    }

    // Si no se proporcionaron campos válidos, no hacemos nada
    if (Object.keys(updateDoc.$set).length === 0) {
        throw new Error("No se proporcionaron campos de disponibilidad válidos para actualizar.");
    }

    const result = await db.collection("listingsAndReviews").updateOne(filter, updateDoc);

    return result;
}

/**
 * TAREA 5: Ranking de Top Hosts
 * Se usa un pipeline de agregación ($group, $sort, $limit)
 */
export async function findTopHosts(limit) {
    const db = getDb();

    const pipeline = [
        {
            // 1. Agrupar por host_id y contar propiedades
            $group: {
                _id: "$host.host_id", // Agrupar por host_id
                host_name: { $first: "$host.host_name" }, // Tomar el nombre del host
                host_picture_url: { $first: "$host.host_picture_url" }, // Tomar la foto
                propiedadCount: { $sum: 1 } // Contar cuántas propiedades tiene cada uno
            }
        },
        {
            // 2. Ordenar de mayor a menor
            $sort: {
                propiedadCount: -1 // -1 para orden descendente
            }
        },
        {
            // 3. Limitar al número solicitado
            $limit: limit
        },
        {
            // 4. (Opcional) Renombrar el _id para que sea más claro
            $project: {
                _id: 0, // No incluir el _id
                host_id: "$_id", // Renombrar _id a host_id
                host_name: 1,
                host_picture_url: 1,
                propiedadCount: 1
            }
        }
    ];

    const ranking = await db.collection("listingsAndReviews").aggregate(pipeline).toArray();
    return ranking;
}

