import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createPinNew,
    getAllPinsNew,
    deletePinNew,
    updatePinNew,
} from '../models/pins';

const router = express.Router();

// Get all pins
router.get('/pinnew', authenticateToken, async (req, res) => {
    try {
        const pins = await getAllPinsNew();
        res.status(200).json(pins);
    } catch (error) {
        console.error("Error fetching pins:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create a new pin 
router.post('/pinnew', authenticateToken, async (req, res) => {
    try {
        const { name, text_description, dateBegin, label, longitude, latitude } = req.body;

        if (!name || !longitude || !latitude) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newPin = await createPinNew(name, text_description, dateBegin, label, Number(longitude), Number(latitude));
        res.status(201).json(newPin);
    } catch (error) {
        console.error("Error creating pin:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update a pin by ID 
router.put('/pinnew', authenticateToken, async (req, res) => {
    try {
        const { pin_id } = req.query;
        const { name, text_description, dateBegin, label, longitude, latitude } = req.body;

        if (!pin_id || isNaN(Number(pin_id))) {
            return res.status(400).json({ error: "Invalid or missing pin_id" });
        }

        const updatedPin = await updatePinNew(
            Number(pin_id),
            name,
            text_description,
            new Date(dateBegin),
            label,
            Number(longitude),
            Number(latitude)
        );

        res.status(200).json(updatedPin);
    } catch (error) {
        console.error("Error updating pin:", error);
        res.status(500).json({ error: "Failed to update pin" });
    }
});

// Delete a pin by ID
router.delete('/pinnew', authenticateToken, async (req, res) => {
    try {
        const { pin_id } = req.query;

        if (!pin_id || isNaN(Number(pin_id))) {
            return res.status(400).json({ error: "Invalid or missing pin_id" });
        }

        await deletePinNew(Number(pin_id));
        res.status(204).end();
    } catch (error) {
        console.error("Error deleting pin:", error);
        res.status(500).json({ error: "Failed to delete pin" });
    }
});

module.exports = router;