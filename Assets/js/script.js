var APIKey = "6f3316f2ba5c5f4e5a81ee758ba68d1a";
var queriedCity = $("#city-search");

var currentDate = dayjs();
var cityNameEl = $("#city-name");
var dateEl = $("#date");
var forecastIconEl = $("#weather-icon");
var tempEl = $("#temp");
var windEl = $("#wind");
var humidityEl = $("#humidity");

var currentForecastDiv = $("#current-forecast");
var futureForecastDiv = $("#future-forecast-container");
var searchHistoryList = $("#search-history");

// This function will create and return an HTML button element for the search history list 
function createButton(cityName) {
    var buttonEl = document.createElement("button");
    buttonEl.classList.add("my-1", "button");
    buttonEl.setAttribute("onclick", "queryCity(this.id)");
    buttonEl.setAttribute("id", cityName);
    buttonEl.textContent = cityName;
    
    return buttonEl;
}

// This function will check the search history list and return a boolean value if it is found 
function isInHistory(cityName) {
    // Default the value to false 
    var bool = false;
    var cities = searchHistoryList.children();

    if (cities.length > 0) {
        cities.each(function () {
            if (this.id === cityName) {
                // The city is already added to the search history list 
                bool = true;
            }
        })
    }
    return bool;
}

// This function will add the queried city to local storage 
function addToSearchHistory(cityName, dayArray) {
    if (!isInHistory(cityName)) {
        // The city is not found in the search history list. Create a button for the queried city and add it to the list
        searchHistoryList.append(createButton(cityName));
    }
    // Update the local storage key and value
    localStorage.setItem(cityName, dayArray);
}

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

// This function will filter the forecast data to 1 response per day instead of 8 responses for every 3 hours. 
function filterForecastData(dataList) {
    var result = [];
    var temp = [];

    for (var i=0; i < dataList.length; i++) {
        var parsedUnix = dayjs.unix(dataList[i].dt).format("MM/DD");
        if (!temp.includes(parsedUnix)) {
            // If a new day is parsed, add the data into result array  
            temp.push(parsedUnix);
            result.push(dataList[i]);
        }
    }
    return result;
}

// This function writes all relevant forecast information for the current date into the HTML file
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

// This function will create the card element in HTML and include all the forecast data for the day parameter passed 
function createForecastCard(day) {
    // Create the card div element
    var forecastCard = document.createElement("div");
    forecastCard.classList.add("card", "forecast-card", "col-2", "px-2", "my-4", "text-white", "bg-secondary", "align-items-center");

    // Append date element to the card 
    var cardDate = document.createElement("p");
    cardDate.textContent = dayjs(day.dt_txt.split(' ')[0]).format('MM/DD/YYYY');
    forecastCard.appendChild(cardDate);

    // Append weather icon to the card
    var weatherIcon = document.createElement("i");
    weatherIcon.classList.add("fa-solid", getWeatherClass(day.weather[0].id), "pb-3");
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

// This function contains the API call to fetch data using the queryURL parameter 
function getForecastAPI(queryURL) {
    fetch(queryURL)
    .then (function (response) {
        // Check response status 
        if (response.status !== 200) {
            // Endpoint not found 
            alert("Invalid city entered.");
            return;
        } 
        return response.json();
    })
    .then (function (data) {
        // Display the city name
        cityNameEl.text(data.city.name);
        var dayArray = filterForecastData(data.list);

        // Display the current forecast and add the city to search history 
        displayCurrentForecast(dayArray[0]);
        addToSearchHistory(data.city.name, dayArray);

        // Display the 5-day forecast 
        dayArray.slice(1).forEach((day) => {
            futureForecastDiv.append(createForecastCard(day));
        })
    });
}

// This function constructs the URL to fetch in getForecastAPI()
function queryCity(city) {
    // Remove any cards present in the 5-day forecast div 
    futureForecastDiv.empty();

    // If no parameter was passed into the function (aka city was queried from search box), reassign city to the value in the search input box
    if (city == null) {
        city = queriedCity.val();
    }

    // Construct the query URL using the city variable. Append the API Key and query imperial units of measurement
    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey +"&units=imperial";
    getForecastAPI(queryForecastURL);
}

// Iterate through the local storage keys, create a button for each key, and append it to the search history list 
function renderSearchHistory() {
    for (var i=0; i < localStorage.length; i++) {
        searchHistoryList.append(createButton(localStorage.key(i)));
    }
}

renderSearchHistory();
