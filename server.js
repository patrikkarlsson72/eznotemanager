const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

const uploadDirectory = 'uploads';

// Ensure the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
  console.log(`Directory created: ${uploadDirectory}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('upload'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({
    uploaded: true,          // Explicitly state that the upload was successful
    fileName: req.file.filename, // Optional, but can be useful
    url: fileUrl,            // The URL to the uploaded image
  });
});


app.use('/uploads', express.static(path.join(__dirname, uploadDirectory)));

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
