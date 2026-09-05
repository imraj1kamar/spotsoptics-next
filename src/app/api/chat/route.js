import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

// =========================================================================
// 1. PRE-LOAD DATA & HELPER FUNCTIONS
// =========================================================================
const chatbotIntentData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src", "data", "chatbot.json"), "utf8")
);

const stopWords = new Set([
  "the", "is", "a", "an", "of", "for", "to", "in", "on", "with", "and", "or",
  "what", "which", "when", "where", "who", "why", "how", "can", "could", "would",
  "should", "about", "from", "this", "that", "these", "those", "please", "tell",
  "me", "us", "our", "you", "your", "i", "am", "do", "does", "did", "want",
  "need", "know", "more", "about", "are", "be", "by", "as", "at", "it", "its",
  "into", "use", "using", "all", "list", "any"
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
        // 👇 SMART SCORING LOGIC: Jitne zyada words, utne zyada points! (Multiplier)
        score += keyword.split(" ").length * 2; 
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatch = intentEntry;
    }
  });

  return maxScore > 0 ? bestMatch : null;
}
// =========================================================================
// 2. MAIN POST ROUTE
// =========================================================================
export async function POST(req) {
  let matchedIntent = null;

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

    // Correctly calling helper functions
    matchedIntent = matchIntent(message, chatbotIntentData);
    const importantWords = extractImportantWords(message);

    // =========================================================================
    // 🛑 3. SUPER BYPASS LOGIC (0 Tokens Used - Faltu Request Blocked)
    // =========================================================================

    // Jin intents ke liye API call nahi karni, unki list:
const bypassIntents = [
      "ALL_PRODUCTS_LIST",
      "ALL_APPLICATIONS_LIST",
      "GREETING", 
      "PRICING", 
      "QUOTE_REQUEST", 
      "DEMO_REQUEST", 
      "ABOUT_SPOTOPTICS",
      "APPRECIATION_FAREWELL",
      "CONTACT_INFO",
      "DISTRIBUTORS",
      "DOWNLOADS",
      "WARRANTY_REPAIR",
      "CUSTOMIZATION_OEM",
      "TRAINING_INSTALLATION",
      "SOFTWARE_COMPATIBILITY",
      "CALIBRATION_INFO",
      "SOFTWARE_LICENSING",
      "LEAD_TIME_DELIVERY"
    ];

    // Extra check for pricing keywords manually just in case
    const pricingKeywords = ["price", "cost", "how much", "pricing", "cost of", "quote"];
    const isAskingPrice = pricingKeywords.some((word) => msg.includes(word));

    if (isAskingPrice || (matchedIntent && bypassIntents.includes(matchedIntent.intent))) {

      let finalReply = matchedIntent ? matchedIntent.answer : "How can I help you?";

      // Custom formatting for specific bypasses (Taaki links properly jayein)
      if (isAskingPrice || (matchedIntent && (matchedIntent.intent === "PRICING" || matchedIntent.intent === "QUOTE_REQUEST"))) {
        finalReply = "We work on highly customized optical systems, so pricing depends on your specific configuration. Please get in touch with our team or request a quote here: [Contact Us](/contact-us)";
      }
      else if (matchedIntent && (matchedIntent.intent === "DEMO_REQUEST" || matchedIntent.intent === "CONTACT_EXPERT")) {
        finalReply = "Our technical experts would be happy to assist you. You can request a product demo or speak with an engineer by visiting our [Contact Page](/contact-us).";
      }

      return NextResponse.json({
        reply: finalReply,
        matchedIntent: matchedIntent ? matchedIntent.intent : "BYPASS",
        contextTerms: [],
        sourceFiles: [],
        totalTokens: 0
      }, { status: 200 }); // API CALL YAHIN SE CANCEL 🚀
    }

    // =========================================================================
    // 📁 4. DYNAMIC FILE ROUTING (Sirf zaroori file uthayega)
    // =========================================================================
    let allowedFiles = ["contact-us.json", "site.json"];

    const hasWord = (wordList, text) => {
      return wordList.some(word => new RegExp(`\\b${word}\\b`, 'i').test(text));
    };

    if (hasWord(["product", "products", "sensor", "omi", "optino", "instrument", "specs", "specifications", "features"], msg) || (matchedIntent && (matchedIntent.intent === "PRODUCT_DISCOVERY" || matchedIntent.intent === "PRODUCT_DETAILS"))) {
      allowedFiles.push("products.json");
    }
    if (hasWord(["software", "sensoft", "wavefront"], msg) || (matchedIntent && matchedIntent.intent === "SENSOFT")) {
      allowedFiles.push("wavefront-sensor-software.json");
    }
    if (hasWord(["application", "head-up", "display", "test", "testing", "use case"], msg) || (matchedIntent && matchedIntent.intent === "APPLICATION_MATCHING")) {
      allowedFiles.push("application.json");
    }
    if (hasWord(["design", "mechanical"], msg)) allowedFiles.push("opto-mechanical-design.json");
    if (hasWord(["company", "about", "profile", "history"], msg)) allowedFiles.push("companyprofile.json", "knowledge.json");
    if (hasWord(["download", "brochure", "pdf"], msg)) allowedFiles.push("download.json", "resourcesSection.json");
    if (hasWord(["faq", "question", "how"], msg)) allowedFiles.push("faq.json");
    if (hasWord(["policy", "terms"], msg)) allowedFiles.push("terms-and-conditions.json", "privacy-policy.json");

    allowedFiles = [...new Set(allowedFiles)];

    const dataDir = path.join(process.cwd(), "src", "data");
    const filenames = fs.readdirSync(dataDir);

    let combinedData = {};

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

    // =========================================================================
    // 🧠 5. SMART TOKEN FILTER (Data Chota Karne Ka Logic)
    // =========================================================================
    const specKeywords = ["specifications", "wavelength", "measurement range", "accuracy", "resolution", "specs", "features", "technical details", "dimension"];
    const isAskingSpecs = specKeywords.some(word => msg.includes(word));

    if (combinedData["products"] && Array.isArray(combinedData["products"])) {
      if (isAskingSpecs) {
        const specificProducts = combinedData["products"].filter(p => importantWords.some(word => (p.name || "").toLowerCase().includes(word)));
        if (specificProducts.length > 0) combinedData["products"] = specificProducts;
      } else {
        combinedData["products"] = combinedData["products"].map(p => `- ${p.name}`);
      }
    }

    if (combinedData["application"] && Array.isArray(combinedData["application"])) {
      combinedData["application"] = combinedData["application"].map(app => `- ${app.title || app.name}`);
    }

    let companyContext = JSON.stringify(combinedData);
    if (companyContext.length > 22000) {
      companyContext = companyContext.substring(0, 22000) + '...';
    }

    const relevantContext = importantWords.length ? importantWords.slice(0, 8).join(", ") : "general inquiry";

    // =========================================================================
    // 📝 6. SYSTEM INSTRUCTIONS
    // =========================================================================
    const systemInstruction = `You are SpotOptics AI, a highly technical Assistant for SpotOptics S.r.l.
Use ONLY this JSON data to answer: ${companyContext}

CRITICAL RULES FOR RESPONDING:
1. "What products do you offer?": ALWAYS output a simple numbered list of product names. Every product name MUST be a clickable link formatted exactly like this: [Product Name](/all-products). NEVER add descriptions, specifications, or key features under the list items.
2. "What are the applications?": ALWAYS output a simple numbered list of applications. Every application name MUST be a clickable link formatted exactly like this: [Application Name](/all-products). NEVER add descriptions or extra text.
3. Sensoft Software: If asked about Sensoft or software, you MUST provide this exact link: [Sensoft software](/all-products/wavefront-sensor-software) and give a very brief overview based on the data.
4. Product Specifications: ONLY provide detailed features, accuracy, or dimensions if the user explicitly asks for "specifications", "specs", "details", or "features" of a specific product.
5. NEVER invent data. Keep answers concise.

Context Keywords: ${relevantContext}`;

    // =========================================================================
    // 🤖 7. GROQ API CALL
    // =========================================================================
    const groq = new Groq({ apiKey: apiKey });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: message }
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.3,
      max_tokens: 350,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "";

    const usage = chatCompletion.usage;
    if (usage) {
      console.log("\n📊 --- TOKEN USAGE REPORT ---");
      console.log(`📥 Input Tokens (Data + Message) : ${usage.prompt_tokens}`);
      console.log(`📤 Output Tokens (AI ka Answer)  : ${usage.completion_tokens}`);
      console.log(`🔥 TOTAL TOKENS USED           : ${usage.total_tokens}`);
      console.log("-----------------------------\n");
    }

    return NextResponse.json({
      reply,
      matchedIntent: matchedIntent ? matchedIntent.intent : null,
      contextTerms: importantWords.slice(0, 8),
      sourceFiles: allowedFiles,
      totalTokens: usage ? usage.total_tokens : 0
    });

  } catch (error) {
    console.error("Groq API Error:", error);

    let fallbackReply = "Sorry, I am facing a temporary technical issue. Please try again in a moment.";

    if (matchedIntent && matchedIntent.answer) {
      fallbackReply = matchedIntent.answer;
    } else if (error.status === 429 || error.status === 413 || error?.error?.code === 'rate_limit_exceeded') {
      fallbackReply = "Our system is receiving high traffic right now. Please leave us a message on our Contact page.";
    }

    return NextResponse.json({
      reply: fallbackReply,
      matchedIntent: matchedIntent ? matchedIntent.intent : "BYPASS",
      contextTerms: [],
      sourceFiles: [],
      totalTokens: 0
    }, { status: 200 }); // API CALL YAHIN SE CANCEL 🚀
  }
}