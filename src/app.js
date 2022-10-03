let apiKey = "c95d60a1e3adbeb286133f1ebebc2579";

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
    });
  });
}

function convertToFahrenheit(event) {
  event.preventDefault();
  if (isCelsius === true) {
    let temperature = document.querySelector("#temperature").innerHTML;
    temperature = Math.round(temperature * 1.8 + 32);
    document.querySelector("#temperature").innerHTML = temperature;
    isCelsius = false;
  }
}
function convertToCelsius(event) {
  event.preventDefault();
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
