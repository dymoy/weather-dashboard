var APIKey = "6f3316f2ba5c5f4e5a81ee758ba68d1a";
var queriedCity = $("#city-search");

var cityName = $("#city-name");
var currentDate = new Date();
var date = $("#date");
var forecastIcon = $("#weather-icon");

var currentTemp = $("#temp");
var currentWind = $("#wind");
var currentHumidity = $("#humidity");

var futureForecast = $("#future-forecast-container");

// This function returns the class name to add to <i> to show the current weather condition
function getWeatherClass(code) {
    var result;
    if (code > 800) {
        // cloudy
        result = "fa-cloud";
    } else if (code === 800) {
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

    return result;s
}

// 
function getWeatherAPI(queryURL) {
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
        // console.log(data);

        // Display the city, date, and icon depicting the current weather condition
        cityName.text(data.name);
        date.text("(" + currentDate.toLocaleDateString() + ")");
        forecastIcon.addClass(getWeatherClass(data.weather[0].id));

        // Display the current temperature, wind speed, and humidity
        currentTemp.text("Temp: " + data.main.temp + '\u00B0' + 'F');
        currentWind.text("Wind: " + data.wind.speed + " MPH");
        currentHumidity.text("Humidity: " + data.main.humidity + "%");
    });
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
        var dayArray = getForecastData(data.list);
        dayArray.forEach((day) => {
            futureForecast.append(createForecastCard(day));
        })
    });
}

//
function createForecastCard(day) {
    // Create the card div element
    var forecastCard = document.createElement("div");
    forecastCard.classList.add("card", "forecast-card", "col-2", "px-2", "my-4");

    // Append date element to the card 
    var cardDate = document.createElement("p");
    var date = new Date(day.dt_txt.split(' ')[0]);
    cardDate.innerHTML = date.toLocaleDateString();
    forecastCard.appendChild(cardDate);

    // Append weather icon to the card
    var weatherIcon = document.createElement("i")
    weatherIcon.classList.add("fa-solid", getWeatherClass(day.weather[0].id));
    forecastCard.appendChild(weatherIcon);

    // Append the temperature information to the card
    var temp = document.createElement("p");
    temp.innerHTML = "Temp: " + day.main.temp + '\u00B0' + 'F';
    forecastCard.appendChild(temp);

    // Append the wind speed information to the card
    var wind = document.createElement("p");
    wind.innerHTML = "Wind: " + day.wind.speed + " MPH";
    forecastCard.appendChild(wind);

    // Append the humidity information to the card
    var humidity = document.createElement("p");
    humidity.innerHTML = "Humidity: " + day.main.humidity + "%";
    forecastCard.appendChild(humidity);

    return forecastCard;
}

// 
function getForecastData(dataList) {
    var result = [];
    for (var i = 0; i < dataList.length; i+=8) {
        result.push(dataList[i]);
    }
    return result;
}

//
function queryCity() {
    var city = queriedCity.val();
    var queryWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey +"&units=imperial";
    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey +"&units=imperial";
    getWeatherAPI(queryWeatherURL);
    getForecastAPI(queryForecastURL);
}
