const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir arquivos estáticos da pasta Public
app.use(express.static(path.join(__dirname, 'Public')));

// Servir arquivos da raiz (manifest e service-worker)
app.use(express.static(path.join(__dirname)));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// Rotas específicas para manifest e service-worker (fallback)
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'manifest.json'));
});

app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'service-worker.js'));
});

// Iniciar servidor HTTP
app.listen(PORT, () => {
  console.log(`✅ Servidor HTTP rodando em http://localhost:${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
});