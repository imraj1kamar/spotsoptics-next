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
  // 👇 FIX: matchedIntent ko yahan sabse upar declare kiya hai taaki crash na ho
  let matchedIntent = null;

  try {
    const { message, files, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    const msg = message.toLowerCase();
    
    // 👇 FIX: Yahan 'const' word hata diya hai kyunki upar declare ho chuka hai
    matchedIntent = matchIntent(message, chatbotIntentData);
    
    const importantWords = extractImportantWords(message);

    let allowedFiles = ["contact-us.json", "site.json"];
    
    if (Array.isArray(files) && files.length > 0) {
      allowedFiles.push(...files);
    }

    const hasWord = (wordList, text) => {
      return wordList.some((word) => new RegExp(`\\b${word}\\b`, "i").test(text));
    };

    if (matchedIntent) {
      const intentFileMap = {
        ABOUT_SPOTOPTICS: ["companyprofile.json", "site.json"],
        PRODUCT_DISCOVERY: ["products.json", "application.json"],
        PRODUCT_DETAILS: ["products.json"],
        PRODUCT_COMPARISON: ["products.json"],
        APPLICATION_MATCHING: ["application.json", "products.json"],
        TECHNICAL_QUESTION: ["knowledge.json", "faq.json"],
        KNOWLEDGE_CORNER: ["knowledge.json"],
        SENSOFT: ["wavefront-sensor-software.json", "sensoftSection.json"],
        DOCUMENTATION: ["download.json", "resourcesSection.json"],
        PRICING: ["contact-us.json", "site.json"],
        QUOTE_REQUEST: ["contact-us.json", "site.json"],
        DEMO_REQUEST: ["contact-us.json"],
        CONTACT_EXPERT: ["contact-us.json"],
        SUPPORT: ["contact-us.json", "faq.json"],
        GENERAL: ["terms-and-conditions.json", "privacy-policy.json", "faq.json"]
      };

      if (intentFileMap[matchedIntent.intent]) {
        allowedFiles.push(...intentFileMap[matchedIntent.intent]);
      }
    }

    if (hasWord(["product", "products", "sensor", "sensors", "omi", "optino", "puntino", "sfera", "stella", "contour", "specs", "features"], msg)) {
      allowedFiles.push("products.json");
    }
    if (hasWord(["software", "sensoft", "analysis"], msg)) {
      allowedFiles.push("wavefront-sensor-software.json");
    }
    if (hasWord(["application", "test", "testing", "lens", "camera", "telescope", "ophthalmic", "automotive"], msg)) {
      allowedFiles.push("application.json");
    }
    if (hasWord(["company", "about", "mission", "shack-hartmann", "wavefront", "metrology", "mtf"], msg)) {
      allowedFiles.push("companyprofile.json", "knowledge.json");
    }
    if (hasWord(["download", "brochure", "pdf", "datasheet", "manual"], msg)) {
      allowedFiles.push("download.json", "resourcesSection.json");
    }
    if (hasWord(["contact", "quote", "price", "demo", "support", "email"], msg)) {
      allowedFiles.push("contact-us.json");
    }

    allowedFiles = [...new Set(allowedFiles)];

    const dataDir = path.join(process.cwd(), "src", "data");
    const filenames = fs.readdirSync(dataDir);
    const combinedData = {};

    filenames.forEach((filename) => {
      if (allowedFiles.includes(filename)) {
        const filePath = path.join(dataDir, filename);
        try {
          const fileContent = fs.readFileSync(filePath, "utf8");
          const keyName = filename.replace(".json", "");
          combinedData[keyName] = JSON.parse(fileContent);
        } catch (err) {
          console.error(`Error parsing ${filename}:`, err);
        }
      }
    });

    // PRODUCTS LOGIC
    const allProducts = combinedData["products"]; 
    const isAskingForAllProducts = hasWord(["all", "list", "how many", "kitne", "types", "what products", "what are your products"], msg);

    if (allProducts && isAskingForAllProducts && Array.isArray(allProducts)) {
      const lightweightProductList = allProducts.map(product => {
        return `- ${product.name || "Product"} (Best for: ${product.application_type || "General Testing"})`;
      });
      combinedData["products"] = lightweightProductList; 
    }

    // APPLICATIONS LOGIC
    const allApplications = combinedData["application"]; 
    const isAskingForAllApps = hasWord(["all applications", "list applications", "where", "industries", "fields", "use cases", "uses", "where is it used"], msg);

    if (allApplications && isAskingForAllApps && Array.isArray(allApplications)) {
      const lightweightAppList = allApplications.map(app => {
        return `- ${app.title || app.name || "Application"} (E.g., ${app.short_description || "Optical Metrology"})`; 
      });
      combinedData["application"] = lightweightAppList;
    }

 // JSON ko string banayein
    let companyContext = JSON.stringify(combinedData);

    if (companyContext.length > 22000) {
      companyContext = companyContext.substring(0, 22000) + '... (Note: Some data truncated due to size limits)';
    }

    const relevantContext = importantWords.length ? importantWords.slice(0, 8).join(", ") : "general inquiry";


    const systemInstruction = `You are SpotOptics AI, a highly technical Assistant for SpotOptics S.r.l.
Use ONLY this JSON data to answer: ${companyContext}

RULES:
1. NEVER invent specs, pricing, or features. If missing, say it's unavailable and recommend support.
2. Pricing queries -> "Pricing depends on configuration. Request a quote?" (Link to Contact).
3. Product Discovery -> Ask 1-2 short clarifying questions if too broad.
4. App Matching -> Identify app, recommend relevant sensors.
5. Comparisons -> Clean structure, short recommendation.
6. Technical -> Concise explanation. Append "Learn more → [Article Title]" if article exists.
7. Docs -> Provide direct download links.
8. Keep answers concise.

FORMAT:
- Markdown links ONLY: [Text](/url). No HTML <a>.
- Full catalog link MUST be: [All-products](/all-products).
- Lists MUST be numbered (1. [Product](/url)). Add key features & apps below each.

Context: ${relevantContext}`;

    const recentHistory = history.slice(-4).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    }));

    const groq = new Groq({ apiKey: apiKey });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        ...recentHistory,
        { role: "user", content: message }
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.5,
      max_tokens: 350,
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
    
    // NAYA FALLBACK LOGIC
    let fallbackReply = "Sorry, I am facing a temporary technical issue. Please try again in a moment.";

    if (matchedIntent && matchedIntent.answer) {
      // Agar chatbot.json se answer match hota hai, toh wo bhejein
      fallbackReply = matchedIntent.answer;
    } else if (error.status === 429 || error?.error?.code === 'rate_limit_exceeded') {
      // Agar match nahi hua aur limit error hai
      fallbackReply = "Our system is receiving high traffic right now. Please leave us a message on our Contact page.";
    }

    return NextResponse.json(
      {
        reply: fallbackReply, 
        matchedIntent: matchedIntent ? matchedIntent.intent : null,
        contextTerms: [],
        sourceFiles: [] 
      },
      { status: 200 } // Taki frontend crash na kare
    );
  }
}