const express = require("express");
const multer = require("multer");
const cors = require("cors");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post(
    "/check-bonds",
    upload.fields([
        { name: "userFile", maxCount: 1 },
        { name: "drawFile", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const userFile = req.files["userFile"]?.[0];
            const drawFile = req.files["drawFile"]?.[0];

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
            res.status(500).json({ error: "Failed to process files" });
        }
    }
);

// Parse uploaded file content into bond number strings
function parseBondFile(file) {
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
        return pdfParse(dataBuffer).then((data) => {
            const numbers = data.text.match(/\b\d{4,10}\b/g) || [];
            return numbers.map((b) => b.trim());
        });
    }

    throw new Error("Unsupported file type: " + ext);
}

app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});
