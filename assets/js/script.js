// Moment Setup
let now = moment()
let time = now.format("dddd, MMMM Do YYYY, h:mm:ss a")

// API KEY
const APIkey = "3472a002d02ffd44a03b6300e98ebe05"

//  Variables & Arrays
let key
// One Call API object
let oncallObj = []

// Weather API object
let weatherObj = []

// Queries 
let searchButton = $('.search')
let userInput = $('input')
let resetButton = $('.resetHistory')
let historySection = $('.history')
let historyButton = $('.searchHistory')

// Conditions
function conditions() {
    $('#searchHistory').remove()
    // Condition when there isn't any input
    console.log('condition' + $(userInput).val())
    if (userInput.val() === '') {
        alert('You must enter a city name.')
        return
    }

    //Error trapping "city not found" 
    if (weatherObj[0].cod != 200) {
        alert('City not found. Please try again')
        return
    }

    // Loop to check local storage for duplicate entries 
    for (let i = 0; i < localStorage.length; i++) {
        let xinput = $(userInput).val()
        let key = localStorage.key(i)
        let value = localStorage.getItem(key)
        if (value === xinput) {
            console.log(xinput)
            $('#searchHistory').remove()
            getWeatherObjects()
            return
        }
    }
    $('#searchHistory').remove()
    historyConditions()
    return
}

// Search click event
$(searchButton).on('click', function () {
    $('#searchHistory').remove()
    //Pull weather data 
    getWeatherObjects()
    setTimeout(conditions, 900)
return
})

// Pull weatherObj Data and dump into global arrays - oncallObj and weatherObj
function getWeatherObjects() {

    // weatherObj data fetch
    let requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + $(userInput).val() + "&units=imperial&appid=" + APIkey
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function weaths(weatherObjData) {
            weatherObj.shift()
            weatherObj.push(weatherObjData)

            // Grab lat and lon
            let lat = (weatherObjData.coord.lat)
            let lon = (weatherObjData.coord.lon)

            // Onecall data fetch
            let oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIkey
            fetch(oneCall)
                .then(function (response) {
                    return response.json()
                })

                .then(function (oncallObj1) {
                    oncallObj.shift()
                    oncallObj.push(oncallObj1)

                })
        });

}

// Display Forecasts
function createElements() {

    // Clear elements
    $('.currentCard').html('')
    $('.cards').html('')
    $('#searchHistory').remove()

    // Get skies icon 
    todayIcon = oncallObj[0].current.weather[0].icon
    todayIconObject = $('<img>')
    $(todayIconObject).attr('src', 'https://openweathermap.org/img/wn/' + todayIcon + '.png')

    // Create city name and date cloud icon
    currentTime = oncallObj[0].daily[0].dt
    currentCity = $('<h3>')
    currentCity.attr('class', 'city')
    currentCity.html(weatherObj[0].name + " " + moment.unix(currentTime).format('(M-D-YYYY)'))

    // Create temp
    temp = oncallObj[0].current.temp
    tempEl = $('<li>')
    tempEl.html('Temp:' + ' ' + temp + ' ' + '<span>&#176;</span>')

    // Create wind
    wind = oncallObj[0].current.wind_speed
    windEl = $('<li>')
    windEl.html('Wind:' + ' ' + wind + ' ' + 'MPH')

    // Create humid
    humid = oncallObj[0].current.humidity
    humidEl = $('<li>')
    humidEl.html('Humidity:' + ' ' + humid + ' ' + '%')

    // Create UV
    uvIndex = oncallObj[0].current.uvi
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
        let forecastIcon = oncallObj[0].daily[i].weather[0].icon
        let forecastIconObject = $('<img>')
        $(forecastIconObject).attr('src', 'https://openweathermap.org/img/wn/' + forecastIcon + '.png')

        // Create city name and date cloud icon
        let currentTime = oncallObj[0].daily[i].dt
        let currentCity = $('<h3>')
        currentCity.attr('class', 'city')
        currentCity.html(weatherObj[0].name + " " + moment.unix(currentTime).format('(M-D-YYYY)'))

        // Create temp
        let temp = oncallObj[0].daily[i].temp.day
        let tempEl = $('<li>')
        tempEl.html('Temp:' + ' ' + temp + ' ' + '<span>&#176;</span>')

        // Create wind
        let wind = oncallObj[0].daily[i].wind_speed
        let windEl = $('<li>')
        windEl.html('Wind:' + ' ' + wind + ' ' + 'MPH')

        // Create humid
        let humid = oncallObj[0].daily[i].humidity
        let humidEl = $('<li>')
        humidEl.html('Humidity:' + ' ' + humid + ' ' + '%')

        // Create UV
        let uvIndex = oncallObj[0].daily[i].uvi
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
    }historyList()
}

// Store Search History  
function historyConditions() {
    
    if (localStorage.getItem(key) >= 0) {
        let x = localStorage.length
        localStorage.setItem(x++, userInput.val())
        // userInput val
        let cityName = userInput.val()
    }createElements()
        return
}

// Display Search History
function historyList() {
    $('#searchHistory').remove()
    // Pull from localstorage
    for (let key in localStorage) {
        if (typeof localStorage[key] === 'string') {
            // Append search history
            let historyButton = $('<button>')
            historyButton.attr('id', 'searchHistory')
            historyButton.attr('class', 'searchHistory')
            historyButton.text(localStorage.getItem([key]))
            historyButton.attr('name', localStorage.getItem([key]))
            historySection.append(historyButton)
        }
    }return
    
}

// Search History Button
$(historySection).on('click', '.searchHistory', function () {
    
    
    $(userInput).val($(this).attr('name')) 
    console.log(userInput.val())
    setTimeout(getWeatherObjects, 1000)
   
})

// Reset Button
$(resetButton).on('click', function () {
    console.log('History Reset Clicked')
    localStorage.clear()
    location.reload()

})
$('#searchHistory').remove()
historyList()
