//Declaring some variables and grabbing items with jQuery
var APIKey = '8ed513747908d0ab51f99af804b7d62b'
var apiURL = 'https://api.openweathermap.org/data/2.5/'
var citySearchEl = $('#citySearch');
var previousCityEl = $('#searchArea');
var mainInfoCity = $('#currentInfo');
var fiveDay = $('#fiveDayForecast');
var submitEl = $('#submitButton')
var citiesSearched = [];
var date = moment().format('MMM Do, YYYY');
$('#headerFiveDay').hide()


//?q=${city}&units=imperial&appid=$8ed513747908d0ab51f99af804b7d62b
var previouslySearched = JSON.parse(localStorage.getItem('cities'))
if (previouslySearched){
    for (var i =0; i < previouslySearched.length; i++)
    previousCityEl.append(`<button class = "newcity" class="btn btn-group-vertical">${previouslySearched[i]}</button>`)
}


submitEl.on('click', function(event){
    
    event.preventDefault()
    citiesSearched.push(citySearchEl.val())
    //Save to local storage 
    localStorage.setItem("cities", JSON.stringify(citiesSearched));
    displayWeather(citySearchEl.val());
    displayFiveDay(citySearchEl.val());
    if (!previouslySearched.includes(citySearchEl.val())){
        previouslySearchedFunction(citySearchEl.val());
    }
    
})

var previouslySearchedFunction = function(city){
    previousCityEl.append(`<button class = "newcity" class="btn btn-group-vertical">${city}</button>`)
}


var displayWeather =  function (city) {
    mainInfoCity.html("")
    fetch (apiURL + `weather?q=${city}&units=imperial&appid=8ed513747908d0ab51f99af804b7d62b`)
    .then(function(response){
        response.json().then(function(data){
            console.log(data)
            var temp = data.main.temp;
            var humidity = data.main.humidity;
            var wind = data.wind.speed;
            var icon = data.weather[0].icon

            mainInfoCity.append(`<h2>${city}    ${date} 
            <img src = https://openweathermap.org/img/wn/${icon}@2x.png width="50px" height="50px" >
            </h2> 
            <p>Temperature: ${temp} °F </p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${wind} mph</p>
            <p>`
            );
        })
    })



}


var getUVIndex = function(lat, long){
return true
}

var displayFiveDay = function(city){
    $('#headerFiveDay').show();
    fiveDay.html("")
    //var date = moment().format('MMM Do, YYYY')
    fetch (apiURL + `forecast?q=${city}&units=imperial&appid=8ed513747908d0ab51f99af804b7d62b`)
    .then (function(response){
        response.json().then(function(data){
            for (var i = 0; i < 5; i++){
                console.log(data.list[i])
                fiveDay.append(
                    `<section class = weatherContainer > 
                    <h3>${date}</h3> 
                    <img src = https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png width="50px" height="50px">
                    <p>Temperature: ${data.list[i].main.temp}</p>
                    <p>Humidity: ${data.list[i].main.humidity}%</p>

                    
                    </section>`
                )
            }

        })
    })
}

