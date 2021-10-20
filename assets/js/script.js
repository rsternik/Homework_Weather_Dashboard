// Moment Setup
let now = moment()
let time = now.format("dddd, MMMM Do YYYY, h:mm:ss a")
//  Variables
let historyButton = $('.searchHistory')
let searchButton = $('.search')
let userInput = $('input')
const APIkey = "3472a002d02ffd44a03b6300e98ebe05"

// Search click event
$(searchButton).on('click', function () {

    // Weather data fetch
    let requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput.val() + "&units=imperial&appid=" + APIkey
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (weather) {
            console.log(weather)
            // Grab lat and lon
            let lat = (weather.coord.lat)
            let lon = (weather.coord.lon)

            //Create city name and date
            let currentTime = weather.dt
            let currentCity = $('<h3>')
            currentCity.attr('class', 'city')
            currentCity.text(weather.name + " " + moment.unix(currentTime).format('(M-D-YYYY)'))
            $('.currentCard').append(currentCity)

            //Create temp
            let temp = weather.main.temp
            let tempEl = $('<li>')
            tempEl.html('Temp:' + ' ' + temp + ' ' + '<span>&#176;</span>')
            $('.currentCard').append(tempEl)

            //Create wind
            let wind = weather.wind.speed
            let windEl = $('<li>')
            windEl.html('Wind:' + ' ' + wind + ' ' + 'MPH')
            $('.currentCard').append(windEl)

            //Create humid
            let humid = weather.main.humidity
            let humidEl = $('<li>')
            humidEl.html('Humidity:' + ' ' + humid + ' ' + '%')
            $('.currentCard').append(humidEl)

            // Onecall data fetch
            let oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey
            fetch(oneCall)
                .then(function (response) {
                    return response.json()
                })
                .then(function (oneCdata) {
                    //Create humid
                    let uvIndex = oneCdata.current.uvi
                    let uvEl = $('<li>')
                    uvEl.html('UV Index:' + ' ' + uvIndex)
                    $('.currentCard').append(uvEl)
                });


        });



})
$(historyButton).on('click', function () {

    console.log($(this).attr('name'))
})

function currentWeather(){
    
}