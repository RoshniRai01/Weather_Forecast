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

console.log("Entering JS Section");

// Function to check weather
async function checkWeather(city) {
    const apiKey = "your_openweathermap_api_key_here"; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // API URL
    console.log("Fetching from API");

    try {
        const response = await fetch(url);
        const weatherData = await response.json();

        // Check if location is found
        if (weatherData.cod !== 200) {
            console.log("Location not found");
            if (locationNotFound) locationNotFound.style.display = "flex";
            if (weatherBody) weatherBody.style.display = "none";
            return;
        }

        console.log("Weather data received");

        // Hide location not found and show weather body
        if (locationNotFound) locationNotFound.style.display = "none";
        if (weatherBody) weatherBody.style.display = "flex";

        // Update UI with weather data
        if (temperature) temperature.innerHTML = `${Math.round(weatherData.main.temp)}°C`;
        if (description) description.innerHTML = `${weatherData.weather[0].description}`;
        if (humidity) humidity.innerHTML = `${weatherData.main.humidity}%`;
        if (windSpeed) windSpeed.innerHTML = `${weatherData.wind.speed} m/s`;

        // Update weather image based on condition
        if (weatherImg) {
            const condition = weatherData.weather[0].description.toLowerCase();

            if (condition.includes('cloudy')) {
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
                console.log('Default image');
            }
        }

        console.log(weatherData);
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
