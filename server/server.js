import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';


dotenv.config();

console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const https = require('https');
const qs = require('querystring');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Its working POST!',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const temperature = req.body.temperature || 0.5;
    const max_tokens = req.body.max_tokens || 100;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: parseFloat(temperature),
      max_tokens: parseInt(max_tokens),
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0,
    });
    
    
    
    
  const postData = qs.stringify({
      'title': response.data.choices[0].text,
    });

    const options = {
      hostname: 'lyricwriter.ai',
      path: '/newpost.php',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
      },
    };

    const postReq = https.request(options, (postRes) => {
      postRes.on('data', (chunk) => {
        console.log(`Response: ${chunk}`);
      });
    });

    postReq.on('error', (error) => {
      console.error(error);
    });

    postReq.write(postData);
    postReq.end();

    res.status(200).send({ message: 'Success' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


app.listen(5000, () => console.log('server is running on port http://localhost:5000'));
