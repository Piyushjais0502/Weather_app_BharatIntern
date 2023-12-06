const apiKey = '45410a19bac403c84695ad21f382ab93';
    let city = 'New Delhi'; // Default city

    // Function to fetch weather data from RapidAPI
    const fetchData = async (city) => {
      const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "629d0bc979msh3d3bb698cc195f4p199586jsn78abd05f4e9c",
          "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();

        // Update HTML elements with weather data
        document.getElementById('temp').innerHTML = result.temp;
        document.getElementById('humidity').innerHTML = result.humidity;
        document.getElementById('wind_speed').innerHTML = result.wind_speed;
        document.getElementById('wind_degrees').innerHTML = result.wind_degrees;
        document.getElementById('feels_like').innerHTML = result.feels_like;
        document.getElementById('cloud_pct').innerHTML = result.cloud_pct;
        document.getElementById('min_temp').innerHTML = result.min_temp;
        document.getElementById('searchedCity').innerHTML = city;

        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };

    // Function to fetch weather data from OpenWeatherMap
    const fetchOpenWeatherData = (city) => {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

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
          const forecastContainer = document.getElementById('forecastContainer');
          forecastContainer.innerHTML = ''; // Clear previous forecast data

          for (const date in dailyMaxTemps) {
            // Create a container for each day's forecast
            const dayContainer = document.createElement('div');
            dayContainer.classList.add('day-container');

            // Update the HTML element with forecast information
            dayContainer.innerHTML = ` ${date}  ${dailyMaxTemps[date].toFixed(2)} °C`;

            const dayImage = document.createElement('img');
            dayImage.src = 'wea.png';
            dayContainer.appendChild(dayImage);

            // Append the day's container to the main forecast container
            forecastContainer.appendChild(dayContainer);
          }

          // Extract and display sunrise and sunset times
          const sunriseTimestamp = data.city.sunrise;
          const sunsetTimestamp = data.city.sunset;

          const sunriseTime = new Date(sunriseTimestamp * 1000).toLocaleTimeString();
          const sunsetTime = new Date(sunsetTimestamp * 1000).toLocaleTimeString();

          document.getElementById('sunrise').textContent = `Sunrise: ${sunriseTime}`;
          document.getElementById('sunset').textContent = `Sunset: ${sunsetTime}`;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    // Call the fetchData and fetchOpenWeatherData functions with the default city
    fetchData(city);
    fetchOpenWeatherData(city);

    // Event listener for form submission
    document.getElementById('cityForm').addEventListener('submit', function (event) {
      event.preventDefault();
      const newCity = document.getElementById('cityInput').value;

      // Update the city variable and call the fetchData and fetchOpenWeatherData functions
      city = newCity;
      fetchData(city);
      fetchOpenWeatherData(city);
    });

    // Function to get current date and time
    function getCurrentDateTime() {
      var currentDate = new Date();
      var currentHour = currentDate.getHours();
      var currentMinutes = currentDate.getMinutes();
      var currentDay = currentDate.getDay();

      var imageToShow = document.getElementById("imageToShow");

      if (currentHour < 12) {
        imageToShow.src = "img.png";
      } else {
        imageToShow.src = "img2.png";
      }

      var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var dayOfWeek = daysOfWeek[currentDay];

      var formattedTime = currentHour + ":" + (currentMinutes < 10 ? "0" : "") + currentMinutes;

      document.getElementById("currentDateTime").innerHTML = formattedTime + "," + dayOfWeek;
    }

    getCurrentDateTime();

    setInterval(getCurrentDateTime, 60000);