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
    const apiKey = "aa49c18f4fc849bd90934558242907"; // Replace with your actual API key
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    console.log("Fetching from API");
    try {
        const response = await fetch(url);
        const weatherData = await response.json();

        // Check if location is found
        if (weatherData.error) {
            if (locationNotFound) locationNotFound.style.display = "flex";
            if (weatherBody) weatherBody.style.display = "none";
            console.log("Location not found");
            return;
        }

        console.log("Weather data received");
        if (locationNotFound) locationNotFound.style.display = "none";
        if (weatherBody) weatherBody.style.display = "flex";

        // Update UI with weather data
        if (temperature) temperature.innerHTML = `${Math.round(weatherData.current.temp_c)}°C`;
        if (description) description.innerHTML = `${weatherData.current.condition.text}`;
        if (humidity) humidity.innerHTML = `${weatherData.current.humidity}%`;
        if (windSpeed) windSpeed.innerHTML = `${weatherData.current.wind_kph} Km/H`;

        // Update weather image based on condition
        if (weatherImg) {
            const condition = weatherData.current.condition.text.toLowerCase(); // Convert to lowercase for consistency

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
