const apiKey = '45410a19bac403c84695ad21f382ab93';
let city = 'New Delhi'; // Default city

// Function to fetch current weather data
const fetchCurrentWeather = async (city) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather data not found for ${city}`);
        }
        const data = await response.json();
        
        // Update current weather data
        document.getElementById('temp').innerHTML = Math.round(data.main.temp);
        document.getElementById('humidity').innerHTML = data.main.humidity + '%';
        document.getElementById('wind_speed').innerHTML = data.wind.speed + ' m/s';
        document.getElementById('wind_degrees').innerHTML = data.wind.deg + '°';
        document.getElementById('feels_like').innerHTML = Math.round(data.main.feels_like) + '°C';
        document.getElementById('cloud_pct').innerHTML = data.clouds.all + '%';
        document.getElementById('min_temp').innerHTML = Math.round(data.main.temp_min) + '°C';
        document.getElementById('searchedCity').innerHTML = data.name;

        // Update sunrise and sunset times
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        document.getElementById('sunrise').textContent = `Sunrise: ${sunriseTime}`;
        document.getElementById('sunset').textContent = `Sunset: ${sunsetTime}`;

        // Update weather image based on conditions
        const weatherIcon = data.weather[0].icon;
        const imageToShow = document.getElementById("imageToShow");
        if (weatherIcon.includes('d')) { // Day time
            imageToShow.src = "img.png";
        } else { // Night time
            imageToShow.src = "img2.png";
        }

        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        alert(`Error: ${error.message}`);
    }
};

// Function to fetch forecast data
const fetchForecast = async (city) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Forecast data not found for ${city}`);
        }
        const data = await response.json();

        // Process and display forecast data
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = ''; // Clear previous forecast data

        // Create a map to store daily forecasts
        const dailyForecasts = new Map();

        // Process forecast data
        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            if (!dailyForecasts.has(day)) {
                dailyForecasts.set(day, {
                    temp: Math.round(forecast.main.temp),
                    icon: forecast.weather[0].icon,
                    description: forecast.weather[0].description
                });
            }
        });

        // Display only the next 7 days
        let count = 0;
        for (const [day, forecast] of dailyForecasts) {
            if (count >= 7) break;

            const dayContainer = document.createElement('div');
            dayContainer.classList.add('day-container');
            dayContainer.innerHTML = `
                ${day}<br>${forecast.temp}°C
                <img src="wea.png" alt="weather icon">
            `;
            forecastContainer.appendChild(dayContainer);
            count++;
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
};

// Function to update all weather data
const updateWeather = async (city) => {
    await fetchCurrentWeather(city);
    await fetchForecast(city);
};

// Event listener for form submission
document.getElementById('cityForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const newCity = document.getElementById('cityInput').value;
    if (newCity) {
        city = newCity;
        updateWeather(city);
    }
});

// Function to get current date and time
function getCurrentDateTime() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentDay = currentDate.getDay();

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[currentDay];

    const formattedTime = `${currentHour}:${currentMinutes < 10 ? "0" : ""}${currentMinutes}`;
    document.getElementById("currentDateTime").innerHTML = `${formattedTime}, ${dayOfWeek}`;
}

// Initial weather update and time display
updateWeather(city);
getCurrentDateTime();
setInterval(getCurrentDateTime, 60000); // Update time every minute