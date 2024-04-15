import { Pin } from "../interfaces/pin";

const pool = require('../db');

export const createPin = async (pin_id: number, user_id: number, longitude: number,
    latitude: number, metadata?: string): Promise<Pin> => {
    const { rows } = await pool.query(
        'INSERT INTO pins (pin_id, user_id, longitude, latitude, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [pin_id, user_id, longitude, latitude, metadata]
    );
    return rows[0];
}

export const getPins = async (): Promise<Pin[]> => {
    const query = 'select longitude, latitude from pins';
    const { rows } = await pool.query(query, []);
    return rows;
}

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

export const deletePin = async (pin_id: number): Promise<void> => {
    console.log("Delete pin called");
    await pool.query(
        'DELETE FROM pins WHERE pin_id = $1',
        [pin_id]
    );
}