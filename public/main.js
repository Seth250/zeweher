const api = {
    key: '81d9f5f21e9130cad264193570df7607',
    baseurl: 'https://api.openweathermap.org/data/2.5/'
}

const city = document.querySelector('.city');
const date = document.querySelector('.date');
const description = document.querySelector('.description');
const temp = document.querySelector('.temperature');
const feelsLike = document.querySelector('.feels-like');
const icon = document.querySelector('.icon');

function setQuery(event){
    if (event.keyCode == 13) {
        getSearchResults(event.target.value);
    }
}

async function getSearchResults(query){
    try{
        const response = await fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`);
        if (response.ok) {
            const data = await response.json();
            showWeatherDetails(data)
        } else {
            alert('An error occurred, You might have entered an Invalid City!');
            // throw new Error('An error occurred, You might have entered an invalid City!');
        }
    } catch(err) {
        alert('An unexpected error occurred, Check your internet connection and try again!');
        console.error(err);
    }
}

function showWeatherDetails(weatherData){
    city.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    localStorage.setItem('city', city.textContent);

    const now = new Date();
    date.textContent = getDateValues(now);
    localStorage.setItem('date', date.textContent);
    
    temp.innerHTML = `
        CURRENTLY
        <div class="degree">
            <p>
                <span class="value">${Math.round(weatherData.main.temp)}°</span>
                <span class="unit">C</span>
            </p>
        </div>
    `;
    localStorage.setItem('tempvalue', temp.querySelector('.value').textContent);

    description.textContent = weatherData.weather[0].description;
    localStorage.setItem('description', description.textContent);

    feelsLike.textContent = `Feels like ${Math.round(weatherData.main.feels_like)}°C`;
    localStorage.setItem('feelslike', feelsLike.textContent);

    icon.innerHTML = `<img src="${getWeatherIconUrl(weatherData.weather[0].icon)}" alt="weather icon" class="temp-icon" />`;
    localStorage.setItem('tempiconurl', icon.querySelector('.temp-icon').getAttribute('src'));
}

function getLastSearchData(){
    city.textContent = localStorage.getItem('city');

    date.textContent = localStorage.getItem('date');
    
    temp.innerHTML = `
        CURRENTLY
        <div class="degree">
            <p>
                <span class="value">${localStorage.getItem('tempvalue')}</span>
                <span class="unit">C</span>
            </p>
        </div>
    `;

    description.textContent = localStorage.getItem('description');

    feelsLike.textContent = localStorage.getItem('feelslike');

    icon.innerHTML = `<img src="${localStorage.getItem('tempiconurl')}" alt="weather icon" class="temp-icon" />`;
}

function getWeatherIconUrl(icon){
    return `https://openweathermap.org/img/wn/${icon}@4x.png`
}

function mobileSearchToggle(event){
    if (window.matchMedia("(max-width: 600px)").matches){
		event.target.classList.toggle('fa-search');
		event.target.classList.toggle('fa-arrow-left');
		document.querySelector('.page-header h1').classList.toggle('heading-collapse');
		document.querySelector('.search-box').classList.toggle('search-mobile');
		const searchInput = document.querySelector('.search-box__input');
		searchInput.classList.toggle('input-collapse');
		searchInput.focus();
	}
}


function getDateValues(date){
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function initialize(){
    if (localStorage.getItem('city')){
        getLastSearchData();
    }

    const searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('keypress', setQuery, false);

    const searchIcon = document.getElementById('search-icon')
    searchIcon.addEventListener('click', mobileSearchToggle, false);
}

window.addEventListener('load', initialize, false);