// Moment Setup
let now = moment()
let time = now.format("dddd, MMMM Do YYYY, h:mm:ss a")
//  Variables
let historyButton = $('.searchHistory')
let searchButton = $('.search')
let userInput = $('input')
let key = 0
const APIkey = "3472a002d02ffd44a03b6300e98ebe05"

// Search click event
$(searchButton).on('click', function () {
   
       if (userInput.val() == ''){
           console.log('EMPTY!!!!')
return
       }
       console.log('Clicked')
    localStorage.setItem(key, userInput.val())
   
    $('.currentCard').text('')
    $('.cards').text('')
    
    // Weather data fetch
    let requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput.val() + "&units=imperial&appid=" + APIkey
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (weather) {
            console.log(weather.cod)
            
          
            // Grab lat and lon
            let lat = (weather.coord.lat)
            let lon = (weather.coord.lon)

            // Onecall data fetch
            let oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIkey
            fetch(oneCall)
                .then(function (response) {
                    return response.json()
                })
                .then(function (oneCdata) {
                    console.log(oneCdata)
                    

                    //Get skies icon 
                    let todayIcon = oneCdata.current.weather[0].icon
                    let todayIconObject = $('<img>')
                    $(todayIconObject).attr('src', 'https://openweathermap.org/img/wn/' + todayIcon + '.png')

                    //Create city name and date cloud icon
                    let currentTime = oneCdata.daily[0].dt
                    let currentCity = $('<h3>')
                    currentCity.attr('class', 'city')
                    currentCity.html(weather.name + " " + moment.unix(currentTime).format('(M-D-YYYY)'))

                    //Create temp
                    let temp = oneCdata.current.temp
                    let tempEl = $('<li>')
                    tempEl.html('Temp:' + ' ' + temp + ' ' + '<span>&#176;</span>')

                    //Create wind
                    let wind = oneCdata.current.wind_speed
                    let windEl = $('<li>')
                    windEl.html('Wind:' + ' ' + wind + ' ' + 'MPH')


                    //Create humid
                    let humid = oneCdata.current.humidity
                    let humidEl = $('<li>')
                    humidEl.html('Humidity:' + ' ' + humid + ' ' + '%')

                    //Create UV
                    let uvIndex = oneCdata.current.uvi
                    let uvEl = $('<li>')
                    uvEl.html('UV Index:' + ' ' + uvIndex)

                    // Append Current Card Elements
                    $('.currentCard').append(currentCity)
                    $('.currentCard').append(todayIconObject)
                    $('.currentCard').append(tempEl)
                    $('.currentCard').append(windEl)
                    $('.currentCard').append(humidEl)
                    $('.currentCard').append(uvEl)

                    // 5 day forecast pull
                    for (i = 1; i < 6; i++) {
                        
                        //Get skies icon 
                        let forecastIcon = oneCdata.daily[i].weather[0].icon
                        let forecastIconObject = $('<img>')
                        $(forecastIconObject).attr('src', 'https://openweathermap.org/img/wn/' + forecastIcon + '.png')

                        //Create city name and date cloud icon
                        let currentTime = oneCdata.daily[i].dt
                        let currentCity = $('<h3>')
                        currentCity.attr('class', 'city')
                        currentCity.html(weather.name + " " + moment.unix(currentTime).format('(M-D-YYYY)'))

                        //Create temp
                        let temp = oneCdata.daily[i].temp.day
                        let tempEl = $('<li>')
                        tempEl.html('Temp:' + ' ' + temp + ' ' + '<span>&#176;</span>')

                        //Create wind
                        let wind = oneCdata.daily[i].wind_speed
                        let windEl = $('<li>')
                        windEl.html('Wind:' + ' ' + wind + ' ' + 'MPH')


                        //Create humid
                        let humid = oneCdata.daily[i].humidity
                        let humidEl = $('<li>')
                        humidEl.html('Humidity:' + ' ' + humid + ' ' + '%')

                        //Create UV
                        let uvIndex = oneCdata.daily[i].uvi
                        let uvEl = $('<li>')
                        uvEl.html('UV Index:' + ' ' + uvIndex)

                        // Forecast Card
                        let forecastCard = $('<div>')
                        forecastCard.attr('class', 'forecastCard')
                       
                        // Append Current Card Elements
                        $('.cards').append(forecastCard)
                        $(forecastCard).append(currentCity)
                        $(forecastCard).append(forecastIconObject)
                        $(forecastCard).append(tempEl)
                        $(forecastCard).append(windEl)
                        $(forecastCard).append(humidEl)
                        $(forecastCard).append(uvEl)
                    }


                });
        });
key++
userInput.val('')
})
// User History
$(historyButton).on('click', function () {
    console.log($(this).attr('name'))
})