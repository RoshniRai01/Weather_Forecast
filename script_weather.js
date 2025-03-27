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
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    // URL to search the location by city name
    const url = `https://www.metaweather.com/api/location/search/?query=${city}`;

    try {
        // Fetch city weather data from MetaWeather API
        const response = await fetch(url);

        // Handle errors for fetch (e.g., no internet connection)
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const locationData = await response.json();

        // Check if the city was found
        if (locationData.length === 0) {
            throw new Error("City not found");
        }

        // Fetch weather details for the first location found
        const woeid = locationData[0].woeid;
        const weatherUrl = `https://www.metaweather.com/api/location/${woeid}/`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Hide "location not found" message and show weather body
        if (locationNotFound) locationNotFound.style.display = "none";
        if (weatherBody) weatherBody.style.display = "flex";

        // Get the current weather details
        const currentWeather = weatherData.consolidated_weather[0];

        // Update UI with weather data
        temperature.innerHTML = `${Math.round(currentWeather.the_temp)}°C`;
        description.innerHTML = currentWeather.weather_state_name;
        humidity.innerHTML = `${currentWeather.humidity}%`;
        windSpeed.innerHTML = `${currentWeather.wind_speed.toFixed(1)} m/s`;

        // Update weather image based on condition
        const condition = currentWeather.weather_state_name.toLowerCase();
        if (weatherImg) {
            if (condition.includes('cloud')) {
                weatherImg.src = "cloud.png";  // Make sure to use correct image files or URLs
            } else if (condition.includes('sunny') || condition.includes('clear')) {
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
