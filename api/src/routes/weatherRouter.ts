import express, { Request, Response } from 'express';
import getWeatherData from '../middleware/weather';
const router = express.Router();
router.get('/forecast', async (req: Request, res: Response) => {
    try {
        const forecastData = await getWeatherData();
        res.json(forecastData);
    } catch (error: unknown) { // Here, error is typed as unknown
        // Now, we need to assert the type of error or check it
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
module.exports = router;
