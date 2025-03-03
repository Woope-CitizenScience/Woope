import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { createPinNew } from './models/pins';

const app = express();
const port = process.env.PORT || '3000';

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json'); // ✅ Force JSON response
    next();
});

app.use(express.json());
app.use(cors());

// ✅ Ensure Uploads Directory Exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('📂 Uploads directory created:', uploadPath);
}

// ✅ Configure Multer Storage
const fileStorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, uploadPath); // Save in `uploads/`
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({ storage: fileStorageEngine });

// ✅ Test Upload Route (Step 1: Save Image)
app.post('/pinnew', upload.single('file'), async (req: Request, res: Response) => {
    console.log("🔵 Received POST request to /pinnew");
    console.log("📩 Request Body:", req.body);
    console.log("🖼️ Uploaded File:", req.file);

    if (!req.file) {
        console.error("❌ No image received!");
        return res.status(400).json({ error: "No image received!" });
    }

    try {
        // Construct the image URL
        const imageUrl = `/uploads/${req.file.filename}`;
        console.log(`✅ Image stored at: ${imageUrl}`);

        // Save pin details to the database
        const newPin = await createPinNew(
            req.body.name,
            req.body.description,
            new Date(req.body.date),
            req.body.tag,
            parseFloat(req.body.longitude),
            parseFloat(req.body.latitude),
            imageUrl  // Store the image URL in the database
        );

        console.log("✅ Pin created successfully:", newPin);
        res.status(201).json(newPin);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Error creating pin:", error.message);

            res.status(500).json({
                error: "Database error",
                message: error.message || "Unknown error",
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined
            });
        } else {
            console.error("❌ Unexpected error:", error);

            res.status(500).json({
                error: "Unexpected error",
                message: "An unknown error occurred."
            });
        }
    }
});

// ✅ Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));