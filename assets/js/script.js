// Moment Setup
let now = moment()
let time = now.format("dddd, MMMM Do YYYY, h:mm:ss a")

//  Variables
let searchButton = $('.search')
let userInput = $('input')
let key = 0
let oneCdata = []
let weather = []
let datahub = []
const APIkey = "3472a002d02ffd44a03b6300e98ebe05"
let resetButton = $('.resetHistory')
let historySection = $('.history')
let errorCode
let historyButton = $('.searchHistory')



// Search click event
$(searchButton).on('click', function () {




    // Condition if local storage has a duplicate value
    if (userInput.val() === '') {
        alert('You must enter a city name.')
        return
    }
    for (let i = 0; i < localStorage.length; i++) {
        let inputVal = userInput.val()
        let key = localStorage.key(i)
        let value = localStorage.getItem(key)
        if (value === inputVal) {
            console.log(inputVal + ' ' + 'clone')


            setTimeout(getWeather(), 500)
            setTimeout(createElements, 1000)
            return
        }


    }
    historyList()
    setTimeout(getWeather(), 500)
    setTimeout(createElements, 1000)

})



function getWeather() {
    $('.currentCard').html('')
    $('.cards').html('')
    // Weather data fetch
    console.log('get weather')
    let requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput.val() + "&units=imperial&appid=" + APIkey
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function weaths(weatherData) {
            weather.shift()
            weather.push(weatherData)
            //Error trapping "city not found" 
            if (weather[0].cod != 200) {

                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    let value = localStorage.getItem(key);
                    if (value === userInput) {
                        localStorage.removeItem(key, value);
                    }
                }
                alert('City not found. Please try again.')
            }

            // Grab lat and lon
            let lat = (weatherData.coord.lat)
            let lon = (weatherData.coord.lon)

            // Onecall data fetch
            let oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIkey
            fetch(oneCall)
                .then(function (response) {
                    return response.json()
                })

                .then(function (oneCdata1) {
                    oneCdata.shift()
                    oneCdata.push(oneCdata1)


                })
        });

}

function createElements() {

    console.log(oneCdata)

    // Get skies icon 
    todayIcon = oneCdata[0].current.weather[0].icon
    todayIconObject = $('<img>')
    $(todayIconObject).attr('src', 'https://openweathermap.org/img/wn/' + todayIcon + '.png')

    // Create city name and date cloud icon
    currentTime = oneCdata[0].daily[0].dt
    currentCity = $('<h3>')
    currentCity.attr('class', 'city')
    currentCity.html(weather[0].name + " " + moment.unix(currentTime).format('(M-D-YYYY)'))
    console.log(weather[0].name)
    // Create temp
    temp = oneCdata[0].current.temp
    tempEl = $('<li>')
    tempEl.html('Temp:' + ' ' + temp + ' ' + '<span>&#176;</span>')

    // Create wind
    wind = oneCdata[0].current.wind_speed
    windEl = $('<li>')
    windEl.html('Wind:' + ' ' + wind + ' ' + 'MPH')

    // Create humid
    humid = oneCdata[0].current.humidity
    humidEl = $('<li>')
    humidEl.html('Humidity:' + ' ' + humid + ' ' + '%')

    // Create UV
    uvIndex = oneCdata[0].current.uvi
    uvEl = $('<li>')
    uvEl.html('UV Index:' + ' ' + uvIndex)

    // Append Current Card Elements
    $('.currentCard').append(currentCity)
    $('.currentCard').append(todayIconObject)
    $('.currentCard').append(tempEl)
    $('.currentCard').append(windEl)
    $('.currentCard').append(humidEl)
    $('.currentCard').append(uvEl)

    // 5 day forecast loop
    for (i = 1; i < 6; i++) {

        // Get skies icon 
        let forecastIcon = oneCdata[0].daily[i].weather[0].icon
        let forecastIconObject = $('<img>')
        $(forecastIconObject).attr('src', 'https://openweathermap.org/img/wn/' + forecastIcon + '.png')

        // Create city name and date cloud icon
        let currentTime = oneCdata[0].daily[i].dt
        let currentCity = $('<h3>')
        currentCity.attr('class', 'city')
        currentCity.html(weather[0].name + " " + moment.unix(currentTime).format('(M-D-YYYY)'))

        // Create temp
        let temp = oneCdata[0].daily[i].temp.day
        let tempEl = $('<li>')
        tempEl.html('Temp:' + ' ' + temp + ' ' + '<span>&#176;</span>')

        // Create wind
        let wind = oneCdata[0].daily[i].wind_speed
        let windEl = $('<li>')
        windEl.html('Wind:' + ' ' + wind + ' ' + 'MPH')

        // Create humid
        let humid = oneCdata[0].daily[i].humidity
        let humidEl = $('<li>')
        humidEl.html('Humidity:' + ' ' + humid + ' ' + '%')

        // Create UV
        let uvIndex = oneCdata[0].daily[i].uvi
        let uvEl = $('<li>')
        uvEl.html('UV Index:' + ' ' + uvIndex)

        // Forecast Card
        let forecastCard = $('<div>')
        forecastCard.attr('class', 'forecastCard')

        // Append Forecast Card Elements
        $('.cards').append(forecastCard)
        $(forecastCard).append(currentCity)
        $(forecastCard).append(forecastIconObject)
        $(forecastCard).append(tempEl)
        $(forecastCard).append(windEl)
        $(forecastCard).append(humidEl)
        $(forecastCard).append(uvEl)
    }
}

// Write search history into local storage
function historyList() {
    localStorage.setItem(key, userInput.val())
    // userInput val
    let cityName = userInput.val()
    
    // Append search history
    let historyButton = $('<button>')
    historyButton.attr('class', 'searchHistory')
    historyButton.text(cityName)
    historySection.append(historyButton)
    key++

    historyButton.on('click', function () {

        console.log('Clicked')
    })
}

// Reset Button
$(resetButton).on('click', function () {
    console.log('History Reset Clicked')
    localStorage.clear()
    location.reload()

})

