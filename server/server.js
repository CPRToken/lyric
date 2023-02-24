import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, 
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });
    next();
});

app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message:'Its working',
    })
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
        presence_penalty: 0

      });

      res.status(200).send({
        result: response.data.choices[0].text
      });

      const user_id = 'user_id'; // replace this with the actual user id
      const client_name = 'AdminLyric'; // replace this with the actual client name
      const client_content = response.data.choices[0].text;
      const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const userFolder = `./my-content/${user_id}`;
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder);
      }

      const fileName = `${userFolder}/${client_name}-${created_at}.txt`;
      fs.writeFile(fileName, client_content, (err) => {
        if (err) {
          console.error(err);
        }
      });
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});

app.listen(5000, () => console.log('server is running on port http://localhost:5000'));
