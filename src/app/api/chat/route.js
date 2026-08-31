import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    // 1. Automatically read ALL JSON files from src/data folder
    const dataDir = path.join(process.cwd(), "src", "data");
    const filenames = fs.readdirSync(dataDir);
    
    let combinedData = {};

    filenames.forEach((filename) => {
      if (filename.endsWith(".json")) {
        const filePath = path.join(dataDir, filename);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const keyName = filename.replace(".json", ""); // e.g. "products", "site", "contact-us"
        try {
          combinedData[keyName] = JSON.parse(fileContent);
        } catch (err) {
          console.error(`Error parsing ${filename}:`, err);
        }
      }
    });

    const companyContext = JSON.stringify(combinedData);

    // 2. System Instructions for Gemini
    const systemInstruction = `
      You are SpotOptics AI, a technical customer support assistant for SpotOptics S.r.l. 
      Use ONLY the following company JSON data to answer user questions:
      ${companyContext}
      
      Instructions:
      1. Be polite, clear, and professional.
      2. Answer naturally based on the products, specs, downloads, and contact details provided in the data.
      3. Keep answers concise (2-4 sentences max).
      4. If the requested information is NOT in the data, politely ask them to contact support at contact@spot-optics.com[cite: 8].
    `;

    // 3. Gemini API Call using Official SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash", 
      systemInstruction: systemInstruction 
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { reply: "Sorry, I am facing a temporary technical issue. Please try again in a moment." }, 
      { status: 500 }
    );
  }
}