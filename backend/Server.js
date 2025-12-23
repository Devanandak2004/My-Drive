const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const uploadRoutes = require("./routes/uploadRoutes");
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

app.use("/api", uploadRoutes);

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});