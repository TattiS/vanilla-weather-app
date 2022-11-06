let apiKey = "6e6ec494746b5229a9f2d526478c924c";
// old version of the apiKey "c95d60a1e3adbeb286133f1ebebc2579";

let currentLocationButton = document.querySelector("#current-location-button");
let search = document.querySelector("#search-form");
let isCelsius = true;

function writeDate() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = document.querySelector("#date");
  let dateNow = new Date();
  let hours = dateNow.getHours();
  let minutes = dateNow.getMinutes();
  date.innerHTML =
    dateNow.toDateString() +
    " at " +
    `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function setForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row" id="forecast-row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(lat, lon) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(setForecast);
}

function findByCity(event) {
  let cityInput = document.querySelector("#city-input");
  let city = document.querySelector("#city");
  let description = document.querySelector("#description");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let temp = document.querySelector("#temperature");
  let icon = document.querySelector("#icon");

  event.preventDefault();
  writeDate();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;
  cityInput.value = "";
  axios.get(apiUrl).then((response) => {
    city.innerHTML = response.data.name;
    description.innerHTML = response.data.weather[0].description;
    humidity.innerHTML = response.data.main.humidity;
    wind.innerHTML = response.data.wind.speed;
    temp.innerHTML = Math.round(response.data.main.temp);
    icon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    icon.setAttribute("alt", response.data.weather[0].description);
    getForecast(response.data.coord.lat, response.data.coord.lon);

    document.querySelector("#fahrenheit-link").style.color =
      "var(--search-color)";
    document.querySelector("#celsius-link").style.color = "var(--active-color)";
  });
}

function setCurrentPosition(event) {
  event.preventDefault();
  writeDate();
  navigator.geolocation.getCurrentPosition((position) => {
    let city = document.querySelector("#city");
    let description = document.querySelector("#description");
    let humidity = document.querySelector("#humidity");
    let wind = document.querySelector("#wind");
    let temp = document.querySelector("#temperature");
    let icon = document.querySelector("#icon");
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then((response) => {
      city.innerHTML = response.data.name;
      description.innerHTML = response.data.weather[0].description;
      humidity.innerHTML = response.data.main.humidity;
      wind.innerHTML = response.data.wind.speed;
      temp.innerHTML = Math.round(response.data.main.temp);
      icon.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
      );
      icon.setAttribute("alt", response.data.weather[0].description);
      getForecast(response.data.coord.lat, response.data.coord.lon);

      document.querySelector("#fahrenheit-link").style.color =
        "var(--search-color)";
      document.querySelector("#celsius-link").style.color =
        "var(--active-color)";
    });
  });
}

function convertToFahrenheit(event) {
  event.preventDefault();
  event.target.style.color = "var(--active-color)";
  document.querySelector("#celsius-link").style.color = "var(--search-color)";
  if (isCelsius === true) {
    let temperature = document.querySelector("#temperature").innerHTML;
    temperature = Math.round(temperature * 1.8 + 32);
    document.querySelector("#temperature").innerHTML = temperature;
    isCelsius = false;
  }
}
function convertToCelsius(event) {
  event.preventDefault();
  event.target.style.color = "var(--active-color)";
  document.querySelector("#fahrenheit-link").style.color =
    "var(--search-color)";
  if (isCelsius === false) {
    let temperature = document.querySelector("#temperature").innerHTML;
    temperature = Math.round((temperature - 32) / 1.8);
    document.querySelector("#temperature").innerHTML = temperature;
    isCelsius = true;
  }
}

currentLocationButton.addEventListener("click", setCurrentPosition);
search.addEventListener("submit", findByCity);
currentLocationButton.click();

let tempFar = document.querySelector("#fahrenheit-link");
tempFar.addEventListener("click", convertToFahrenheit);

let tempCel = document.querySelector("#celsius-link");
tempCel.addEventListener("click", convertToCelsius);
