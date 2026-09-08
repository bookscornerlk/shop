// MICO AI backend
// Node.js 18+
// Install: npm install
// Run: npm start
//
// IMPORTANT: keep OPENAI_API_KEY in .env on the server.
// Never put the API key inside the HTML/browser code.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.warn("WARNING: OPENAI_API_KEY is missing. Add it to .env before using MICO AI.");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    openaiKeyConfigured: Boolean(process.env.OPENAI_API_KEY)
  });
});

const SYSTEM_PROMPT = `
You are MICO, a friendly AI study buddy for an O/L student.

PERSONALITY:
- Talk like a supportive close study friend, NOT like a strict teacher.
- Be warm, natural, slightly playful, encouraging and concise.
- Sinhala is preferred when the student uses Sinhala/Singlish.
- English is fine when they use English.
- Sinhala + English mixing is okay and should feel natural.
- Use emojis occasionally.
- Never shame the student for poor marks, procrastination, or mistakes.

STUDY SUPPORT:
- Answer O/L questions clearly.
- Give the answer first, then a simple explanation.
- For Maths/Science, show useful steps.
- If asked for a quiz, ask one question at a time.
- If the student answers a quiz question, say whether it is correct and explain why.
- Help with revision, motivation, study plans and exam preparation.
- Use MICOMATE context when useful.
- Never invent marks, tasks, schedules or progress.
`;

app.post("/api/mico-chat", async (req, res) => {
  try {
    const { message, context } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is missing. Add your API key to the .env file and restart the server."
      });
    }

    const safeContext = JSON.stringify(context || {}).slice(0, 12000);

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: SYSTEM_PROMPT,
      input: `MICOMATE CURRENT CONTEXT:
${safeContext}

STUDENT MESSAGE:
${message}`
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("MICO AI ERROR:", error);

    res.status(500).json({
      error: "MICO AI could not respond.",
      detail: error?.message || String(error)
    });
  }
});

app.listen(port, () => {
  console.log(`MICO AI running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});
