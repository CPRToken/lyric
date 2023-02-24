import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import nodemailer from 'nodemailer';
import fs from 'fs';

dotenv.config();

console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const transporter = nodemailer.createTransport({
  service: 'mail.lyricwriter.ai',
  auth: {
    user: 'process.env.EMAIL_USERNAME',
    pass: 'process.env.EMAIL_PASSWORD',
  },
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Its working',
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

    const generatedText = response.data.choices[0].text;

    // Write the generated text to a file named "generated_text.txt"
    fs.appendFile(`Your_Lyrics_${Date.now()}.txt`, generatedText, (err) => {
      if (err) {
        console.log('Error appending to file: ', err);
        throw err;
      } else {
        console.log('The file has been updated! Generated text:', generatedText);
      }
    });
    

  
  
  
  
  
  
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: 'orders@lyricwriter.ai',
      subject: 'New Generated Text',
      text: generatedText,
    };

    // Send email with generated text as content
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).send({
      result: generatedText,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.listen(5000, () => console.log('server is running on port http://localhost:5000'));
