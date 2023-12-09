var APIKey = "6f3316f2ba5c5f4e5a81ee758ba68d1a";
var queriedCity = $("#city-search");
var cityName = $("#city-name");
var date = $("#date");
var currentForecastIcon = $("#weather-icon");
var currentDate = new Date();

var currentTemp = $("#temp");
var currentWind = $("#wind");
var currentHumidity = $("#humidity");

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
        cityName.text(data.name + ', ' + data.sys.country);
        date.text("(" + currentDate.toLocaleDateString() + ")");

        currentTemp.text("Temp: " + kelvinToFahrenheit(data.main.temp) + '\u00B0' + 'F');
        currentWind.text("Wind: " + data.wind.speed + " MPH");
        currentHumidity.text("Humidity: " + data.main.humidity + "%");
    })
}

function kelvinToFahrenheit(value){
    var result = ((value-273.15)*1.8)+32;
    return result.toFixed(2);
}

function fetchCity() {
    var city = queriedCity.val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    getApi(queryURL);
}

