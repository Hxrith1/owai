const axios = require('axios');

module.exports = async (req, res) => {
  const userQuestion = req.body.question.toLowerCase();

  if (userQuestion.includes('ticker')) {
    return res.json({ answer: '$OWAI' });
  }

  try {
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

    let aiResponse = response.data.choices[0].message.content.trim();
    const oneWordResponse = aiResponse.split(' ')[0];

    res.json({ answer: oneWordResponse });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
app.use(cors({
  origin: '*' // Allow all origins or restrict to your domain if needed
}));