import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const callGemini = async (prompt) => {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY missing in .env");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mixtral-8x7b-instruct", // 🔥 free model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let text = response.data?.choices?.[0]?.message?.content;

    if (!text) {
      console.log("⚠️ Empty AI response");
      return null;
    }

    // clean
    text = text.replace(/```json|```/g, "").trim();

    console.log("🧠 AI RAW:", text);

    return text;

  } catch (error) {
    console.log("❌ OPENROUTER ERROR:", error.response?.data || error.message);
    return null;
  }
};