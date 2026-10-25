import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Medical Consultant Chatbot API Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          reply: "Namaste! 🙏 I am your Checkmed AI Healthcare Consultant.\n\nI can help you with:\n- 🏥 Locating ICU & Ventilator beds in Kanpur, Gorakhpur, Prayagraj, Varanasi, & Lucknow.\n- 🚑 Live 24x7 Ambulance booking & route ETA estimation.\n- 🎫 Reserving OPD Token Queue numbers to bypass waiting times.\n- 🩺 Primary medical advice & specialist doctor lookup.\n\nHow may I help you today?"
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are "Checkmed AI Health Consultant", a trusted, professional, and empathetic AI healthcare assistant for the Checkmed Hospital & Emergency Network in Uttar Pradesh, India (Kanpur, Gorakhpur, Prayagraj, Varanasi, Lucknow).

Key Responsibilities & Guidelines:
1. Greet users warmly with "Namaste! 🙏".
2. Assist patients with medical symptom queries, specialty doctor recommendations (e.g., Cardiology, Neurology, Pediatrics, Orthopedics), and general medical advice.
3. Inform users about Checkmed Healthcare platform capabilities:
   - Real-time ICU & Ventilator Bed tracking across network hospitals.
   - 24x7 GPS Ambulance dispatch with live road route & ETA estimation.
   - OPD Token Booking & Queue tracker (zero waiting room time).
   - Digital E-Prescription viewer and Blood Bank inventory lookup.
4. Always include a short reminder that for life-threatening emergencies, patients should call 108 or tap the Emergency Ambulance button immediately.
5. Keep responses clear, helpful, structured with bullet points where necessary, and formatted nicely.`;

      const formattedHistory = Array.isArray(history)
        ? history.map((h: { sender: string; text: string }) => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          }))
        : [];

      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "Namaste! I am here to assist you with all Checkmed hospital services and health queries.";
      res.json({ reply });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({
        reply: "Namaste! 🙏 I am currently experiencing a brief connectivity glitch. You can still use Checkmed to track live ICU beds, reserve OPD tokens, or request an emergency ambulance."
      });
    }
  });

  // Vite middleware for development / Static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
