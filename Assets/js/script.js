var APIKey = "6f3316f2ba5c5f4e5a81ee758ba68d1a";
var queriedCity = $("#city-search");

var city; 
var queryURL;

function getApi(queryURL) {
    fetch(queryURL)
    .then (function (response) {
        // Check response status 
        if (response.status !== 200) {
            // Query not found
            alert("city not found");
            return;
        } 
        return response.json();
    })
    .then (function (data) {
        console.log(data);
        // Do something with the data 
    })
}

function fetchCity() {
    city = queriedCity.val();
    queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    getApi(queryURL);
}

