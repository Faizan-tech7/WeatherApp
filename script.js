const API_KEY = "ca562b45b9cafd91bc776f29e371aada";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loader = document.getElementById("loader");

const errorBox = document.getElementById("errorBox");
const errorText = document.getElementById("errorText");

const retryBtn = document.getElementById("retryBtn");

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

const saveCityBtn = document.getElementById("saveCity");
// VARIABLES
let lastCity = "";

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}
// ERROR
function showError(message) {
  errorText.textContent = message;
  errorBox.classList.remove("hidden");
  retryBtn.classList.remove("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
  retryBtn.classList.add("hidden");
}
// WEATHER ICONS
function updateWeatherIcon(weather) {
  const icon = document.getElementById("weather-icon");

  switch (weather) {
    case "Clear":
      icon.innerHTML = "☀️";
      break;

    case "Clouds":
      icon.innerHTML = "☁️";
      break;

    case "Rain":
      icon.innerHTML = "🌧️";
      break;

    case "Drizzle":
      icon.innerHTML = "🌦️";
      break;

    case "Thunderstorm":
      icon.innerHTML = "⛈️";
      break;

    case "Snow":
      icon.innerHTML = "❄️";
      break;

    case "Mist":
      icon.innerHTML = "🌫️";
      break;

    default:
      icon.innerHTML = "🌤️";
  }
}
function updateBackground(weather) {
  document.body.classList.remove(
    "sunny",
    "rainy",
    "cloudy",
    "snow"
  );

  switch (weather) {
    case "Clear":
      document.body.classList.add("sunny");
      break;

    case "Rain":
      document.body.classList.add("rainy");
      break;

    case "Clouds":
      document.body.classList.add("cloudy");
      break;

    case "Snow":
      document.body.classList.add("snow");
      break;
  }
}
function updateUI(data) {
  document.getElementById("temperature").textContent =
    `${Math.round(data.main.temp)}°`;

  document.getElementById("city-name").textContent =
    data.name;

  document.getElementById("description").textContent =
    data.weather[0].description;

  document.getElementById("humidity").textContent =
    `${data.main.humidity}%`;

  document.getElementById("wind").textContent =
    `${data.wind.speed} km/h`;

  document.getElementById("pressure").textContent =
    `${data.main.pressure} hPa`;

  document.getElementById("visibility").textContent =
    `${data.visibility / 1000} km`;

  document.getElementById("feels-like").textContent =
    `${Math.round(data.main.feels_like)}°`;

  document.getElementById("temp-max").textContent =
    Math.round(data.main.temp_max);

  document.getElementById("temp-min").textContent =
    Math.round(data.main.temp_min);

  const sunrise = new Date(
    data.sys.sunrise * 1000
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const sunset = new Date(
    data.sys.sunset * 1000
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("sunrise").textContent =
    sunrise;

  document.getElementById("sunset").textContent =
    sunset;

  document.getElementById("uv").textContent =
    "N/A";

  updateWeatherIcon(data.weather[0].main);

  updateBackground(data.weather[0].main);
}
async function getWeather(city) {
  try {
    showLoader();
    hideError();

    lastCity = city;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    updateUI(data);

  } catch (error) {
    showError(error.message);
  } finally {
    hideLoader();
  }
}

async function getCurrentLocationWeather() {

  if (!navigator.geolocation) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {

      const lat =
        position.coords.latitude;

      const lon =
        position.coords.longitude;

      try {

        const response =
          await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );

        const data =
          await response.json();

        updateUI(data);

      } catch (error) {

        console.log(error);

      }

    }
  );

}
// FAVORITE CITY
saveCityBtn.addEventListener(
  "click",
  () => {

    const city =
      document.getElementById("city-name")
        .textContent;

    if (
      city &&
      city !== "Search City"
    ) {

      localStorage.setItem(
        "favoriteCity",
        city
      );

      saveCityBtn.innerHTML =
        `<i class="fa-solid fa-heart"></i>`;

      alert(
        `${city} saved successfully ❤️`
      );
    }

  }
);
// LOAD FAVORITE CITY
function loadFavoriteCity() {

  const favoriteCity =
    localStorage.getItem(
      "favoriteCity"
    );

  if (favoriteCity) {
    getWeather(favoriteCity);
  } else {
    getCurrentLocationWeather();
  }

}

loadFavoriteCity();
// THEME
const savedTheme =
  localStorage.getItem("theme");

if (savedTheme === "light") {

  document.body.classList.add(
    "light-theme"
  );

  themeIcon.classList.remove(
    "fa-moon"
  );

  themeIcon.classList.add(
    "fa-sun"
  );
}

themeBtn.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light-theme"
    );

    const isLight =
      document.body.classList.contains(
        "light-theme"
      );

    if (isLight) {

      localStorage.setItem(
        "theme",
        "light"
      );

      themeIcon.classList.remove(
        "fa-moon"
      );

      themeIcon.classList.add(
        "fa-sun"
      );

    } else {

      localStorage.setItem(
        "theme",
        "dark"
      );

      themeIcon.classList.remove(
        "fa-sun"
      );

      themeIcon.classList.add(
        "fa-moon"
      );
    }

  }
);
// SEARCH
searchBtn.addEventListener(
  "click",
  () => {

    const city =
      cityInput.value.trim();

    if (!city) {

      showError(
        "Please enter a city name"
      );

      return;
    }

    getWeather(city);

  }
);
// ENTER KEY SEARCH
cityInput.addEventListener(
  "keypress",
  (e) => {

    if (e.key === "Enter") {
      searchBtn.click();
    }

  }
);
// RETRY
retryBtn.addEventListener(
  "click",
  () => {

    if (lastCity) {
      getWeather(lastCity);
    }

  }
);
// ONLINE / OFFLINE
window.addEventListener(
  "offline",
  () => {

    showError(
      "No Internet Connection"
    );

  }
);

window.addEventListener(
  "online",
  () => {

    hideError();

  }
);

const hourlyContainer =
  document.getElementById(
    "hourly-container"
  );

for (let i = 1; i <= 8; i++) {

  const card =
    document.createElement("div");

  card.className =
    "hour-card";

  card.innerHTML = `
      <p>${i} PM</p>
      <span>☀️</span>
      <h4>${28 + i}°</h4>
  `;

  hourlyContainer.appendChild(
    card
  );
}

const weeklyContainer =
  document.getElementById(
    "weekly-container"
  );

const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
];

days.forEach((day) => {

  const row =
    document.createElement("div");

  row.className =
    "forecast-row";

  row.innerHTML = `
      <span>${day}</span>
      <span>☀️</span>
      <span>${Math.floor(
        Math.random() * 10 + 25
      )}° / ${Math.floor(
        Math.random() * 10 + 18
      )}°</span>
    `;

  weeklyContainer.appendChild(
    row
  );

});