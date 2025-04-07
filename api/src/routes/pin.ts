import express from 'express';
import { authenticateToken, requirePermission } from '../middleware/authMiddleware';
import {
  createPinNew,
  getAllPinsNew,
  deletePinNew,
  updatePinNew,
  getPinById,
} from '../models/pins';

import { requireOwnershipOrPermission } from '../middleware/requireOwnershipOrPermission';
import { upload } from '../server';


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

// new create pin NEW
router.post('/pinNew', upload.single('file'), async (req: express.Request, res: express.Response) => {
    try {
        //if (!req.file) {
        //    return res.status(400).json({ error: "No image received!" });
        //}

        if (!req.body.name || !req.body.date) {
            return res.status(400).json({ error: "Missing required fields: name or date" });
        }


        // ✅ Construct the image URL
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // ✅ Ensure imageUrl is passed to createPinNew
        const newPin = await createPinNew(
            req.body.name,
            req.body.description,
            req.body.date,
            req.body.tag,
            Number(req.body.longitude),
            Number(req.body.latitude),
            imageUrl // ✅ Now imageUrl is correctly defined
        );

        res.status(201).json(newPin);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }

    const user_id = req.user?.user_id;
    if (typeof user_id !== 'number') {
      return res.status(401).json({ error: "Unauthorized: user ID missing" });
    }

    const newPin = await createPinNew(name, text_description, dateBegin, label, Number(longitude), Number(latitude), user_id);
    res.status(201).json(newPin);
  } catch (error) {
    console.error("Error creating pin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a pin by ID (edit_own_post OR edit_all_posts)
router.put(
  '/pinnew',
  authenticateToken,
  requireOwnershipOrPermission({
    fetchResource: getPinById,
    permissionOwn: 'edit_own_post',
    permissionAll: 'edit_all_posts',
    extractUserId: (pin) => pin.user_id!,
    idSource: 'query',
    idKey: 'pin_id',
  }),
  async (req, res) => {
    try {
      const { pin_id } = req.query;
      const { name, text_description, dateBegin, label, longitude, latitude } = req.body;

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
  }
);

// Delete a pin by ID (delete_own_pin OR delete_all_pins)
router.delete(
  '/pinnew',
  authenticateToken,
  requireOwnershipOrPermission({
    fetchResource: getPinById,
    permissionOwn: 'delete_own_pin',
    permissionAll: 'delete_all_pins',
    extractUserId: (pin) => pin.user_id!,
    idSource: 'query',
    idKey: 'pin_id',
  }),
  async (req, res) => {
    try {
      const { pin_id } = req.query;

      await deletePinNew(Number(pin_id));
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting pin:", error);
      res.status(500).json({ error: "Failed to delete pin" });
    }
  }
);

module.exports = router;
