require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/checkin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkin.html'));
});

app.get('/owner', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'owner.html'));
});

// EJEMPLO endpoint (dejá los tuyos igual)
app.post('/checkin', (req, res) => {
  res.json({ success: true });
});

// IMPORTANTE para Vercel
module.exports = app;

// Solo para local
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log('Server corriendo en ' + PORT));
}