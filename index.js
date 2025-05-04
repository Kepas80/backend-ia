const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🟢 Backend Unsplash funcionando');
});

app.post('/api/buscar-unsplash', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: true, message: 'Prompt vacío' });
  }

  try {
    const ACCESS_KEY = process.env.UNSPLASH_API_KEY;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=1&client_id=${ACCESS_KEY}`;

    const response = await axios.get(url);
    const result = response.data.results;

    if (!result.length) {
      return res.status(404).json({ error: true, message: 'No se encontraron imágenes.' });
    }

    const imageUrl = result[0].urls?.regular || result[0].urls?.full;
    res.json({ imageUrl });

  } catch (error) {
    console.error('❌ Error searching Unsplash:', error.response?.data || error.message);
    res.status(500).json({
      error: true,
      message: error.response?.data?.errors?.[0] || 'Error al buscar en Unsplash'
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
