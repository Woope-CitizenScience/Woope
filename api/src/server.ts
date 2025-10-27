import { Request, Response } from 'express'
import { createPinNew } from './models/pins';
require('dotenv').config();
import cors, {CorsOptions} from 'cors';
const express = require('express')
const app = express()
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));// Moved here

const port = process.env.PORT || '3000'
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const https = require('https');

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

app.use(express.json());  // ✅ Allows Express to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // ✅ Allows parsing of form data

const fileStorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
        cb(null, './uploads');
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
        cb(null, `${Date.now()}-${file.originalname}`)
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

//HTTPS CHANGES START HERE 
const options = {
    key: fs.readFileSync('./localhost+4-key.pem'),
    cert: fs.readFileSync('./localhost+4.pem')
}

require('./startup/routes')(app);

//start the https listening port
https.createServer(options, app).listen(port, () => {
    console.log(`Secure server running on port ${port}`);
});
// app.listen(port, () => console.log(`Server running on port ${port}`)) // We use https instead