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

var previouslySearched = JSON.parse(localStorage.getItem('cities'))

if (previouslySearched){
    for (var i =0; i < previouslySearched.length; i++){
        citiesSearched.push(previouslySearched[i])
        $('#newButtons').append(`<button class = "newCity" class="btn btn-group-vertical">${previouslySearched[i]}</button>`)
    }

}
 
var cityBtnsEl = $('#newButtons button')


submitEl.on('click', function(event){


    if (citySearchEl.val()){
        

        
            displayWeather(citySearchEl.val());
            displayFiveDay(citySearchEl.val());
            previouslySearchedFunction(citySearchEl.val());
            saveToLocalStorage(citySearchEl.val());
        }
        
})

var previouslySearchedFunction = function(city){
    $('#newButtons').append(`<button class = "newCity" class="btn btn-group-vertical">${city}</button>`)

    cityBtnsEl = $('#newButtons button')

    cityBtnsEl.on('click', function(event){
        displayWeather($(this)[0].innerText);
        displayFiveDay($(this)[0].innerText);
            })
}


//Display the Current weather function 
var displayWeather =  function (city) {
    mainInfoCity.html('')
    fetch (apiURL + `weather?q=${city}&units=imperial&appid=8ed513747908d0ab51f99af804b7d62b`)
    .then(function(response){
        response.json().then(function(data){
            var temp = data.main.temp;
            var humidity = data.main.humidity;
            var wind = data.wind.speed;
            var icon = data.weather[0].icon
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            
            mainInfoCity.html(`<h2>${city} ${date} 
            <img src = https://openweathermap.org/img/wn/${icon}@2x.png width="50px" height="50px" >
            </h2> 
            <p>Temperature: ${temp} °F </p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${wind} mph</p>
            <p>`
            )
            getUVIndex(lat, lon);
            
        })
    })



}

//Get the UV index and color code it according to value 
//chose colors from google searching
var getUVIndex = function(lat, long){
    fetch (apiURL + `uvi?lat=${lat}&lon=${long}&units=imperial&appid=8ed513747908d0ab51f99af804b7d62b`)
    .then (function(response){
        response.json().then(function(data){
            index = data.value;
            if (index >= 8){
                mainInfoCity.append(
                    `<p> UV index: <span style=" background-color:red">${index}<span></p>`
                    )
            }else if (index < 8 && index >=6 ){
                mainInfoCity.append(
                    `<p> UV index: <span style=" background-color:orange">${index}<span></p>`
                    )
            }else if (index < 6 && index >= 3){
                mainInfoCity.append(
                    `<p> UV index: <span style=" background-color:yellow">${index}<span></p>`
                    )
            }else{
                mainInfoCity.append(
                    `<p> UV index: <span style=" background-color:green">${index}<span></p>`
                    )
            }
        })
})

}

var displayFiveDay = function(city){
    fiveDay.html('')
    $('#headerFiveDay').show();
    var dates = []
    for (var i = 0; i < 5; i++){
        var day = moment().add(i, 'd');
        dates.push(day.format('MM/DD/YYYY'))
    }


    fetch (apiURL + `forecast?q=${city}&units=imperial&appid=8ed513747908d0ab51f99af804b7d62b`)
    .then (function(response){
        response.json().then(function(data){
            var list = []
            for (var i = 0; i < 5; i++){
                
                fiveDay.append(
                    `<section class = weatherContainer > 
                    <h4>${dates[i]}</h4> 
                    <img src = https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png width="50px" height="50px">
                    <p>Temperature: ${data.list[i].main.temp}</p>
                    <p>Humidity: ${data.list[i].main.humidity}%</p>
                    </section>`
                )
            }
            

        })
    })
}



//Save to Local Storage 
var saveToLocalStorage = function(city){
    citiesSearched.push(city)
    localStorage.setItem("cities", JSON.stringify(citiesSearched))
}

//Cities added buttons 
cityBtnsEl.on('click', function(event){
    console.log($(this)[0].innerText)
    //event.preventDefault()
    var t = $(this)[0].innerText
    displayWeather($(this)[0].innerText);
    displayFiveDay($(this)[0].innerText);
})  


$('#clearBtn').on('click', function(){
    $('#newButtons').html('');
    localStorage.clear('cities');
})

