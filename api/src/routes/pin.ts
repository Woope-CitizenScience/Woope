import express from 'express';
import {
    //createPin,
    //getPins,
    //getPin,
    //updatePin,
    //deletePin,
    createPinNew,
    getAllPinsNew,
    deletePinNew,
    updatePinNew,
} from '../models/pins';
import { upload } from '../server';



const router = express.Router();

// Old pins

// Create a new pin
// router.post('/', async (req: express.Request, res: express.Response) => {
//     try {
//         // @ts-ignore
//         const newPin = await createPin(...req.body);
//         res.status(201).json(newPin);
//     } catch (error) {
//         if (error instanceof Error) {
//             res.status(500).json(`Internal server error: ${error.message}`);
//         } else {
//             res.status(500).json('Internal server error: An unknown error occurred');
//         }
//     }
// });

// Get all pins
// router.get('/get', async (req: express.Request, res: express.Response) => {
//     try {
//         const pins = await getPins();
//         res.status(200).json(pins);
//     } catch (error) {
//         if (error instanceof Error) {
//             res.status(500).json(`Internal server error: ${error.message}`);
//         } else {
//             res.status(500).json('Internal server error: An unknown error occurred');
//         }
//     }
// });

// // Get pin for pin id
// router.get('/:pin_id', async (req: express.Request, res: express.Response) => {
//     try {
//         const pin = await getPin(Number(req.params.pin_id));
//         res.status(200).json(pin);
//     } catch (error) {
//         if (error instanceof Error) {
//             res.status(500).json(`Internal server error: ${error.message}`);
//         } else {
//             res.status(500).json('Internal server error: An unknown error occurred');
//         }
//     }
// });

// Update pin
// router.put('/:pin_id', async (req: express.Request, res: express.Response) => {
//     try {
//         // @ts-ignore
//         const comment = await updatePin(Number(req.params.pin_id), ...req.body.content);
//         res.status(200).json(comment);
//     } catch (error) {
//         if (error instanceof Error) {
//             res.status(500).json(`Internal server error: ${error.message}`);
//         } else {
//             res.status(500).json('Internal server error: An unknown error occurred');
//         }
//     }
// });

// Delete pin
// router.delete('/:pin_id', async (req: express.Request, res: express.Response) => {
//     try {
//         const comment = await deletePin(Number(req.params.pin_id));
//         res.status(204).json(comment);
//     } catch (error) {
//         if (error instanceof Error) {
//             res.status(500).json(`Internal server error: ${error.message}`);
//         } else {
//             res.status(500).json('Internal server error: An unknown error occurred');
//         }
//     }
// });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// New Pins 2024

// new create pin NEW
router.post('/pinNew', upload.single('file'), async (req: express.Request, res: express.Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image received!" });
        }

        // ✅ Construct the image URL
        const imageUrl = `/uploads/${req.file.filename}`;

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
});

// Route to get all pins
router.get('/pinnew', async (req: express.Request, res: express.Response) => {
    console.log("GET /pinnew called (route)");
    try {
        const pins = await getAllPinsNew();
        res.status(200).json(pins);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred (route)');
        }
    }
});

router.delete('/pinnew', async (req: express.Request, res: express.Response) => {
    try {
        const pinIdRaw = req.query.pin_id; // Get the raw query param
        const pinId = Number(pinIdRaw);   // Convert to number

        // console.log('Received pin_id:', pinIdRaw); // Debug raw input
        // console.log('Parsed pin_id as number:', pinId); // Debug parsed number

        await deletePinNew(pinId);
        res.status(204).end();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

router.put('/pinnew', async (req: express.Request, res: express.Response) => {
    // console.log('PUT request received at /pinnew');
    // console.log('Query Params:', req.query);
    // console.log('Body:', req.body);

    const { pin_id } = req.query; // Correctly use query params
    const { name, text_description, dateBegin, label, longitude, latitude } = req.body;

    // console.log('Received PUT request at /pins/pinnew'); // Log request arrival
    // console.log('Query Parameters:', req.query); // Log query parameters
    // console.log('Request Body:', req.body); // Log request body

    try {
        // Validate pin_id
        if (!pin_id || isNaN(Number(pin_id))) {
            console.error(`Invalid pin ID: ${pin_id}`);
            return res.status(400).json({ error: `Invalid pin ID: ${pin_id}` });
        }

        // Call the model function to update the pin
        console.log('Calling updatePinNew with:', {
            pin_id: Number(pin_id),
            name,
            text_description,
            dateBegin,
            label,
            longitude,
            latitude,
        });

        const updatedPin = await updatePinNew(
            Number(pin_id),
            name,
            text_description,
            new Date(dateBegin),
            label,
            longitude,
            latitude
        );

        //console.log('Updated Pin:', updatedPin); // Log the response from the model
        res.status(200).json(updatedPin);
    } catch (error) {
        console.error('Error updating pin:', error);
        res.status(500).json({ error: 'Failed to update pin' });
    }
});


module.exports = router;