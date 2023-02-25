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



const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Its working assholes!',
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
const fileName = `your_lyrics_${Date.now()}.docx`;

 


fs.appendFile(fileName, generatedText, (err) => {
  if (err) {
    console.log('Error writing file:', err);
    throw err;
  
  
     } else {
    console.log('The file has been updated! Generated text:', generatedText);
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
