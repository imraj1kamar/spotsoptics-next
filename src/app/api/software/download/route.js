import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    // 1. URL se token extract karo (e.g., /api/software/download?token=xyz123)
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // 2. Database mein token verify karo aur user check karo
    // (Yahan tum current logged-in user ka session ID bhi match kar sakte ho)
    const softwareLink = await prisma.softwareLink.findUnique({
      where: { secureToken: token },
      include: { software: true } // Actual hidden URL lane ke liye
    });

    // 3. Agar token invalid hai ya use ho chuka hai (False Scenario)
    if (!softwareLink || softwareLink.isUsed) {
      return NextResponse.json({ error: "Access Denied or Link Expired" }, { status: 403 });
    }

    // 4. Token valid hai (True Scenario) - Isko "Used" mark kar do taaki dobara koi aur use na kar sake
    await prisma.softwareLink.update({
      where: { id: softwareLink.id },
      data: { isUsed: true } // Single-use link bana diya
    });

    // 5. Browser ko direct cloud storage wale real URL par REDIRECT kar do
    const actualCloudUrl = softwareLink.software.baseFileUrl;
    
    // 307 Temporary Redirect use karo, taaki browser is URL ko cache na kare
    return NextResponse.redirect(actualCloudUrl, 307);

  } catch (error) {
    console.error("Download verification error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}