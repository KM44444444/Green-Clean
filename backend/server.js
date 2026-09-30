require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// Import routes
const authRoutes = require("./routes/auth");
const reportsRoutes = require("./routes/reports");
const workerRoutes = require("./routes/worker");
const donationsRoutes = require("./routes/donations");
const walletRoutes = require("./routes/wallet");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/donations", donationsRoutes);
app.use("/api/wallet", walletRoutes);

app.post("/upload-photo", upload.single("photo"), async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || "defaultUser";
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ error: "No photo uploaded." });
    }
    res.json({ message: "Photo uploaded successfully", userId });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
