const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "qwen/qwen3.6-27b";

async function groqRequest(body) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || `Groq request failed with ${response.status}`);
  }

  return data;
}

function parseJsonContent(text) {
  const withoutThink = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  const fenced = withoutThink.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    return JSON.parse(fenced);
  } catch {
    const start = fenced.indexOf("{");
    const end = fenced.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(fenced.slice(start, end + 1));
    }
    throw new Error("AI returned invalid JSON");
  }
}

exports.extractReceipt = async (base64Image, mimeType) => {
  const data = await groqRequest({
    model: MODEL,
    temperature: 0.2,
    max_completion_tokens: 700,
    reasoning_format: "hidden",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
          {
            type: "text",
            text: `Extract expense information from this receipt.
Return ONLY a JSON object with exactly these keys:
{
  "store": "string or null",
  "date": "YYYY-MM-DD or null",
  "items": [{"name":"string","price":0}],
  "total": 0,
  "category": "food|transport|shopping|utilities|other"
}
Use the final amount charged on the receipt as total. If the receipt is unreadable, use null for uncertain fields.`,
          },
        ],
      },
    ],
  });

  return parseJsonContent(data.choices[0].message.content);
};

exports.generateInsights = async (expenses) => {
  if (!expenses.length) {
    return { summary: "Add some expenses to receive AI spending insights." };
  }

  const compact = expenses.map((e) => ({
    store: e.store,
    amount: Number(e.amount),
    category: e.category,
    date: e.expense_date,
  }));

  const data = await groqRequest({
    model: MODEL,
    temperature: 0.4,
    max_completion_tokens: 800,
    reasoning_format: "hidden",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a practical personal finance assistant. Give concise, non-financial-advisory spending observations based only on supplied expense data.",
      },
      {
        role: "user",
        content: `Analyze these expenses and return JSON:
{
  "summary": "2-3 sentence summary",
  "topCategory": "category",
  "savingTip": "one practical suggestion",
  "observation": "one useful observation"
}
Expenses:
${JSON.stringify(compact)}`,
      },
    ],
  });

  return parseJsonContent(data.choices[0].message.content);
};
