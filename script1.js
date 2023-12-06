const apiKey = '45410a19bac403c84695ad21f382ab93';
const city = 'New Delhi';
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

// Make the API request using the Fetch API
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Organize forecasts by date and track max temperature for each day
    const dailyMaxTemps = {};

    data.list.forEach(forecast => {
      const timestamp = forecast.dt;
      const date = new Date(timestamp * 1000);
      const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long' });

      // Convert temperature from Kelvin to Celsius
      const temperatureKelvin = forecast.main.temp;
      const temperatureCelsius = temperatureKelvin - 273.15;

      // Update max temperature for the day
      if (!dailyMaxTemps[formattedDate] || temperatureCelsius > dailyMaxTemps[formattedDate]) {
        dailyMaxTemps[formattedDate] = temperatureCelsius;
      }
    });

    // Display max temperatures for each day
    const forecastResults = document.getElementById('forecastResults');
    for (const date in dailyMaxTemps) {
      // console.log(`Date: ${date}, Max Temperature: ${dailyMaxTemps[date].toFixed(2)} °C`);
      
      // Update the HTML element with forecast information
      forecastResults.innerHTML += ` ${date}, Max Temperature: ${dailyMaxTemps[date].toFixed(2)} °C`;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

