import express, { Request, Response } from 'express';
import getWeatherData from '../middleware/weather';
const router = express.Router();
router.get('/forecast', async (req: Request, res: Response) => {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);

    if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ message: 'Missing or invalid lat/lon' });
    }

    try {
        const forecastData = await getWeatherData(lat, lon);
        res.json(forecastData);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
module.exports = router;
