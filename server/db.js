import mysql from 'mysql2/promise';
import fs from 'fs';


const pool = mysql.createPool({
  host: '192.67.255.218',
  user: 'onlines2_mike',
  password: 'Ll@ves196214',
  database: 'onlines2_test',
});

xport async function insertText(filePath) {
  const connection = await pool.getConnection();
  
  try {
    const text = await fs.promises.readFile(filePath, 'utf-8');
    const name = `your_lyrics_${Date.now()}.docx`;
    await connection.query('INSERT INTO songs (name, content) VALUES (?, ?)', [name, text]);
  } finally {
    connection.release();
  }
}
