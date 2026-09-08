// MICOMATE static server — AI/chat removed.
// Node.js 18+

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, ai: false });
});

app.listen(port, () => {
  console.log(`MICOMATE running at http://localhost:${port}`);
});
