const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/buscar-unsplash', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: true, message: 'Falta el prompt.' });
  }

  try {
    const ACCESS_KEY = process.env.UNSPLASH_API_KEY;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=1&client_id=${ACCESS_KEY}`;

    const response = await axios.get(url);
    const result = response.data.results;

    if (result.length === 0) {
      return res.status(404).json({ error: true, message: 'No se encontraron imágenes para ese término.' });
    }

    const image = result[0].urls.regular;
    res.json({ imageUrl: image });

  } catch (error) {
    console.error('Error en la API de Unsplash:', error.response?.data || error.message);
    res.status(500).json({
      error: true,
      message: error.response?.data?.errors?.[0] || 'Error al buscar en Unsplash'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Unsplash activo en http://localhost:${PORT}`);
});
