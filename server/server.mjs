import express from 'express';
import cors from 'cors';
import { processData } from './info.mjs';
import multer from 'multer';

const app = express();
const port = 3000;

app.use(cors());

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/uploads', upload.single('file'), (req, res) => {
  res.send('file uploaded ！');
});

app.get('/', async (req, res) => {
  try {
    const summary = await processData();
    res.json(summary);
    console.log('succeed info');
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
