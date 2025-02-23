// Зареждане на HTML елементите в променливи
const citySelect = document.getElementById('citySelect');
const timeSlider = document.getElementById('timeSlider');
const timeValue = document.getElementById('timeValue');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const canvas = document.getElementById('tempChart');
const context = canvas.getContext('2d');
const cityForm = document.getElementById('cityForm');
const cityInput = document.getElementById('cityInput');

// Variables to store weather data
let weatherData = null;
let city = null;

// Get cities based on search query
async function getCities(city) {
    if(!city) return
    try {
        const response = await fetch(`/getcities/${city}`);
        const cities = await response.json();
        updateCitySelect(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        alert('Error fetching cities');
    }
}
// Get weather data for selected city
async function getWeatherData(longitude, latitude) {
    try {
        const response = await fetch(`/weather?latitude=${latitude}&longitude=${longitude}`);
        weatherData = await response.json();
        updateWeatherDisplay();
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data');
    }
}

function updateCitySelect(cities) {
    if (!cities.results) { citySelect.innerHTML = '<option value="">No cities found</option>'; return; } 
    citySelect.innerHTML = cities.results.length > 1 ? `<option value="">Select a city - ${cities.results.length} Cities Found </option>` : `<option value="">Select a city - 1 City Found</option>`;
    cities.results.forEach(city => {
        const option = document.createElement('option');
        option.value = `${city.longitude}, ${city.latitude}`;
        option.textContent = `${city.name}, ${city.country} (${city.longitude}, ${city.latitude})`;
        option.setAttribute('data-longitude', city.longitude);
        option.setAttribute('data-latitude', city.latitude);
        citySelect.appendChild(option);
    });
}
// Update weather display based on selected time
function updateWeatherDisplay() {
    if (!weatherData) return;

    const currentHour = parseInt(timeSlider.value);
    const currentWeather = weatherData.hourly;

    // Remove any previous city info div
    const previousCityInfo = document.querySelector('.city-info');
    if (previousCityInfo) {
        previousCityInfo.remove();
    }

    const cityInfo = city.split('(');
    cityName.textContent = cityInfo[0];
    const cityLongitude = cityInfo[1].split(',')[0];
    const cityLatitude = cityInfo[1].split(',')[1].split(')')[0];
    const cityInfoElement = document.createElement('div');
    cityInfoElement.classList.add('city-info');
    cityInfoElement.textContent = `Longitude: ${cityLongitude}, Latitude: ${cityLatitude}`;
    cityName.after(cityInfoElement);
    temperature.textContent = `${currentWeather.temperature_2m[currentHour]}°C`;
    humidity.textContent = `${currentWeather.relative_humidity_2m[currentHour]}%`;
    wind.textContent = `${currentWeather.wind_speed_10m[currentHour]} km/h`;

    drawTemperatureChart();
}

// Draw temperature chart
function drawTemperatureChart() {
    if (!weatherData) return;

    const width = canvas.width;
    const height = canvas.height;
    const currentHour = parseInt(timeSlider.value);

    // Clear canvas
    context.clearRect(0, 0, width, height);

    // Draw temperature data on canvas
    const currentWeather = weatherData.hourly;
    const temperatureData = currentWeather.temperature_2m;
    const maxTemp = Math.max(...temperatureData);
    const minTemp = Math.min(...temperatureData);
    const tempRange = maxTemp - minTemp;

    const hourWidth = width / temperatureData.length;
    const tempHeight = height / tempRange;

    context.beginPath();
    context.strokeStyle = 'blue';
    context.lineWidth = 2;

    temperatureData.forEach((temp, index) => {
        const x = index * hourWidth;
        const y = height - (temp - minTemp) * tempHeight;
        if (index === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
        context.arc(x, y, 3, 0, 2 * Math.PI);
        context.moveTo(x, y);
    });

    context.stroke();
    context.closePath();

    // Draw green dot for currentHour
    const currentX = currentHour * hourWidth;
    const currentY = height - (temperatureData[currentHour] - minTemp) * tempHeight;
    context.beginPath();
    context.fillStyle = 'green';
    context.arc(currentX, currentY, 5, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
}

// Вика се при избиране на нов град от dropdown menu-то
citySelect.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    city = selectedOption.textContent;
    const longitude = selectedOption.getAttribute('data-longitude');
    const latitude = selectedOption.getAttribute('data-latitude');
    if (longitude && latitude) {
        getWeatherData(longitude, latitude);
    }
});

// Вика се при избор на нов час
timeSlider.addEventListener('input', (e) => {
    timeValue.textContent = e.target.value;
    updateWeatherDisplay();
});

// При промяна на размера на прозореца
window.addEventListener('resize', () => {
    if (weatherData) {
        drawTemperatureChart();
    }
});

// Вика се при подаване на формата за търсене на град
cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getCities(city);
    }
});