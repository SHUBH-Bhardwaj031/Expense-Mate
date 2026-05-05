import { callGemini } from "../config/gemini.js";
import { getExpenseData } from "../utils/expenseHelper.js";
import Expense from "../models/expense.js";

// ---------------- JSON PARSER ----------------
function safeParseJSON(text) {
  try {
    if (!text) return null;
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ---------------- SUGGESTIONS ----------------
export const getSuggestions = async (req, resp) => {
  try {
    const rawData = await getExpenseData(req.userId);

    const data = {
      total: rawData.totalForTheWeek || 0,
      previous_total: rawData.totalPreviousWeek || 0,
      paymentMethodBreakdown:
        rawData.payMethodUsedBreakdown?.map((item) => ({
          name: item._id,
          amount: item.amount,
        })) || [],
      dailyBreakdown:
        rawData.dailyBreakdown?.map((item) => ({
          date: item._id,
          amount: item.amount,
        })) || [],
      recentTransactions:
        rawData.recentTransactions?.map((item) => ({
          id: item._id,
          title: item.title,
          description: item.description,
          amount: item.rs,
          date: item.createdAt,
          paymentmethod: item.paymentMethod,
        })) || [],
    };

    const prompt = `
STRICTLY return valid JSON only.
No explanation.

Input:
${JSON.stringify(data)}

Output:
{
  "headline": string,
  "action": { "label": string, "url": string, "tip": string },
  "severity": "ok" | "caution" | "alert"
}
`;

    const text = await callGemini(prompt);
    const parsed = safeParseJSON(text);

    return resp.json({
      total: data.total,
      currency: "INR",
      trend: "flat",
      pct_change: 0,
      headline: parsed?.headline || "Basic summary",
      paymentMethodBreakdown: data.paymentMethodBreakdown,
      recentTransactions: data.recentTransactions,
      severity: parsed?.severity || "ok",
      action: parsed?.action || {
        label: "Review",
        tip: "Basic data",
        url: "#",
      },
    });

  } catch (error) {
    console.log("❌ SUGGESTION ERROR:", error.message);
    return resp.status(500).json({ message: "AI error" });
  }
};

// ---------------- CHAT ----------------
export const chatWithAi = async (req, resp) => {
  try {
    const { query } = req.query;

    if (!query) {
      return resp.status(400).json({ message: "query is required" });
    }

    const prompt = `You are an assistant for an expense management app.  
Your job is to decide which operation the user wants and — WHEN the operation is "list_expense " — return a **MongoDB aggregation pipeline** (an array of BSON-style stage objects) that can be passed directly to collection.aggregate(pipeline).

Rules / output format:
1. Always return a single valid JSON object and **nothing else**.
2. Top-level fields:
   {
     "operation": "add_expense" | "list_expense" | "unknown",
     // when add_expense: include expense_data
     // when unknown: include advisor_message
     // when list_expense: include "pipeline"
   }

3. For add_expense:
   {
     "operation": "add_expense",
     "expense_data": {
       "title": string,
       "description": string[write this based on the title and the user query],
       "rs": number,
       "paymentMethod": string,
       "createdAt": string (ISO date if provided, otherwise "now", make sure it's in UTC'),
       "hidden": boolean (if provided),
       "screenshot": string (if rovided)
       // userId should not be set by LLM, it will be injected by backend
     }
   }
p
4. For list_expense produce:
   {
     "operation": "list_expense",
     "pipeline": [ /* array of aggregation stage objects */ ],
     "metadata": { "explain": "short human reason for pipeline (optional)" }
   }

5. Pipeline rules:
   - Pipeline must be an **array** of JSON objects where each object is a valid aggregation stage (e.g. { "$match": {...} }, { "$group": {...} }, { "$sort": {...} }, { "$limit": n }, { "$skip": n }, { "$project": {...} }, { "$facet": {...} } ).
   - Dates must use \`createdAt\` (not "date"). Format as ISO8601 strings (YYYY-MM-DD or full ISO datetime) or numeric epoch millis. Example: "2025-09-01T00:00:00Z".
   - Allowed top-level fields to match on: createdAt, rs, paymentMethod, title, description, hidden, screenshot, userId.
   - Allowed operators in $match: $gte, $lte, $gt, $lt, $eq, $in, $nin, $exists. Do NOT use $where, $function, $accumulator or any server-side JS.
   - If user requests totals/summary, include a $group stage that returns { _id: <group-by>, totalRs: { $sum: "$rs" }, count: { $sum: 1 } }.
   - Always include a safety {$limit: <reasonable>} stage if the user asked a broad range (default limit = 100).
   - If pagination requested, include $skip and $limit with keys page and page_size translated (page 1 => skip 0).
   - For relative date phrases (e.g., "last 7 days", "this month", "last month"), convert them into explicit ISO $gte and $lte ranges on createdAt.
   - If grouping requested (by day/month/paymentMethod), use $group with $sum on rs.
   - IMPORTANT: When producing a MongoDB aggregation pipeline in JSON, ALWAYS use MongoDB Extended JSON for non-JSON-native types so the output is valid JSON and can be parsed/converted server-side.
    
  
    
    
6. Example pipelines:

Example A — last 7 days, paid by cash, sort newest first, limit 100:
{
  "operation": "list_expense",
  "pipeline": [
    { "$match": {
      
        "createdAt": { "$gte": "2025-09-16T00:00:00Z", "$lte": "2025-09-23T23:59:59Z" },
        "paymentMethod": "cash"
    }},
    { "$sort": { "createdAt": -1 } },
    { "$limit": 100 }
  ],
  "metadata": { "explain": "last 7 days, cash payments" }
}

Example B — totals per paymentMethod for September 2025:
{
  "operation": "list_expense",
  "pipeline": [
    { "$match":  { "createdAt": { "$gte": "2025-09-01T00:00:00Z", "$lte": "2025-09-30T23:59:59Z" } } },
    { "$group": { "_id": "$paymentMethod", "totalRs": { "$sum": "$rs" }, "count": { "$sum": 1 } } },
    { "$project": { "paymentMethod": "$_id", "totalRs": 1, "count": 1, "_id": 0 } },
    { "$sort": { "totalRs": -1 } }
  ],
  "metadata": { "explain": "monthly totals grouped by paymentMethod" }
}

Example C — filter by rs range and payment methods:
{
  "operation": "list_expense",
  "pipeline": [
    { "$match": {
        "rs": { "$gte": 100, "$lte": 5000 },
        "paymentMethod": { "$in": ["upi", "card"] }
    }},
    { "$sort": { "rs": -1 } },
    { "$limit": 100 }
  ]
}

7. If the user query is not about expenses, return:
{
  "operation": "unknown",
  "advisor_message": "<short helpful financial advice>"
}

8. Never include code, markdown or extra text — only the valid JSON described above.
            user query: ${query}
            `;

    let text = await callGemini(prompt);
    console.log("🧠 RAW:", text);

    let responseObj = safeParseJSON(text);

    // 🔥 FALLBACK (AI FAIL)
    if (!text || !responseObj) {
      const lower = query.toLowerCase();

      if (lower.includes("show") || lower.includes("list")) {
        const result = await Expense.find({ userId: req.userId })
          .sort({ createdAt: -1 })
          .limit(5);

        return resp.json({ operation: "list_expense", result });
      }

      if (lower.includes("add") || lower.includes("spent")) {
        return resp.json({
          operation: "add_expense",
          message: "Use: add 500 food via upi",
        });
      }

      return resp.json({
        operation: "unknown",
        message: " Maximum Limit Reached . Try: show expenses",
      });
    }

    // ✅ ADD EXPENSE
    if (responseObj.operation === "add_expense") {
      const data = responseObj.expense_data;

      if (!data || !data.rs) {
        return resp.json({
          operation: "add_expense",
          message: "Amount missing. Try: add 500 food",
        });
      }

      await Expense.create({
        title: data.title || "Expense",
        description: data.description || "",
        rs: Number(data.rs),
        paymentMethod: data.paymentMethod || "cash",
        userId: req.userId,
        createdAt: new Date(),
      });

      return resp.json({
        operation: "add_expense",
        message: "Expense added successfully",
      });
    }

    // ✅ LIST EXPENSE
    if (responseObj.operation === "list_expense") {
      const result = await Expense.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(10);

      return resp.json({
        operation: "list_expense",
        result,
      });
    }

    // ✅ ADVICE / MARKET (🔥 FIXED PART)
    if (
      responseObj.operation === "advice" ||
      responseObj.operation === "market_info"
    ) {
      return resp.json({
        operation: responseObj.operation,
        message:
          responseObj.advisor_message ||
          "Track expenses, reduce waste, and save regularly.",
      });
    }

    // ✅ DEFAULT
    return resp.json({
      operation: "unknown",
      message:
        responseObj.advisor_message ||
        "Ask about expenses, savings, or market trends",
    });

  } catch (error) {
    console.log("❌ CHAT ERROR:", error.message);
    return resp.status(500).json({ message: "AI error" });
  }
};