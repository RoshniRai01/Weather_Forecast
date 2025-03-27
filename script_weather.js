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

    const apiKey = "c14997a93a5dafb568365fedcd9e2adf"; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Fetch city weather data from OpenWeatherMap API
        const response = await fetch(url);

        // Handle errors for fetch
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const weatherData = await response.json();

        // Check if location is valid
        if (weatherData.cod !== 200) {
            throw new Error("City not found");
        }

        // Hide "location not found" message and show weather body
        if (locationNotFound) locationNotFound.style.display = "none";
        if (weatherBody) weatherBody.style.display = "flex";

        // Update UI with weather data
        temperature.innerHTML = `${Math.round(weatherData.main.temp)}°C`;
        description.innerHTML = weatherData.weather[0].description;
        humidity.innerHTML = `${weatherData.main.humidity}%`;
        windSpeed.innerHTML = `${weatherData.wind.speed} m/s`;

        // Update weather image based on condition
        const condition = weatherData.weather[0].description.toLowerCase();
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
