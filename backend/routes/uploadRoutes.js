const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router(); // <-- THIS WAS MISSING

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderName = req.query.folder; // ✅ SAFE

        if (!folderName) {
            return cb(new Error("Folder name is required"));
        }

        const folderPath = path.join(__dirname, "../uploads", folderName);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});


const upload = multer({ storage });

// CREATE FOLDER
router.post("/create-folder", (req, res) => {
    const { folderName } = req.body;

    if (!folderName) {
        return res.status(400).json({ message: "Folder name required" });
    }

    const folderPath = path.join(__dirname, "../uploads", folderName);

    if (fs.existsSync(folderPath)) {
        return res.status(400).json({ message: "Folder already exists" });
    }

    fs.mkdirSync(folderPath);

    res.status(201).json({
        message: "Folder created successfully",
        folder: folderName
    });
});

// UPLOAD FILE
router.post("/upload", upload.single("file"), (req, res) => {
    res.json({ message: "File uploaded successfully" });
});

// LIST FOLDERS
router.get("/folders", (req, res) => {
    const basePath = path.join(__dirname, "../uploads");

    if (!fs.existsSync(basePath)) {
        return res.json([]);
    }

    const folders = fs.readdirSync(basePath);
    res.json(folders);
});

module.exports = router;