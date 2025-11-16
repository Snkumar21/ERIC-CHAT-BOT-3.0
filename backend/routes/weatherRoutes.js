const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/current", async (req, res) => {
    try {
        const city = req.query.city;

        if (!city) {
            return res.status(400).json({ error: "City is required" });
        }

        const apiKey = process.env.WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const data = response.data;

        return res.json({
            success: true,
            city: data.name,
            temperature: data.main.temp + "°C",
            feels_like: data.main.feels_like + "°C",
            humidity: data.main.humidity + "%",
            condition: data.weather[0].description
        });
    } catch (error) {
        console.error("Weather API Error:", error);
        return res.json({ success: false, error: "Unable to fetch weather" });
    }
});

module.exports = router;