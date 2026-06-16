import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

// Lazy initializer for Google GenAI client
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined status. Please configure it in your Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // Server API status route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Next.js Learning Companion Server is online" });
  });

  // AI Tutor prompt endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message } = req.body;
      if (!message) {
        res.status(400).json({ error: "Missing 'message' field in request body." });
        return;
      }

      // Check if API key is defined before initializing
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error: "GEMINI_API_KEY is not configured. Please add your Gemini API Key in the AI Studio Settings (Secrets Manager) to unlock the Interactive AI Tutor.",
        });
        return;
      }

      const ai = getGeminiClient();

      // Format previous conversation into history parts
      const formattedHistory = Array.isArray(history)
        ? history.map((item: any) => ({
            role: item.role === "assistant" ? "model" : "user",
            parts: [{ text: item.content || item.text || "" }],
          }))
        : [];

      // Create a chat session with the teaching instructions
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        history: formattedHistory,
        config: {
          systemInstruction: `You are an elite, full-stack Next.js and frontend engineering mentor. Your purpose is to teach Next.js 15 concepts in an elegant, engaging manner.
Key focus areas:
- Next.js 15 App Router vs Page Router
- React Server Components (RSC) vs Client Components ("use client")
- Server Actions, Progressive Enhancement, and Form submission
- Next.js Caching, Data Fetching, Revalidation (ISR, On-Demand, revalidatePath)
- Routing (Dynamic routes, Route Groups, Catch-all routes, Parallel routes, Intercepting routes)
- Performance (Streaming, Suspense, PPR - Partial Prerendering, Static vs Dynamic)
- Middleware (Matcher, auth overlays, redirections)

Provide concise, pristine React/Typescript code snippets. Highlight Next.js best-practices, folder architecture (e.g., app/dashboard/layout.tsx), and SEO/Metadata API capabilities.
Always be encouraging, educational, and direct. Use Markdown and structure your responses cleanly.
If asked about topics completely unrelated to coding or Next.js, politely pivot back to teaching Next.js.`,
        },
      });

      const result = await chat.sendMessage({ message });
      const text = result.text;

      res.json({ reply: text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: error.message || "An unexpected error occurred while communicating with the AI Tutor.",
      });
    }
  });

  // AI Knowledge Check generator endpoint
  app.post("/api/knowledge-check", async (req, res) => {
    try {
      const { topicTab } = req.body;
      
      // Determine detailed topic content description based on active tab
      let topicDescription = "Next.js 15 Foundations and Routing Patterns";
      let topicTitle = "Next.js Core Concepts";
      
      switch (topicTab) {
        case "roadmap":
          topicDescription = "Next.js 15 App Router fundamentals, Route segments, server-side data fetching, layout and page components, and metadata definition.";
          topicTitle = "Curriculum Roadmap Foundations";
          break;
        case "explorer":
          topicDescription = "Next.js 15 file-system directory structure, special files like template.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx, middleware.ts, and route handlers.";
          topicTitle = "Directory Layout & Architecture";
          break;
        case "rsc":
          topicDescription = "React Server Components (RSC) and Client Components ('use client') boundaries. Rendering context rules, module sharing, and performance benefits of server architecture.";
          topicTitle = "React Server Components (RSC) Boundaries";
          break;
        case "actions":
          topicDescription = "Next.js 15 Server Actions, form submissions using useActionState, useFormStatus for pending state, and optimistic updates with useOptimistic. Progressive enhancement and action security.";
          topicTitle = "Next.js Server Actions & Form Mutations";
          break;
        case "rendering":
          topicDescription = "Next.js 15 Caching pipelines, Full-Route caching, Request Memoization, Data Cache, Router Cache, Partial Prerendering (PPR), dynamic function triggers, and revalidation processes.";
          topicTitle = "Caching Pipelines & Rendering Strategies";
          break;
        default:
          topicDescription = "Next.js 15 full-stack frontend engineering, including components, caching, routes, and Server Actions.";
          topicTitle = "General Next.js Architecture";
      }

      // Check if API key is defined before initializing
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error: "GEMINI_API_KEY is not configured. Please add your Gemini API Key in the AI Studio Settings (Secrets Manager) to unlock generative knowledge checks.",
        });
        return;
      }

      const ai = getGeminiClient();

      // Create structured schema matching Type declarations
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an elite Next.js and frontend engineering mentor. 
Generate a quick 3-question conceptual knowledge check quiz to test an engineer on:
Topic: "${topicTitle}"
Concept Details: "${topicDescription}"

Instructions:
1. Generate EXACTLY 3 technical, challenging, and highly accurate multiple-choice questions.
2. Avoid extremely simple or superficial questions. Aim for concepts that require genuine understanding of Next.js 15 standards.
3. For each question, provide 4 distinct multiple-choice option strings. Only one option should be correct.
4. Correct index must be the exact 0-based index of the correct answer (0, 1, 2, or 3).
5. Provide a solid technical explanation of why that option is correct and why other options are incorrect or incomplete.`,
        config: {
          systemInstruction: "You are a master React and Next.js compiler engineer. Always return valid JSON matching the requested schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topic: { 
                type: Type.STRING,
                description: "The name of the verified curriculum topic."
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "A unique short alphanumeric identifier for this question (e.g. q1)." },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    correctIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ["id", "question", "options", "correctIndex", "explanation"]
                }
              }
            },
            required: ["topic", "questions"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response returned from the model.");
      }

      const checkData = JSON.parse(responseText.trim());
      res.json(checkData);

    } catch (error: any) {
      console.error("Knowledge Check Generation Error:", error);
      res.status(500).json({
        error: error.message || "Failed to compile the dynamic knowledge check quiz.",
      });
    }
  });

  // Vite development middleware vs Static Production routing
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode (Vite middleware)");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode (Static files)");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Server connected and running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
