const express = require("express");
const multer = require("multer");
const cors = require("cors");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const app = express();
const PORT = process.env.PORT || 5000;


// Configure CORS for GitHub Pages
app.use(cors({
    origin: [
        'https://iamrlz.github.io',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],
    credentials: true
}));

const upload = multer({ dest: "uploads/" });

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

// Health check for Azure deployment
app.get("/health", (req, res) => {
    res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.post(
    "/check-bonds",
    upload.fields([
        { name: "userFile", maxCount: 1 },
        { name: "drawFile", maxCount: 1 },
    ]),
    async (req, res) => {
        let userFile, drawFile;
        try {
            userFile = req.files["userFile"]?.[0];
            drawFile = req.files["drawFile"]?.[0];

            if (!userFile || !drawFile) {
                return res.status(400).json({ error: "Both files are required" });
            }

            const [userBondsRaw, drawResultsRaw] = await Promise.all([
                parseBondFile(userFile),
                parseBondFile(drawFile),
            ]);

            // Extract only valid 6-digit bond numbers
            const normalize = (b) => {
                const match = String(b).match(/\b\d{6}\b/);
                return match ? match[0] : null;
            };

            const userBonds = userBondsRaw
                .map(normalize)
                .filter((b) => b !== null);

            const drawResultsSet = new Set(
                drawResultsRaw.map(normalize).filter((b) => b !== null)
            );

            const matches = userBonds
                .filter((bond) => drawResultsSet.has(bond))
                .map((bond) => ({
                    bondNumber: bond,
                    prize: "Matched",
                }));

            // Debugging (Optional - can be removed in prod)
            console.log("🧾 Total user bonds:", userBonds.length);
            console.log("🏆 Matches:", matches.length);

            fs.unlinkSync(userFile.path);
            fs.unlinkSync(drawFile.path);

            return res.json({
                matches,
                totalUserBonds: userBonds.length,
            });
        } catch (err) {
            console.error("❌ Error in /check-bonds:", err);
            console.error("❌ Stack trace:", err.stack);
            console.error("❌ User file:", userFile ? userFile.originalname : 'None');
            console.error("❌ Draw file:", drawFile ? drawFile.originalname : 'None');
            
            // Clean up files if they exist
            try {
                if (userFile && fs.existsSync(userFile.path)) {
                    fs.unlinkSync(userFile.path);
                }
                if (drawFile && fs.existsSync(drawFile.path)) {
                    fs.unlinkSync(drawFile.path);
                }
            } catch (cleanupErr) {
                console.error("❌ Error cleaning up files:", cleanupErr);
            }
            
            res.status(500).json({ 
                error: "Failed to process files. Please check formats.",
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }
);

// Parse uploaded file content into bond number strings
async function parseBondFile(file) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".xlsx" || ext === ".xls") {
        const workbook = XLSX.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        return data.flat().map((b) => String(b).trim());
    }

    if (ext === ".txt") {
        const content = fs.readFileSync(file.path, "utf-8");
        return content
            .split(/[\n\r\s,]+/)
            .map((b) => b.trim())
            .filter((b) => b.length > 0);
    }

    if (ext === ".pdf") {
        const dataBuffer = fs.readFileSync(file.path);
        const data = await pdfParse(dataBuffer);
        const numbers = data.text.match(/\b\d{4,10}\b/g) || [];
        return numbers.map((b) => b.trim());
    }

    throw new Error("Unsupported file type: " + ext);
}

app.listen(PORT, () => {
    console.log(`✅ Backend running at ${PORT}`);
});
