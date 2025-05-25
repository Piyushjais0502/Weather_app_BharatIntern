const apiKey = '45410a19bac403c84695ad21f382ab93';
const city = 'New Delhi';

// Function to fetch and display forecast data
const fetchForecastData = async () => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Display forecast for each day
        const forecastResults = document.getElementById('forecastResults');
        forecastResults.innerHTML = ''; // Clear previous results

        // Create a map to store daily forecasts
        const dailyForecasts = new Map();

        // Process forecast data
        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            if (!dailyForecasts.has(day)) {
                dailyForecasts.set(day, {
                    maxTemp: forecast.main.temp,
                    minTemp: forecast.main.temp,
                    description: forecast.weather[0].description
                });
            } else {
                const current = dailyForecasts.get(day);
                current.maxTemp = Math.max(current.maxTemp, forecast.main.temp);
                current.minTemp = Math.min(current.minTemp, forecast.main.temp);
            }
        });

        // Display the forecast
        for (const [day, forecast] of dailyForecasts) {
            const forecastString = `${day}: ${forecast.description}, Max: ${Math.round(forecast.maxTemp)}°C, Min: ${Math.round(forecast.minTemp)}°C<br>`;
            forecastResults.innerHTML += forecastString;
        }

    } catch (error) {
        console.error('Error:', error);
        const forecastResults = document.getElementById('forecastResults');
        forecastResults.innerHTML = `Error fetching weather data: ${error.message}`;
    }
};

// Call the function to fetch and display forecast data
fetchForecastData();

