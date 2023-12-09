var APIKey = "6f3316f2ba5c5f4e5a81ee758ba68d1a";
var queriedCity = $("#city-search");

var cityName = $("#city-name");
var currentDate = new Date();
var date = $("#date");
var forecastIcon = $("#weather-icon");

var currentTemp = $("#temp");
var currentWind = $("#wind");
var currentHumidity = $("#humidity");

// This function takes a temperature value in Kelvin and converts it to Fahrenheit
function kelvinToFahrenheit(value){
    var result = ((value-273.15)*1.8)+32;
    return result.toFixed(2);
}

function getApi(queryURL) {
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
        console.log(data);

        // Display the city, date, and icon depicting the current weather condition
        cityName.text(data.name);
        date.text("(" + currentDate.toLocaleDateString() + ")");
        forecastIcon.addClass(getWeatherClass(data.weather[0].id));

        // Display the current temperature, wind speed, and humidity
        currentTemp.text("Temp: " + kelvinToFahrenheit(data.main.temp) + '\u00B0' + 'F');
        currentWind.text("Wind: " + data.wind.speed + " MPH");
        currentHumidity.text("Humidity: " + data.main.humidity + "%");
    })
}

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

function fetchCity() {
    var city = queriedCity.val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    getApi(queryURL);
}

