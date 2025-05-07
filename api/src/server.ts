import { Request, Response } from 'express'
import { createPinNew } from './models/pins';
require('dotenv').config();

const express = require('express')
const cors = require('cors');
const app = express()
app.use(cors()); // Moved here

const port = process.env.PORT || '3000'
const multer = require('multer')
const path = require('path');
const fs = require('fs');

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

app.use(express.json());  // ✅ Allows Express to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // ✅ Allows parsing of form data

const fileStorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
        cb(null, './uploads');
    },
    //!here
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
        cb(null, `${file.originalname}`)
    }
});

export const upload = multer({ storage: fileStorageEngine });

// ✅ Test Upload Route (Step 1: Save Image)
app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded!" });
        }

        res.status(201).json({
            message: "File uploaded successfully",
            filePath: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error("❌ Error uploading file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.use('/uploads', express.static('uploads'));

// ✅ Import and Use Routes
const pinRoutes = require('./routes/pin');
const authRoutes = require('./routes/authentication');
import otpRoutes from './routes/otp';

app.use('/', pinRoutes);
app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);

require('./startup/routes')(app);
app.listen(port, () => console.log(`Server running on port ${port}`))