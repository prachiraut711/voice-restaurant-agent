const axios = require("axios");

const getWeatherForDate = async (date, city = "Mumbai") => {
  try {
    const API_KEY = process.env.WEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const forecastList = response.data.list;

    // simple selection (first forecast)
    const weather = forecastList[0];

    const condition = weather.weather[0].main.toLowerCase();
    const temperature = weather.main.temp;

    let seatingSuggestion = "indoor";

    if (condition.includes("clear") || condition.includes("sun")) {
      seatingSuggestion = "outdoor";
    }

    return {
      condition,
      temperature,
      seatingSuggestion
    };

  } catch (error) {
    console.log("Weather FULL ERROR:");
    console.log(error.response?.data || error.message);
    return null;
  }
};

module.exports = getWeatherForDate;