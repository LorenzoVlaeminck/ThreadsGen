import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedResponse } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    posts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          content: {
            type: Type.STRING,
            description: "The main content of the Threads post. Must be under 500 characters. DO NOT include hashtags here.",
          },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-5 relevant hashtags.",
          },
          imagePrompt: {
            type: Type.STRING,
            description: "A creative, visual description of an image or photo that would pair perfectly with this post to stop the scroll.",
          }
        },
        required: ["content", "hashtags", "imagePrompt"],
      },
    },
  },
  required: ["posts"],
};

export const generateThreadsPosts = async (offerDetails: string, tone: string, audience: string, style: string): Promise<GeneratedResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const prompt = `
    You are a viral social media expert specializing in the "Threads" platform.
    
    Task: Create 5 distinct, engaging Threads posts about AI Content Creation.
    
    Context/Offer to Promote: "${offerDetails}"
    Target Audience: "${audience || 'General Creators'}"
    Tone: ${tone}
    Visual Style/Theme: "${style}" (Use this to guide the image prompts and overall vibe)
    
    Guidelines:
    1. STRICT LIMIT: Each post content MUST be under 500 characters.
    2. Format: Conversational, human, and authentic. Use line breaks for readability.
    3. Hook: Start with a question, controversial statement, or 'scroll-stopper'.
    4. CTA: Seamlessly weave a Call to Action into the post driving traffic to the offer.
    5. Visuals: For each post, describe a specific image concept that strongly aligns with the '${style}' aesthetic.
    6. NEGATIVE CONSTRAINT: Do NOT include hashtags in the 'content' field. Only put them in the 'hashtags' array.
    
    Output JSON format as specified in the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.75,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    return JSON.parse(text) as GeneratedResponse;
  } catch (error) {
    console.error("Error generating posts:", error);
    throw error;
  }
};

export const generatePostImage = async (imagePrompt: string, style: string): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    const prompt = `Generate a high-quality, aesthetic social media image. 
    Visual Style: ${style}. 
    Subject/Description: ${imagePrompt}. 
    Ensure the image is clean, modern, and high resolution.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};