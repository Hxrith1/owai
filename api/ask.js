const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Log the incoming request method and body
  console.log("Incoming request method:", req.method);
  console.log("Incoming request body:", req.body);

  // Handle preflight requests (CORS)
  if (req.method === 'OPTIONS') {
    console.log("CORS preflight request");
    return res.status(200).end();
  }

  const userQuestion = req.body.question ? req.body.question.toLowerCase() : '';
  console.log("User question:", userQuestion);

  // Special case for "ticker"
  if (userQuestion.includes('ticker')) {
    console.log("Question relates to ticker, responding with $OWAI");
    return res.json({ answer: '$OWAI' });
  }

  try {
    console.log("Sending request to OpenAI...");
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are OWAI, a helpful assistant. Always respond to questions with a single, relevant word. If you are unsure or the question is inappropriate, respond with "unsure" or "unknown".'
        },
        { role: 'user', content: userQuestion }
      ],
      max_tokens: 5,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiResponse = response.data.choices[0].message.content.trim();
    const oneWordResponse = aiResponse.split(' ')[0];
    console.log("OpenAI response:", aiResponse);

    res.json({ answer: oneWordResponse });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error.message);
    console.error("Full error:", error.response ? error.response.data : error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
