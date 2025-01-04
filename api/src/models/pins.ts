import { Pin, PinNew } from "../interfaces/pin";
const pool = require('../db');

export const createPin = async (pin_id: number, user_id: number, longitude: number,
    latitude: number, metadata?: string): Promise<Pin> => {
    const { rows } = await pool.query(
        'INSERT INTO pins (pin_id, user_id, longitude, latitude, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [pin_id, user_id, longitude, latitude, metadata]
    );
    return rows[0];
}

// export const getPins = async (): Promise<Pin[]> => {
//     const query = 'select longitude, latitude from pins';
//     const { rows } = await pool.query(query, []);
//     return rows;
// }

export const getPin = async (pin_id: number): Promise<Pin> => {
    const query = 'select longitude, latitude from pins';
    const { rows } = await pool.query(query, [pin_id]);
    return rows[0];
}

export const updatePin = async (pin_id: number, longitude: number,
    latitude: number, metadata?: string): Promise<Pin> => {
    const { rows } = await pool.query(
        `UPDATE pins SET longitude = $2 latitude = $3 
        metadata = $4 WHERE pin_id = $1 RETURNING *`,
        [pin_id, longitude, latitude, metadata]
    );
    return rows[0];
}

// export const deletePin = async (pin_id: number): Promise<void> => {
//     console.log("Delete pin called");
//     await pool.query(
//         'DELETE FROM pins WHERE pin_id = $1',
//         [pin_id]
//     );
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// New Pins 2024


// export const createPinNew = async (name: string, text_description: string, dateBegin: Date, label: string, longitude:number, latitude:number): Promise<PinNew> =>{
//     try{
//         const response  = await pool.query(
//             'INSERT INTO public.pins (name, text_description, dateBegin, label, longitude, latitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//             [name, text_description,dateBegin,label, longitude, latitude]
//         ); 
//         return response.rows[0];
//     }catch (error) {
//         console.error('Error creating pin', error);
//         throw error;
//     }
// }

export const createPinNew = async (
    name: string,
    text_description: string,
    dateBegin: Date,
    label: string,
    longitude: number,
    latitude: number
): Promise<PinNew> => {
    try {
        const response = await pool.query(
            `INSERT INTO public.pins (name, text_description, dateBegin, label, longitude, latitude)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name, text_description, dateBegin, label, longitude, latitude]
        );

        console.log('Created Pin:', response.rows[0]); // Debug log for the created pin
        return response.rows[0];
    } catch (error) {
        console.error('Error creating pin', error);
        throw error;
    }
};


// pinModel.ts
export const getAllPinsNew = async ()  : Promise<PinNew> => {
    try{
    const queryText = `SELECT * FROM public.pins ORDER BY pin_id ASC`;
    const { rows } = await pool.query(queryText); // Ensure no second argument is passed

    return rows;

    }
    catch(error){

        throw new Error("Error retrieving organizations: " + (error as Error).message);
    }
  };

  // Does not return anything
export const deletePinNew = async (pin_id: number): Promise<void> => {
    try {
        await pool.query('DELETE FROM pins WHERE pin_id = $1', [pin_id]);
    } catch (error) {
        console.error('Error executing SQL DELETE:', error);
        throw error;
    }
};
