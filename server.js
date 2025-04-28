const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Percorso base
app.get('/', (req, res) => {
  res.send('Yume Proxy Azure: funziona!');
});

// Percorso API
app.use('/api', require('./api/proxy.js'));

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});

