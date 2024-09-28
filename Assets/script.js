const apiKey = "4306c235667aa0ec6fe94b629fa05792";

// event listener for form submission
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value; // get the city name from input
    fetchWeatherData(city); // call fetch weather data function for entered city
  });

// function to fetch weather data based on city name
function fetchWeatherData(city) {
  const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(geoUrl)
    .then((response) => response.json()) // parse the response as JSON
    .then((data) => {
      console.log(data); // to find out what are the data values
      const { lat, lon } = data.coord; // destructure latitude and longitude from response object
      const { name } = data; // destructure name
      console.log(lat, lon, name);
      saveSearchHistory(name); //call function save the city name to search history
      fetchForecast(lat, lon); // fetch the weather forecast using coordinates
      displayCurrentWeather(data); // display current weather data
    })
    .catch((error) => console.error("Error fetching data:", error)); // log errors
}

// function to fetch the 5-day weather forecast
function fetchForecast(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`; //url for forecast data

  fetch(forecastUrl) // fetch the forecast data
    .then((response) => response.json()) // parse response as JSON
    .then((data) => displayForecast(data)) // call function to display forecast
    .catch((error) => console.error("Error fetching forecast:", error));
}

// function to display the 5-day forecast
function displayCurrentWeather(data) {
  const { name, main, wind, weather } = data; // relevant data
  const currentWeatherDiv = document.getElementById("currentWeather"); // hook into dom current weather div
  currentWeatherDiv.classList.add("weather-card");
  currentWeatherDiv.innerHTML = `
        <h2>${name}</h2> 
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <img class="icon" src="http://openweathermap.org/img/wn/${
          weather[0].icon
        }.png" alt="${weather[0].description}">
        <p>Temperature: ${main.temp}°C</p>

        <p>Humidity: ${main.humidity}%</p>

        <p>Wind Speed: ${wind.speed} m/s</p>
         
    `;
}

function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast"); // hook into forecast div
  forecastDiv.innerHTML = "<h2>5-Day Forecast</h2>";
  console.log(data);

  data.list.forEach((entry, index) => {
    if (index % 8 === 0) {
      // Only get one entry for each day
      const date = new Date(entry.dt * 1000).toLocaleDateString();
      const temp = entry.main.temp;
      const humidity = entry.main.humidity;
      const windSpeed = entry.wind.speed;
      const icon = entry.weather[0].icon;

      // create weather card for the forecast
      forecastDiv.innerHTML += `
                <div class="weather-card">
                    <p>Date: ${date}</p>
                    <img class="icon" src="http://openweathermap.org/img/wn/${icon}.png" alt="${entry.weather[0].description}">
                    <p>Temperature: ${temp} °C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                </div>
            `;
    }
  });
}
// Function to save search history to localStorage
function saveSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || []; // Get existing history or create an empty array

  if (!history.includes(city)) {
    // If city is not already in history
    history.push(city); // Add city to history
    localStorage.setItem("searchHistory", JSON.stringify(history)); // Save updated history to localStorage
    updateSearchHistoryUI(); // Update the UI to show the new history
  }
}
// Function to update the search history UI
function updateSearchHistoryUI() {
  const historyList = document.getElementById("searchHistory"); // Get the search history list
  historyList.innerHTML = ""; // Clear existing list
  const history = JSON.parse(localStorage.getItem("searchHistory")) || []; // Get history from localStorage

  history.forEach((city) => {
    const li = document.createElement("li"); // Create a new list item
    li.textContent = city; // Set text content to the city name
    li.addEventListener("click", () => fetchWeatherData(city)); // Add click event to fetch weather for clicked city
    historyList.appendChild(li); // Append list item to the history list
  });
}

// On page load, populate search history
document.addEventListener("DOMContentLoaded", updateSearchHistoryUI);
