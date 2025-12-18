
import { GoogleGenAI } from "@google/genai";

/**
 * Implementation of AI services using Google GenAI SDK.
 * Note: process.env.API_KEY is pre-configured and accessible.
 */

export const getDashboardInsights = async (data: any) => {
  try {
    // Create instance right before use to ensure latest API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `分析以下管理後台數據並提供 3 個核心見解 (繁體中文)：${JSON.stringify(data)}`,
      config: {
        systemInstruction: "你是一位資深商業分析師，負責為管理人員提供簡潔、數據驅動的決策建議。",
      },
    });
    return response.text || "目前無法獲取數據洞察。";
  } catch (error) {
    console.error("Gemini Service Error (Dashboard):", error);
    return "AI 服務暫時無法連線。";
  }
};

export const getDesignGuidance = async (topic: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `請針對「${topic}」提供一套專業的 UI/UX 設計規範與視覺指引 (繁體中文)。著重於 Bento-Grid 佈局與 Aurora 視覺風格。`,
      config: {
        systemInstruction: "你是一位頂尖的數位產品設計總監，擅長制定現代化、美觀且易用的管理系統設計規範。",
      },
    });
    return response.text || "目前無法生成設計規範指引。";
  } catch (error) {
    console.error("Gemini Service Error (Guidance):", error);
    return "獲取設計建議時發生錯誤，請稍後再試。";
  }
};
