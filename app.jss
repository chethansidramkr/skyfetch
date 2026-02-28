const API_KEY = "43770ad32b80a09d8e722aba3d8e4524";


/* =========================
   Constructor
========================= */
function WeatherApp() {
  this.cityInput = document.getElementById("cityInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.messageDiv = document.getElementById("message");
  this.weatherDiv = document.getElementById("weather");
  this.forecastDiv = document.getElementById("forecast");

  this.recentList = document.getElementById("recentList");
  this.clearBtn = document.getElementById("clearHistory");

  this.recentSearches = [];
}

/* =========================
   Init
========================= */
WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
  this.clearBtn.addEventListener("click", this.clearHistory.bind(this));

  this.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") this.handleSearch();
  });

  this.loadRecentSearches();
  this.loadLastCity();
};

/* =========================
   UI Helpers
========================= */
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
   API Calls
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
    this.displayForecast(this.processForecastData(forecastRes.data.list));

    this.saveRecentSearch(city);
    localStorage.setItem("lastCity", city);

    this.searchBtn.disabled = false;
  } catch {
    this.showError("City not found");
  }
};

/* =========================
   Display Weather
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
   Forecast
========================= */
WeatherApp.prototype.processForecastData = function (list) {
  return list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (days) {
  this.forecastDiv.innerHTML = "";
  days.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    this.forecastDiv.innerHTML += `
      <div class="forecast-card">
        <h4>${dayName}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
        <p>${day.main.temp} °C</p>
      </div>
    `;
  });
};

/* =========================
   localStorage – Part 4
========================= */
WeatherApp.prototype.loadRecentSearches = function () {
  const data = JSON.parse(localStorage.getItem("recentSearches")) || [];
  this.recentSearches = data;
  this.displayRecentSearches();
};

WeatherApp.prototype.saveRecentSearch = function (city) {
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  this.recentSearches = this.recentSearches.filter(c => c !== city);
  this.recentSearches.unshift(city);

  if (this.recentSearches.length > 5) {
    this.recentSearches.pop();
  }

  localStorage.setItem("recentSearches", JSON.stringify(this.recentSearches));
  this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
  this.recentList.innerHTML = "";

  this.recentSearches.forEach(function (city) {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.className = "recent-btn";
    btn.addEventListener("click", () => this.getWeather(city));
    this.recentList.appendChild(btn);
  }.bind(this));
};

WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    this.getWeather(lastCity);
  }
};

WeatherApp.prototype.clearHistory = function () {
  localStorage.removeItem("recentSearches");
  localStorage.removeItem("lastCity");
  this.recentSearches = [];
  this.displayRecentSearches();
};

/* =========================
   Start App
========================= */
const app = new WeatherApp();
app.init();
