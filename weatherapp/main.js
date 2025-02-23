const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;
const OM_BASE_URL = 'open-meteo.com/v1/';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
        return res.status(400).send({ error: 'Latitude and Longitude are required' });
    }

    try {
        const response = await axios.get(`https://api.${OM_BASE_URL}/forecast/?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&forecast_days=1`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching weather data' });
    }
});

app.get('/getcities/:city', async (req, res) => {
    const city = req.params.city;
    if (!city) {
        return res.status(400).send({ error: 'City is required' });
    }

    try {
        const response = await axios.get(`https://geocoding-api.${OM_BASE_URL}/search?name=${city}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching city data' });
    }
});

app.listen(port || 3000, () => {
    console.log(`Weather app listening at http://localhost:${port}`);
});