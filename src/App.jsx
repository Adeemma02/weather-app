import React, { useState, useEffect } from 'react';
import './App.css';

const WeatherApp = () => {
  const [city, setCity] = useState('lagos'); 
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentDate = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  const myStyle = {
    color: 'black',
    fontSize: '25px',
    paddingTop: '50px'
  };

  const API_KEY = '6e7a8e24f44247ec893224228251202'; 
  const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`; 

  useEffect(() => {
    fetchWeatherData();
    setCity('');
  }, []); 

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null); 

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); 
      }
      const data = await response.json();
      console.log(data);
      setWeatherData(data);
    } catch (err) {
      console.error("Error fetching weather data:", err); 
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };


  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchWeatherData();
    setCity('');
  };

  if (loading) {
    return <div style={myStyle}>Loading...</div>;
  }

  // if (error) {
  //   return <div style={myStyle}>{error}</div>;
  // }

  if (!weatherData) {
    return <div style={myStyle}>No weather data available yet.</div>; 
  }

  // Example of how to access and display data:
  const current = weatherData.current;
  const location = weatherData.location;
  const forecastDays = weatherData.forecast.forecastday;

  return (
    <div className='body'>
      <h1 className='header'><span>AdeEmma</span> Weather App</h1>
      <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  className='search-input'
                  placeholder="Enter city name"
                  value={city}
                  onChange={handleCityChange}
                  required
                />
                <button type="submit" className='search-btn'>Search</button>
              </form>

              {error && (
        <div style={{ fontSize: "20px", padding: "10px",  color: "red", fontWeight: "bold" }}>
          <p>Please check the spelling or search for a different city. </p>
        </div>
      )}

       <h2 className="display-date">{formattedDate}</h2>
       <h2 className='display-name'>{location.name}, {location.country}</h2>
      <img className='display-img' src={current.condition.icon} alt={current.condition.text} />
      <p className='display-text'>{current.condition.text}</p>
      <div className="contents">
      <p><i class="fa-solid fa-temperature-quarter ic"></i>Temperature <br /> {current.temp_c}°C</p>
        <p><i class="fa-solid fa-temperature-quarter ic"></i>Temperature <br /> {current.temp_f}°f</p>
        <p><i class="fa-solid fa-wind ic"></i>wind <br /> {current.wind_kph} Kph</p>
        <p><i class="fa-solid fa-water ic"></i>Humidity <br /> {current.humidity}%</p>
      </div>

      <h3 className='next'>5-Days Forecast</h3>
      <div className='futures'>
        {forecastDays.map((day) => (
          <div key={day.date} className='future'>
            <p>{day.date}</p>
            <img className='future-img' src={current.condition.icon} alt={current.condition.text} />
            <p>High: {day.day.maxtemp_c}°C</p>
            <p>Low: {day.day.mintemp_c}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;