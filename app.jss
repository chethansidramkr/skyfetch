const API_KEY = "43770ad32b80a09d8e722aba3d8e4524";

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  axios.get(url)
    .then(response => {
      console.log(response.data);
      displayWeather(response.data);
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
    });
}

function displayWeather(data) {
  document.getElementById("city").innerText = data.name;
  document.getElementById("temp").innerText = `🌡 ${data.main.temp} °C`;
  document.getElementById("description").innerText = data.weather[0].description;
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Initial call (hardcoded city)
fetchWeather("London");
