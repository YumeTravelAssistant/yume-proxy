const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Per leggere JSON nelle richieste POST
app.use(express.json());

// Percorso base
app.get('/', (req, res) => {
  res.send('Yume Proxy Azure: funziona!');
});

// Percorso API
try {
  app.use('/api', require('./api/proxy.js'));
} catch (error) {
  console.error('Errore caricando /api/proxy.js:', error.message);
}

app.listen(port, () => {
  console.log(`✅ Server in ascolto sulla porta ${port}`);
});

