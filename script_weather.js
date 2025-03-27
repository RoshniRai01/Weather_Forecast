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
    const searchUrl = `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${city}`; // Add CORS proxy

    try {
        // Step 1: Fetch the location data using the city name
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        // If no location is found, display the "Location not found" message
        if (searchData.length === 0) {
            if (locationNotFound) locationNotFound.style.display = "flex";
            if (weatherBody) weatherBody.style.display = "none";
            console.log("Location not found");
            return;
        }

        // Get the WOEID (Where On Earth ID) for the first result
        const woeid = searchData[0].woeid;
        console.log("Found location, WOEID:", woeid);

        // Step 2: Fetch the weather data using the WOEID
        const weatherUrl = `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`; // Add CORS proxy
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Check if weather data is available
        if (weatherData.consolidated_weather && weatherData.consolidated_weather.length > 0) {
            const currentWeather = weatherData.consolidated_weather[0]; // Get the first day's weather data

            // Successful fetch
            console.log("Weather data received");
            if (locationNotFound) locationNotFound.style.display = "none";
            if (weatherBody) weatherBody.style.display = "flex";

            // Update UI with weather data
            if (temperature) temperature.innerHTML = `${Math.round(currentWeather.the_temp)}°C`;
            if (description) description.innerHTML = `${currentWeather.weather_state_name}`;
            if (humidity) humidity.innerHTML = `${currentWeather.humidity}%`;
            if (windSpeed) windSpeed.innerHTML = `${currentWeather.wind_speed} Km/H`;

            // Update weather image based on condition
            if (weatherImg) {
                const condition = currentWeather.weather_state_name.toLowerCase();

                if (condition.includes('cloudy')) {
                    weatherImg.src = "cloud.png";
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
                    console.log('Default image');
                }
            }
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        if (locationNotFound) locationNotFound.style.display = "flex";
        if (weatherBody) weatherBody.style.display = "none";
    }
}

// Add event listener to the search button
searchBtn.addEventListener('click', () => {
    const city = inputBox.value.trim();
    if (city) {
        checkWeather(city);
    } else {
        alert("Please enter a city name.");
    }
});
