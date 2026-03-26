export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  const { messages, level } = req.body;
  const modelMap = { L1:'google/gemini-flash-1.5-8b', L2:'google/gemini-flash-1.5', L3:'openai/gpt-4o' };
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${process.env.OPENROUTER_KEY}`, 'HTTP-Referer':'https://zenithsmart.xin', 'X-Title':'SunnyGuard AI' },
      body: JSON.stringify({ model: modelMap[level]||modelMap.L1, messages:[{role:'system',content:'You are Sunny, a friendly AI assistant for SunnyGuard AI. Be warm, smart, and helpful. Use emojis.'}, ...messages.slice(-12)], max_tokens:2000 })
    });
    if (!r.ok) throw new Error('OpenRouter '+r.status);
    const d = await r.json();
    res.json({ reply: d.choices?.[0]?.message?.content || 'Sorry, please try again.' });
  } catch(e) { res.status(500).json({ error: e.message }); }
}
