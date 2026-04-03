require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const vision = require('@google-cloud/vision');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Creates a Google Cloud Vision client
const client = new vision.ImageAnnotatorClient();

app.use(cors());
app.use(express.json());

// In-memory upload count { userId: { dateString: count } }
const uploadCounts = {};

// Get YYYY-MM-DD string from Date
function getDateString(date) {
  return date.toISOString().slice(0, 10);
}

// Check if image contains garbage labels
async function checkImageForGarbage(filePath) {
  const [result] = await client.labelDetection(filePath);
  const labels = result.labelAnnotations;

  const garbageKeywords = ['garbage', 'trash', 'waste', 'dump', 'refuse'];

  for (let label of labels) {
    if (garbageKeywords.includes(label.description.toLowerCase())) {
      return true;
    }
  }
  return false;
}

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.post('/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'defaultUser';
    const today = getDateString(new Date());

    if (!uploadCounts[userId]) uploadCounts[userId] = {};
    if (!uploadCounts[userId][today]) uploadCounts[userId][today] = 0;

    if (uploadCounts[userId][today] >= 2) {
      return res.status(400).json({ error: "Upload limit reached for today." });
    }

    const filePath = req.file.path;

    // Check if photo is garbage using Vision API
    const isGarbage = await checkImageForGarbage(filePath);
    if (!isGarbage) {
      return res.status(400).json({ error: "Please upload photos of garbage only." });
    }

    uploadCounts[userId][today]++;

    res.json({ message: 'Photo uploaded and validated successfully', uploadsToday: uploadCounts[userId][today] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
