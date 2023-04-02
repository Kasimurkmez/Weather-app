import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const formatTimestamp = (timestamp, timeZoneOffset) => {
    const date = new Date((timestamp + timeZoneOffset) * 1000);
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  };

  const apiKey = "fa4fc74aa8524dc62e41b88790084850";

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };
  const filterDailyForecasts = (forecasts) => {
    const dailyForecasts = [];

    for (let i = 0; i < forecasts.length; i += 8) {
      dailyForecasts.push(forecasts[i]);
    }

    return dailyForecasts;
  };

  const getWeatherData = async (e) => {
    e.preventDefault();
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`
      );
      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=tr`
      );
      const dailyForecasts = filterDailyForecasts(forecastResponse.data.list);
      setForecast(dailyForecasts);
    } catch (error) {
      console.error("Hava durumu verisi alınamadı:", error);
    }
    setCity("");
  };

  return (
    <div className="App">
      <form onSubmit={getWeatherData}>
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Şehir adı girin"
        />
        <button type="submit">Hava Durumunu Görüntüle</button>
      </form>
      {weather && (
        <div className="weather-container">
          <h3>{weather.name}</h3>
          <p>{weather.weather[0].description}</p>
          <p>Sıcaklık: {weather.main.temp}°C</p>
          <p>
            Güneş doğuşu:{" "}
            {formatTimestamp(weather.sys.sunrise, weather.timezone)}
          </p>
          <p>
            Güneş batışı:{" "}
            {formatTimestamp(weather.sys.sunset, weather.timezone)}
            <h2 className="forecast-title">5 Günlük Hava Durumu Tahmini</h2>
          </p>
        </div>
      )}
      {forecast.length > 0 && (
        <div className="forecast-container">
          {forecast.map((item, index) => (
            <div key={index} className="forecast-item">
              <h4>{new Date(item.dt * 1000).toLocaleDateString("tr-TR")}</h4>
              <img
                src={`https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
              />
              <p>{item.weather[0].description}</p>
              <p>Sıcaklık: {item.main.temp}°C</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
