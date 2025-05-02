const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

app.get('/', (req, res) => {
    res.send('✅ IG2FA backend (OpenRouter) is running!');
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log('📥 Nhận message:', userMessage);
    try {
        const response = await axios.post(
            OPENROUTER_URL,
            {
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Bạn là AI bảo mật IG2FA, dí dỏm, hacker style, bí ẩn.' },
                    { role: 'user', content: userMessage }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const reply = response.data.choices[0].message.content;
        console.log('📤 AI trả lời:', reply);
        res.json({ reply });
    } catch (err) {
        console.error('❌ Lỗi khi gọi OpenRouter:', err.response ? err.response.data : err.message);
        res.status(500).json({ reply: '⚠️ Lỗi server. Hãy thử lại sau!' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server đang chạy tại cổng ${port}`));
