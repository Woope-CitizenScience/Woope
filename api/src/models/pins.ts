import { Pin, PinNew } from "../interfaces/pin";
const pool = require('../db');

// Old Pins

// export const createPin = async (pin_id: number, user_id: number, longitude: number,
//     latitude: number, metadata?: string): Promise<Pin> => {
//     const { rows } = await pool.query(
//         'INSERT INTO pins (pin_id, user_id, longitude, latitude, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//         [pin_id, user_id, longitude, latitude, metadata]
//     );
//     return rows[0];
// }

// export const getPins = async (): Promise<Pin[]> => {
//     const query = 'select longitude, latitude from pins';
//     const { rows } = await pool.query(query, []);
//     return rows;
// }

// export const getPin = async (pin_id: number): Promise<Pin> => {
//     const query = 'select longitude, latitude from pins';
//     const { rows } = await pool.query(query, [pin_id]);
//     return rows[0];
// }

// export const updatePin = async (pin_id: number, longitude: number,
//     latitude: number, metadata?: string): Promise<Pin> => {
//     const { rows } = await pool.query(
//         `UPDATE pins SET longitude = $2 latitude = $3 
//         metadata = $4 WHERE pin_id = $1 RETURNING *`,
//         [pin_id, longitude, latitude, metadata]
//     );
//     return rows[0];
// }

// export const deletePin = async (pin_id: number): Promise<void> => {
//     console.log("Delete pin called");
//     await pool.query(
//         'DELETE FROM pins WHERE pin_id = $1',
//         [pin_id]
//     );
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// New Pins 2024

/**
 * Creates a new pin.
 * @param {string} name - The name of the pin.
 * @param {string} text_description - A description of the pin.
 * @param {Date} dateBegin - The starting date associated with the pin.
 * @param {string} label - A label categorizing the pin.
 * @param {number} longitude - The longitude coordinate of the pin.
 * @param {number} latitude - The latitude coordinate of the pin.
 * @returns {Promise<PinNew>} The newly created pin.
 * @throws {Error} Throws an error if the database operation fails.
 */

export const createPinNew = async (
    name: string,
    text_description: string,
    dateBegin: Date,
    label: string,
    longitude: number,
    latitude: number,
    imageUrl: String | null,
): Promise<PinNew> => {
    try {
        const response = await pool.query(
            `INSERT INTO public.pins (name, text_description, dateBegin, label, longitude, latitude, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [name, text_description, dateBegin, label, longitude, latitude, imageUrl]
        );

        console.log('Created Pin:', response.rows[0]); // Debug log for the created pin
        return response.rows[0];
    } catch (error) {
        console.error('Error creating pin', error);
        throw error;
    }
};



// pinModel.ts

export const getAllPinsNew = async (): Promise<PinNew> => {
    try {
        const queryText = `SELECT pin_id, name, text_description, datebegin, label, longitude, latitude, image_url FROM public.pins ORDER BY pin_id ASC`;
        const { rows } = await pool.query(queryText); // Ensure no second argument is passed
        return rows;

    }
    catch (error) {

        throw new Error("Error retrieving organizations: " + (error as Error).message);
    }
};


// Does not return anything
/**
 * Deletes a pin by its ID.
 * @param {number} pin_id - The ID of the pin to be deleted.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the deletion fails.
 */

export const deletePinNew = async (pin_id: number): Promise<void> => {
    try {
        await pool.query('DELETE FROM pins WHERE pin_id = $1', [pin_id]);
    } catch (error) {
        console.error('Error executing SQL DELETE:', error);
        throw error;
    }
};

/**
 * Updates an existing pin by its ID.
 * @param {number} pin_id - The ID of the pin to update.
 * @param {string} name - The updated name of the pin.
 * @param {string} text_description - The updated description of the pin.
 * @param {Date} dateBegin - The updated start date.
 * @param {string} label - The updated label for the pin.
 * @param {number} longitude - The updated longitude coordinate.
 * @param {number} latitude - The updated latitude coordinate.
 * @returns {Promise<PinNew>} The updated pin.
 * @throws {Error} Throws an error if the update fails or the pin is not found.
 */

export const updatePinNew = async (
    pin_id: number,
    name: string,
    text_description: string,
    dateBegin: Date,
    label: string,
    longitude: number,
    latitude: number
): Promise<PinNew> => {
    try {
        console.log('Executing SQL UPDATE for pin ID:', pin_id);
        console.log('Update Values:', {
            name,
            text_description,
            dateBegin,
            label,
            longitude,
            latitude,
        });

        const queryText = `
            UPDATE public.pins
            SET 
                name = $1,
                text_description = $2,
                dateBegin = $3,
                label = $4,
                longitude = $5,
                latitude = $6
            WHERE pin_id = $7
            RETURNING *;
        `;

        const values = [name, text_description, dateBegin, label, longitude, latitude, pin_id];
        const { rows } = await pool.query(queryText, values);

        if (rows.length === 0) {
            console.error(`No pin found with ID: ${pin_id}`);
            throw new Error(`Pin with id ${pin_id} not found`);
        }

        console.log('SQL UPDATE Successful. Updated Row:', rows[0]);
        return rows[0];
    } catch (error) {
        console.error('Error executing SQL UPDATE:', error);
        throw error;
    }
};

export const getPinById = async (pin_id: number): Promise<PinNew | null> => {
    try {
      const queryText = `SELECT * FROM public.pins WHERE pin_id = $1`;
      const { rows } = await pool.query(queryText, [pin_id]);
  
      if (rows.length === 0) return null;
      return rows[0];
    } catch (error) {
      console.error("Error retrieving pin by ID:", error);
      throw error;
    }
  };