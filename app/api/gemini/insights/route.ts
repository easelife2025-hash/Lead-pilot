import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { hot, warm, cold } = await req.json();

    const prompt = `You are LeadPilot AI, a strategic real estate assistant.
Based on the current pipeline:
- ${hot} Hot Leads (High intent, responsive)
- ${warm} Warm Leads (Browsing, occasional replies)
- ${cold} Cold Leads (No reply > 30 days)

Provide a 3-paragraph strategic advice tailored for a real estate agent based on these numbers.
Structure your response like this:
**Immediate Actions (Next 24h)**
[advice]

**Warming Strategies**
[advice]

**Cold Revival Blast**
[advice]
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    return NextResponse.json({ text: response.text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
