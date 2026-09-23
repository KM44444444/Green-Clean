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
