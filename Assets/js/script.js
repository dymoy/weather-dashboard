var APIKey = "6f3316f2ba5c5f4e5a81ee758ba68d1a";
var queriedCity = $("#city-search");

var cityNameEl = $("#city-name");
var currentDate = dayjs();
var dateEl = $("#date");
var forecastIconEl = $("#weather-icon");

var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");

var currentForecastDiv = $("#current-forecast");
var futureForecastDiv = $("#future-forecast-container");
var searchHistoryList = $("#search-history");

// This function returns the class name to add to <i> to show the current weather condition
function getWeatherClass(code) {
    var result;
    if (code > 800) {
        // cloudy
        result = "fa-cloud";
    } else if (code == 800) {
        // clear 
        result = "fa-sun";
    } else if (code > 700 && code < 800) {
        // hazy or smog
        result = "fa-smog";
    } else if (code > 600 && code < 700) {
        // snow
        result = "fa-snowflake";
    } else if (code > 300 && code < 600) {
        // drizzle or rain
        result = "fa-cloud-rain";
    } else if (code < 300) {
        // thunder
        result = 'fa-cloud-bolt'
    }
    return result;
}

//
function addToSearchHistory(cityName, dayArray) {
    // TODO: Prevent duplicate button from creating in history 
    if (!isInHistory(cityName)) {
        searchHistoryList.append(createButton(cityName));
    }
    localStorage.setItem(cityName, dayArray);
}

//
function isInHistory(cityName) {
    var bool = false;
    var cities = searchHistoryList.children();

    if (cities.length > 0) {
        cities.each(function () {
            if (this.id === cityName) {
                bool = true;
            }
        })
    }
    
    return bool;
}

//
function createButton(cityName) {
    var buttonEl = document.createElement("button");
    buttonEl.classList.add("my-1", "button");
    buttonEl.setAttribute("onclick", "queryCityFromHistory(this.id)");
    buttonEl.setAttribute("id", cityName);
    buttonEl.textContent = cityName;
    
    return buttonEl;
}

//
function renderSearchHistory() {
    for (var i=0; i < localStorage.length; i++) {
        searchHistoryList.append(createButton(localStorage.key(i)));
    }
}

//
function getForecastAPI(queryURL) {
    fetch(queryURL)
    .then (function (response) {
        // Check response status 
        if (response.status !== 200) {
            // Query not found
            alert("Invalid city entered.");
            return;
        } 
        return response.json();
    })
    .then (function (data) {
        // Display the city name
        cityNameEl.text(data.city.name);

        var dayArray = getForecastData(data.list);
        displayCurrentForecast(dayArray[0]);
        addToSearchHistory(data.city.name, dayArray);

        dayArray.slice(1).forEach((day) => {
            futureForecastDiv.append(createForecastCard(day));
        })
    });
}

function displayCurrentForecast(data) {
    // Display the date and icon depicting the current weather condition
    dateEl.text("(" + currentDate.format("MM/DD/YYYY") + ")");
    forecastIconEl.removeClass();
    forecastIconEl.addClass("fa-solid");
    forecastIconEl.addClass(getWeatherClass(data.weather[0].id));

    // Display the current temperature, wind speed, and humidity
    tempEl.text("Temp: " + data.main.temp + '\u00B0' + 'F');
    windEl.text("Wind: " + data.wind.speed + " MPH");
    humidityEl.text("Humidity: " + data.main.humidity + "%");
}

//
function createForecastCard(day) {
    // Create the card div element
    var forecastCard = document.createElement("div");
    forecastCard.classList.add("card", "forecast-card", "col-2", "px-2", "my-4", "text-white", "bg-secondary");

    // Append date element to the card 
    var cardDate = document.createElement("p");
    cardDate.textContent = dayjs(day.dt_txt.split(' ')[0]).format('MM/DD/YYYY');
    forecastCard.appendChild(cardDate);

    // Append weather icon to the card
    var weatherIcon = document.createElement("i");
    weatherIcon.classList.add("fa-solid", getWeatherClass(day.weather[0].id));
    forecastCard.appendChild(weatherIcon);

    // Append the temperature information to the card
    var temp = document.createElement("p");
    temp.textContent = "Temp: " + day.main.temp + '\u00B0' + 'F';
    forecastCard.appendChild(temp);

    // Append the wind speed information to the card
    var wind = document.createElement("p");
    wind.textContent = "Wind: " + day.wind.speed + " MPH";
    forecastCard.appendChild(wind);

    // Append the humidity information to the card
    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + day.main.humidity + "%";
    forecastCard.appendChild(humidity);

    return forecastCard;
}

// 
function getForecastData(dataList) {
    var result = [];
    var temp = [];

    for (var i=0; i < dataList.length; i++) {
        var parsedUnix = dayjs.unix(dataList[i].dt).format("MM/DD");
        if (!temp.includes(parsedUnix)) {
            temp.push(parsedUnix);
            result.push(dataList[i]);
        }
    }
    return result;
}

//
function queryCity() {
    futureForecastDiv.empty();
    var city = queriedCity.val();
    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey +"&units=imperial";
    getForecastAPI(queryForecastURL);
}

function queryCityFromHistory(city) {
    futureForecastDiv.empty();
    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey +"&units=imperial";
    getForecastAPI(queryForecastURL);
}

renderSearchHistory();
