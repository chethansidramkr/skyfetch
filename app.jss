const API_KEY = "43770ad32b80a09d8e722aba3d8e4524";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const messageDiv = document.getElementById("message");

// Show loading state
function showLoading() {
  messageDiv.innerHTML = "<p class='loading'>Loading...</p>";
  searchBtn.disabled = true;
}

// Show error message
function showError(msg) {
  messageDiv.innerHTML = `<p class="error">${msg}</p>`;
  searchBtn.disabled = false;
}

// Clear messages
function clearMessage() {
  messageDiv.innerHTML = "";
}

// Display weather data
function displayWeather(data) {
  document.getElementById("city").innerText = data.name;
  document.getElementById("temp").innerText = `🌡 ${data.main.temp} °C`;
  document.getElementById("description").innerText =
    data.weather[0].description;
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  searchBtn.disabled = false;
}

// Fetch weather using async/await
async function getWeather(city) {
  if (!city) {
    showError("Please enter a city name");
    return;
  }

  showLoading();

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await axios.get(url);

    clearMessage();
    displayWeather(response.data);
  } catch (error) {
    showError("City not found. Please try again.");
  }
}

// Button click event
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  getWeather(city);
  cityInput.value = "";
});

// Enter key support
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Initial welcome message
messageDiv.innerHTML =
  "<p>Search for a city to see the weather 🌍</p>";
