MICO AI FIXED SETUP

1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Run: npm install
4. Copy .env.example to .env
5. Put your API key in .env:
   OPENAI_API_KEY=your_real_key_here
6. Run: npm start
7. Open exactly:
   http://localhost:3000

Do NOT double-click index.html.

Health check:
http://localhost:3000/api/health

Expected:
{"ok":true,"openaiKeyConfigured":true}
