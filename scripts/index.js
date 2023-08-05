// --- Class Weather --- //
class Weather {
  constructor(
    weather,
    temp,
    city,
    flTemp,
    minTemp,
    maxTemp,
    humidity,
    windSpeed,
    sunset
  ) {
    this.weather = weather;
    this.temp = Math.floor(temp);
    this.city = city;
    this.flTemp = Math.floor(flTemp);
    this.minTemp = Math.floor(minTemp);
    this.maxTemp = Math.floor(maxTemp);
    this.humidity = humidity;
    this.windSpeed = Math.floor(windSpeed);
    this.sunset = this.convertUnix(sunset);
  }

  getPicture() {
    switch (this.weather) {
      case "Clear":
        return "images/clear.png";
      case "Clouds":
        return "images/clouds.png";
      case "Drizzle":
        return "images/drizzle.png";
      case "Mist":
        return "images/mist.png";
      case "Rain":
        return "images/rain.png";
      case "Snow":
        return "images/snow.png";
      default:
        return "images/clear.png";
    }
  }

  convertUnix(time) {
    let date = new Date(time * 1000);
    let hour = date.getHours();
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let formattedTime = hour + ":" + minutes;
    return formattedTime;
  }
}

// --- SEARCH SECTION --- //
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const weatherCtr = document.querySelector(".weather");
const errorBnr = document.getElementById("error-banner");
const instructions = document.getElementById("instructions");

// --- MAIN SECTION --- //
const weatherPng = document.getElementById("weather-png");
const mainTemp = document.getElementById("main-temp");
const searchedCity = document.getElementById("city");

// --- DETAILED SECTION --- //
const detailedCtr = document.getElementById("detailed-container");
const flTemp = document.getElementById("fl-temp");
const minTemp = document.getElementById("min-temp");
const maxTemp = document.getElementById("max-temp");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const sunsetTime = document.getElementById("sunset-time");

// eventlistener
searchBtn.addEventListener("click", () => searchWeather());
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchWeather();
  }
});

// --- API call --- //
const apiKey = "04e02940e4724bf353c27ff03033094f";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

async function getData(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  let data = await response.json();
  return data;
}

// --- Functions --- //

// function that returns users search input
function getInput() {
  let input = searchInput.value;
  if (input == "") {
    alert("Please enter a city name");
  }
  return input;
}

// function that changes the frontend when
// searching for the first time
function firstTimeSearch(input) {
  // if input is empty, return nothing
  if (input == "") {
    return;
  }

  const computedStyle = window.getComputedStyle(weatherCtr);
  if (computedStyle.display == "none") {
    searchInput.classList.add("fade-out");
    searchBtn.classList.add("fade-out");
    instructions.classList.add("fade-out");
    setTimeout(() => {
      weatherCtr.style.display = "grid";
      searchInput.classList.remove("fade-out");
      searchBtn.classList.remove("fade-out");
      searchInput.style.opacity = "0";
      searchInput.value = "";
      searchBtn.style.opacity = "0";
      instructions.style.display = "none";
      setTimeout(() => {
        searchInput.classList.add("fade-in");
        searchBtn.classList.add("fade-in");
        searchInput.style.opacity = "1";
        searchBtn.style.opacity = "1";
      }, 100);
    }, 800);
    return true;
  }
}

// function that gets the data and creates a class
async function getWeather(city) {
  let data = await getData(city);
  let weather = await new Weather(
    data.weather[0].main,
    data.main.temp,
    data.name,
    data.main.feels_like,
    data.main.temp_min,
    data.main.temp_max,
    data.main.humidity,
    data.wind.speed,
    data.sys.sunset
  );
  return weather;
}

// function that updates all HTML based on weather data
function updateHTML(weather) {
  weatherPng.src = weather.getPicture();
  mainTemp.innerHTML = weather.temp + "°C";
  searchedCity.innerHTML = weather.city;
  flTemp.innerHTML = weather.flTemp + "°C";
  minTemp.innerHTML = weather.minTemp + "°C";
  maxTemp.innerHTML = weather.maxTemp + "°C";
  humidity.innerHTML = weather.humidity + "%";
  windSpeed.innerHTML = weather.windSpeed;
  sunsetTime.innerHTML = weather.sunset;
}

// function to add the fade in animation
function addFadeInAnimation() {
  mainTemp.classList.remove("fade-in");
  searchedCity.classList.remove("fade-in");
  mainTemp.classList.remove("fade-out");
  searchedCity.classList.remove("fade-out");
  weatherPng.classList.remove("blur-in");
  weatherPng.classList.remove("fade-out");
  setTimeout(function () {
    mainTemp.classList.add("fade-in");
    searchedCity.classList.add("fade-in");
    weatherPng.classList.add("blur-in");
    mainTemp.style.opacity = 1;
    searchedCity.style.opacity = 1;
    weatherPng.style.opacity = 1;
  }, 10);
}

// function to add the fade out animation
function addFadeOutAnimation() {
  mainTemp.classList.remove("fade-out");
  searchedCity.classList.remove("fade-out");
  mainTemp.classList.remove("fade-in");
  searchedCity.classList.remove("fade-in");
  weatherPng.classList.remove("fade-out");
  weatherPng.classList.remove("blur-in");
  setTimeout(function () {
    mainTemp.classList.add("fade-out");
    searchedCity.classList.add("fade-out");
    weatherPng.classList.add("fade-out");
    mainTemp.style.opacity = 0;
    searchedCity.style.opacity = 0;
    weatherPng.style.opacity = 0;
  }, 1);
}

function showErrorBanner() {
  errorBnr.style.visibility = "visible";
  errorBnr.classList.add("error-banner");
  setTimeout(() => {
    errorBnr.classList.remove("error-banner");
    errorBnr.style.visibility = "hidden";
  }, 3100);
}

// function that activates when pressing the search button
async function searchWeather() {
  try {
    let city = getInput();
    let weather = await getWeather(city);
    if (firstTimeSearch(city)) {
      addFadeInAnimation(weather);
      updateHTML(weather);
    } else {
      addFadeOutAnimation();
      setTimeout(function () {
        addFadeInAnimation();
        updateHTML(weather);
      }, 700);
    }
  } catch (error) {
    showErrorBanner();
  }
}
