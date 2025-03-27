// Select DOM elements
const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weatherImg = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const locationNotFound = document.querySelector('.location-not-found');
const weatherBody = document.querySelector('.weather-body');

// Function to check weather
async function checkWeather(city) {
    // Check if the city is not empty
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    const url = `https://www.metaweather.com/api/location/search/?query=${city}`; // MetaWeather API for city search

    try {
        // Fetch city data from MetaWeather API
        const response = await fetch(url);

        // Handle errors for fetch
        if (!response.ok) {
            throw new Error("Failed to fetch city data");
        }

        const data = await response.json();

        // Check if city is found in the response
        if (data.length === 0) {
            throw new Error("City not found");
        }

        // Get WOEID (Where On Earth ID) for the city
        const woeid = data[0].woeid;
        const weatherUrl = `https://www.metaweather.com/api/location/${woeid}/`; // MetaWeather API for weather data

        // Fetch weather data for the city
        const weatherResponse = await fetch(weatherUrl);

        // Handle errors for weather fetch
        if (!weatherResponse.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const weatherData = await weatherResponse.json();

        // Hide "location not found" message and show weather body
        if (locationNotFound) locationNotFound.style.display = "none";
        if (weatherBody) weatherBody.style.display = "flex";

        // Update UI with weather data
        const weatherInfo = weatherData.consolidated_weather[0];
        temperature.innerHTML = `${Math.round(weatherInfo.the_temp)}°C`;
        description.innerHTML = weatherInfo.weather_state_name;
        humidity.innerHTML = `${weatherInfo.humidity}%`;
        windSpeed.innerHTML = `${weatherInfo.wind_speed} m/s`;

        // Update weather image based on condition
        const condition = weatherInfo.weather_state_name.toLowerCase();
        if (weatherImg) {
            if (condition.includes('cloud')) {
                weatherImg.src = "cloud.png";
            } else if (condition.includes('sunny')) {
                weatherImg.src = "clear.png";
            } else if (condition.includes('rain')) {
                weatherImg.src = "rain.png";
            } else if (condition.includes('mist')) {
                weatherImg.src = "mist.png";
            } else if (condition.includes('snow')) {
                weatherImg.src = "snow.png";
            } else {
                weatherImg.src = "default.png"; // Handle default or other conditions
            }
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);

        // Show "location not found" message and hide weather body
        if (locationNotFound) locationNotFound.style.display = "flex";
        if (weatherBody) weatherBody.style.display = "none";

        // Display the error message
        alert(error.message); // Optional: Display the error message in an alert
    }
}

// Add event listener to the search button
searchBtn.addEventListener('click', () => {
    const city = inputBox.value.trim();
    checkWeather(city);
});

// Allow pressing 'Enter' to search
inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = inputBox.value.trim();
        checkWeather(city);
    }
});
