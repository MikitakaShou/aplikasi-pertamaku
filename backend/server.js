import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://sammyghoutansitompul.tech/',
  optionsSuccessStatus: 200,
}));


const connection = new sqlite3.Database('./db/aplikasi.db');

// Serve static files from the public directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.get(query, [req.params.id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
    res.json(result);
  });
});


app.post('/api/user/:id/change-email', (req, res) => {
  const newEmail = req.body.email;
  const query = `UPDATE users SET email = ? WHERE id = ?`;

  connection.run(query, [newEmail, req.params.id], function (err) {
    if (err) throw err;
    if (this.changes === 0) res.status(404).send('User not found');
    else res.status(200).send('Email updated successfully');
  });
});


app.get('/api/file', (req, res) => {
  const fileName = path.basename(req.query.name);
  const filePath = path.join(__dirname, 'files', fileName);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(err.status).end();
    }
  });
});


// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});