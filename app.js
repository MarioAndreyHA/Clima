if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./ws.js')
            .then((registration) => {
                console.log('Service Worker registrado', registration.scope); 
            })
            .catch((error) => {
                console.log('Error al registrar el Service Worker:', error);
            });
    });
}

document.getElementById('boton').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        getWeather(city);
        getForecast(city);
    } else {
        alert("Por favor ingresa una ciudad");
    }
});

async function getWeather(city) {
    const apiKey = '1afc9034d97a6ede82d14e177d189e5f';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ciudad no encontrada');
        const data = await response.json();

        document.getElementById('cityName').textContent = data.name;
        document.getElementById('temperature').textContent = `${data.main.temp}°C`;
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = data.main.humidity;
        document.getElementById('windSpeed').textContent = data.wind.speed;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        
        const fecha = new Date();
        document.getElementById('date').textContent = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });

    } catch (error) {
        alert(error.message);
    }
}

async function getForecast(city) {
    const apiKey = '1afc9034d97a6ede82d14e177d189e5f';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se pudo obtener el pronóstico');
        const data = await response.json();

        const forecastDays = [6, 12, 20]; // Datos de cada 8 horas para 3 días
        forecastDays.forEach((time, index) => {
            const dayData = data.list[time];
            document.getElementById(`day${index + 1}`).textContent = new Date(dayData.dt * 1000).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            document.getElementById(`temp${index + 1}`).textContent = `${dayData.main.temp}°C`;
            document.getElementById(`icon${index + 1}`).src = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
        });

    } catch (error) {
        console.error(error);
    }
}
