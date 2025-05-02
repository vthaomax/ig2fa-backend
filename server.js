const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
    res.send('✅ IG2FA backend is running! Use POST /chat to talk to the AI.');
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log('📥 Nhận message:', userMessage);
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Bạn là AI bảo mật IG2FA, dí dỏm, hacker style, bí ẩn.' },
                { role: 'user', content: userMessage }
            ]
        });
        const reply = completion.choices[0].message.content;
        console.log('📤 AI trả lời:', reply);
        res.json({ reply });
    } catch (err) {
        console.error('❌ Lỗi khi gọi OpenAI API:', err);
        res.status(500).json({ reply: '⚠️ Lỗi server. Hãy thử lại sau!' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server đang chạy tại cổng ${port}`));
