import express from 'express';
import {
    createPin,
    // getPins,
    getPin,
    updatePin,
    deletePin,
    createPinNew,
    getAllPinsNew,
} from '../models/pins';

const router = express.Router();

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
router.put('/:pin_id', async (req: express.Request, res: express.Response) => {
    try {
        // @ts-ignore
        const comment = await updatePin(Number(req.params.pin_id), ...req.body.content);
        res.status(200).json(comment);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// Delete pin
router.delete('/:pin_id', async (req: express.Request, res: express.Response) => {
    try {
        const comment = await deletePin(Number(req.params.pin_id));
        res.status(204).json(comment);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json(`Internal server error: ${error.message}`);
        } else {
            res.status(500).json('Internal server error: An unknown error occurred');
        }
    }
});

// new create pin NEW
router.post('/pinnew', async (req: express.Request, res: express.Response) => {
    try {
        const newPin = await createPinNew(req.body.name, req.body.description, req.body.date, req.body.tag, Number(req.body.longitude), Number(req.body.latitude));
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

module.exports = router;