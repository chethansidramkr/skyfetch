const API_KEY = "43770ad32b80a09d8e722aba3d8e4524";


/* =========================
   Constructor Function
========================= */
function WeatherApp() {
  this.cityInput = document.getElementById("cityInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.messageDiv = document.getElementById("message");
  this.weatherDiv = document.getElementById("weather");
  this.forecastDiv = document.getElementById("forecast");
}

/* =========================
   Init
========================= */
WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
  this.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") this.handleSearch();
  });
  this.showWelcome();
};

/* =========================
   UI Helpers
========================= */
WeatherApp.prototype.showWelcome = function () {
  this.messageDiv.innerHTML = "<p>Search for a city to see the weather 🌍</p>";
};

WeatherApp.prototype.showLoading = function () {
  this.messageDiv.innerHTML = "<p class='loading'>Loading...</p>";
  this.searchBtn.disabled = true;
};

WeatherApp.prototype.showError = function (msg) {
  this.messageDiv.innerHTML = `<p class="error">${msg}</p>`;
  this.searchBtn.disabled = false;
};

WeatherApp.prototype.clearMessage = function () {
  this.messageDiv.innerHTML = "";
};

/* =========================
   Search Handler
========================= */
WeatherApp.prototype.handleSearch = function () {
  const city = this.cityInput.value.trim();
  this.cityInput.value = "";

  if (!city) {
    this.showError("Please enter a city name");
    return;
  }

  this.getWeather(city);
};

/* =========================
   API Calls (Promise.all)
========================= */
WeatherApp.prototype.getWeather = async function (city) {
  this.showLoading();
  this.weatherDiv.innerHTML = "";
  this.forecastDiv.innerHTML = "";

  const currentURL =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const forecastURL =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentURL),
      axios.get(forecastURL)
    ]);

    this.clearMessage();
    this.displayWeather(currentRes.data);
    const dailyData = this.processForecastData(forecastRes.data.list);
    this.displayForecast(dailyData);
    this.searchBtn.disabled = false;
  } catch (error) {
    this.showError("City not found. Please try again.");
  }
};

/* =========================
   Display Current Weather
========================= */
WeatherApp.prototype.displayWeather = function (data) {
  this.weatherDiv.innerHTML = `
    <div class="weather-card">
      <h2>${data.name}</h2>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
      <p>🌡 ${data.main.temp} °C</p>
      <p>${data.weather[0].description}</p>
    </div>
  `;
};

/* =========================
   Forecast Processing
========================= */
WeatherApp.prototype.processForecastData = function (list) {
  return list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (days) {
  days.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    this.forecastDiv.innerHTML += `
      <div class="forecast-card">
        <h4>${dayName}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
        <p>${day.main.temp} °C</p>
        <p>${day.weather[0].description}</p>
      </div>
    `;
  });
};

/* =========================
   Create App Instance
========================= */
const app = new WeatherApp();
app.init();
