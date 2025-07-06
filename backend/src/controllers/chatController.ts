import { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { logger } from '../middleware/logger';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body as { message: string };
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    logger.info(`Chatbot prompt: ${message.substring(0, 100)}`);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are PropertyConnect AI assistant helping users with real-estate queries.' },
        { role: 'user', content: message },
      ],
    });

    const reply = completion.data.choices[0].message?.content ?? '';

    res.json({ success: true, reply });
  } catch (err) {
    logger.error('Chatbot error', err);
    res.status(500).json({ error: 'Failed to generate reply' });
  }
};

export default { sendMessage };