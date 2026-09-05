import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

const chatbotIntentData = JSON.parse(
 fs.readFileSync(path.join(process.cwd(), "src", "data", "chatbot.json"), "utf8")
);

const stopWords = new Set([
 "the", "is", "a", "an", "of", "for", "to", "in", "on", "with", "and", "or",
 "what", "which", "when", "where", "who", "why", "how", "can", "could", "would",
 "should", "about", "from", "this", "that", "these", "those", "please", "tell",
 "me", "us", "our", "you", "your", "i", "am", "do", "does", "did", "want",
 "need", "know", "more", "about", "are", "be", "by", "as", "at", "it", "its",
 "into", "use", "using"
]);

function extractImportantWords(text) {
 return [...new Set(
   text
     .toLowerCase()
     .replace(/[^a-z0-9\s-]/g, " ")
     .split(/\s+/)
     .filter((word) => word.length > 2 && !stopWords.has(word))
     .map((word) => word.replace(/s$/, ""))
 )];
}

function matchIntent(message, intents) {
 const msg = message.toLowerCase();
 let bestMatch = null;
 let maxScore = 0;

 intents.forEach((intentEntry) => {
   const keywords = Array.isArray(intentEntry.keywords) ? intentEntry.keywords : [];
   let score = 0;

   keywords.forEach((keyword) => {
     const normalizedKeyword = keyword.toLowerCase();
     const pattern = new RegExp(`\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");

     if (pattern.test(msg)) {
       score += 2;
     }
   });

   if (score > maxScore) {
     maxScore = score;
     bestMatch = intentEntry;
    }
 });

 return maxScore > 0 ? bestMatch : null;
}

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

   const msg = message.toLowerCase();
   const matchedIntent = matchIntent(message, chatbotIntentData);
   const importantWords = extractImportantWords(message);

   let allowedFiles = ["contact-us.json", "site.json"];
   const hasWord = (wordList, text) => {
     return wordList.some((word) => new RegExp(`\\b${word}\\b`, "i").test(text));
   };

   if (matchedIntent) {
     const intentFileMap = {
       products: ["products.json"],
       applications: ["application.json"],
       software: ["wavefront-sensor-software.json"],
       company: ["companyprofile.json", "knowledge.json"],
       downloads: ["download.json", "resourcesSection.json"],
       faq: ["faq.json"],
       contact: ["contact-us.json"],
       accessories: ["accessories.json"],
       design: ["opto-mechanical-design.json"],
       terms: ["terms-and-conditions.json", "privacy-policy.json"]
     };

     if (intentFileMap[matchedIntent.intent]) {
       allowedFiles.push(...intentFileMap[matchedIntent.intent]);
     }
   }

   if (hasWord(["product", "products", "sensor", "omi", "optino", "puntino", "instrument"], msg)) {
     allowedFiles.push("products.json");
   }
   if (hasWord(["software", "sensoft", "wavefront", "analysis", "image processing"], msg)) {
     allowedFiles.push("wavefront-sensor-software.json");
   }
   if (hasWord(["application", "applications", "use case", "test", "testing", "display", "lens", "camera"], msg)) {
     allowedFiles.push("application.json");
   }
   if (hasWord(["design", "mechanical", "assembly", "dimensions"], msg)) {
     allowedFiles.push("opto-mechanical-design.json");
   }
   if (hasWord(["company", "about", "profile", "history", "team", "mission"], msg)) {
     allowedFiles.push("companyprofile.json", "knowledge.json");
   }
   if (hasWord(["download", "brochure", "pdf", "manual", "datasheet", "guide"], msg)) {
     allowedFiles.push("download.json", "resourcesSection.json");
   }
   if (hasWord(["faq", "question", "how", "why", "problem", "issue"], msg)) {
     allowedFiles.push("faq.json");
   }
   if (hasWord(["contact", "support", "email", "phone", "call", "reach", "quote"], msg)) {
     allowedFiles.push("contact-us.json");
   }
   if (hasWord(["accessory", "accessories", "mount", "adapter", "holder"], msg)) {
     allowedFiles.push("accessories.json");
   }
   if (hasWord(["terms", "conditions", "policy", "legal", "agreement"], msg)) {
     allowedFiles.push("terms-and-conditions.json", "privacy-policy.json");
   }

   allowedFiles = [...new Set(allowedFiles)];

   const dataDir = path.join(process.cwd(), "src", "data");
   const filenames = fs.readdirSync(dataDir);
   const combinedData = {};

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
   const relevantContext = importantWords.length ? importantWords.slice(0, 8).join(", ") : "general inquiry";

   const systemInstruction = `
     You are SpotOptics AI, a technical customer support assistant for SpotOptics S.r.l.
     Use ONLY the following company JSON data to answer user questions:
     ${companyContext}

     Instructions:
     1. Be polite, clear, and professional.
     2. Answer naturally based on the products, specs, downloads, and contact details provided in the data.
     3. Keep answers concise (2-4 sentences max).
     4. If the requested information is NOT in the data, politely ask them to contact support at contact@spot-optics.com.
     5. If no explicit match is found, use the query keywords: ${relevantContext} to infer the most relevant topic.
   `;

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

   return NextResponse.json({
     reply,
     matchedIntent: matchedIntent ? matchedIntent.intent : null,
     contextTerms: importantWords.slice(0, 8),
     sourceFiles: allowedFiles
   });
 } catch (error) {
   console.error("Groq API Error:", error);
   return NextResponse.json(
     {
       reply: "Sorry, I am facing a temporary technical issue. Please try again in a moment.",
       matchedIntent: null,
       contextTerms: [],
       sourceFiles: []
     },
     { status: 500 }
   );
 }
}