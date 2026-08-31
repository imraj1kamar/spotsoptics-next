import { NextResponse } from "next/server";
import Groq from "groq-sdk"; 
import fs from "fs";
import path from "path";


export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY; 
    if (!apiKey) {
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    // 1. DYNAMIC FILE ROUTING (Smart Technique)
   // 1. DYNAMIC FILE ROUTING (Smart Technique)
    // Hamesha contact details aur site info bhejenge
// 1. DYNAMIC FILE ROUTING (Smart Technique)
    // Hamesha contact details aur site info bhejenge
    let allowedFiles = ["contact-us.json", "site.json"]; 
    const msg = message.toLowerCase();

    // Regex check function: sirf EXACT ALONE words catch karega
    const hasWord = (wordList, text) => {
      return wordList.some(word => new RegExp(`\\b${word}\\b`, 'i').test(text));
    };

    // User ke message ke hisaab se baaki files dynamically add karenge
    if (hasWord(["product", "products", "sensor", "omi", "optino", "instrument"], msg)) {
      allowedFiles.push("products.json"); 
    }
    if (hasWord(["software", "sensoft", "wavefront"], msg)) {
      allowedFiles.push("wavefront-sensor-software.json");
    }
    if (hasWord(["application", "head-up", "display", "test with omi", "testing lenses with optino: measure stress due to lens mounting", "contour of telescope mirror surface left and the mirror support map right", "digital camera lens test: on-axis and off-axis test", "use case"], msg)) {
      allowedFiles.push("application.json");
    }
    if (hasWord(["design", "mechanical"], msg)) {
      allowedFiles.push("opto-mechanical-design.json");
    }
    if (hasWord(["company", "about", "profile", "history"], msg)) {
      allowedFiles.push("companyprofile.json", "knowledge.json");
    }
    if (hasWord(["download", "brochure", "pdf"], msg)) {
      allowedFiles.push("download.json", "resourcesSection.json");
    }
    if (hasWord(["faq", "question", "how"], msg)) {
      allowedFiles.push("faq.json");
    }
    if (hasWord(["policy", "terms"], msg)) {
      allowedFiles.push("terms-and-conditions.json", "privacy-policy.json");
    }

    // Duplicate files hatane ke liye (agar keywords overlap hon)
    allowedFiles = [...new Set(allowedFiles)];

    const dataDir = path.join(process.cwd(), "src", "data");
    const filenames = fs.readdirSync(dataDir);
    
    let combinedData = {};

    filenames.forEach((filename) => {
      if (allowedFiles.includes(filename)) {
        const filePath = path.join(dataDir, filename);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const keyName = filename.replace(".json", "");
        try {
          combinedData[keyName] = JSON.parse(fileContent);
        } catch (err) {
          console.error(`Error parsing ${filename}:`, err);
        }
      }
    });

    const companyContext = JSON.stringify(combinedData);

    // 2. System Instructions
    const systemInstruction = `
      You are SpotOptics AI, a technical customer support assistant for SpotOptics S.r.l. 
      Use ONLY the following company JSON data to answer user questions:
      ${companyContext}
      
      Instructions:
      1. Be polite, clear, and professional.
      2. Answer naturally based on the products, specs, downloads, and contact details provided in the data.
      3. Keep answers concise (2-4 sentences max).
      4. If the requested information is NOT in the data, politely ask them to contact support at contact@spot-optics.com.
    `;

    // 3. Groq API Call
    const groq = new Groq({ apiKey: apiKey });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: message }
      ],
      model: "openai/gpt-oss-20b", 
      temperature: 0.5,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { reply: "Sorry, I am facing a temporary technical issue. Please try again in a moment." }, 
      { status: 500 }
    );
  }
}