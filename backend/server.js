require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

let client = null;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const vision = require('@google-cloud/vision');
    client = new vision.ImageAnnotatorClient();
  }
} catch (e) {
  console.warn('Google Cloud Vision not configured. Image validation disabled.');
}

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// API Routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const donationRoutes = require('./routes/donations');
const walletRoutes = require('./routes/wallet');
const workerRoutes = require('./routes/worker');

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/worker', workerRoutes);

=======
>>>>>>> origin/main
// In-memory upload count { userId: { dateString: count } }
const uploadCounts = {};

// Get YYYY-MM-DD string from Date
function getDateString(date) {
  return date.toISOString().slice(0, 10);
}

// Check if image contains garbage labels
async function checkImageForGarbage(filePath) {
  if (!client) return true;
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
