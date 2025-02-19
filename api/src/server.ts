import { Request,Response } from 'express'

const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || '3000'
const multer  = require('multer')

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const fileStorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
        cb(null, './uploads');
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: fileStorageEngine});

app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        res.send('File uploaded successfully');
    } catch (error) {
        console.log(error)
    }
    
    
});

app.use('/uploads', express.static('uploads'));

app.use(cors());

require('./startup/routes')(app);
app.listen(port, () => console.log(`Server running on port ${port}`))