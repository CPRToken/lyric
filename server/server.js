import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import https from 'https';
import qs from 'querystring';

dotenv.config();

console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'It is working!',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const temperature = req.body.temperature || 0.5;
    const max_tokens = req.body.max_tokens || 100;

    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
      temperature: parseFloat(temperature),
      max_tokens: parseInt(max_tokens),
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0,
    });

    const postData = qs.stringify({
      title: response.data.choices[0].text,
    });

    const options = {
      hostname: 'lyricwriter.ai', // Replace with your WordPress site URL
      path: '/wp-content/themes/generatepress-child/apipost.php', // Replace with the path to the second PHP script on your server
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
      },
    };

   

    res.status(200).send({ message: 'Success' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
