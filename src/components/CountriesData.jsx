import { useState, useEffect } from 'react'
import axios from 'axios'

function CountriesData({ data, single }) {
    const [visible, setVisible] = useState(false)
    const [coordinates, setCoordinates] = useState({
        lat: null,
        lon: null
    })
    const [weatherData, setWeatherData] = useState(null)
    const [loadingWeather, setLoadingWeather] = useState(true)
    const [buttonClicked, setButtonClicked] = useState(false)

    const appId = import.meta.env.VITE_API_KEY

    let cityName
    if (data.capital)
        cityName = data.capital[0]

    useEffect(() => {
        single && setButtonClicked(true)
    }, [single])

    useEffect(() => {
        if (buttonClicked)
            fetchAndSetWeatherData()
    }, [buttonClicked])

    function fetchAndSetWeatherData() {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${appId}`
            axios
                .get(url)
                .then(response => {
                    console.log('request sent')
                    setWeatherData(
                        {
                            temp: response.data.main.temp,
                            description: response.data.weather[0].description,
                            icon: response.data.weather[0].icon,
                            wind_speed: response.data.wind.speed
                        }
                    )
                    setLoadingWeather(!loadingWeather)
                })
                .catch(error => console.log(error))
    }

    function loopLanguages(languages) {
        const values = []
        for (let language in languages)
            values.push(languages[language])

        return (
            <>
                {
                    values.map(value => (
                        <li key={value}>{value}</li>
                    ))
                }
            </>
        )
    }

    function loopCapitals(capital) {
        const values = []
        for (let key in capital)
            values.push(capital[key])
        return (
            <>
                {
                    values.map((value, id) => (
                        <span key={id}>{value}{id !== values.length - 1 && ", "} </span>
                    ))
                }
            </>
        )
    }

    function handleClick() {
        setVisible(!visible)
        setButtonClicked(!buttonClicked)
    }

    return (
        <div>
            {
                !single &&
                <p>
                    {data.name.common} <button onClick={handleClick}>{visible ? "hide" : "show"}</button>
                </p>
            }
            {
                (single || visible) &&
                <>
                    <h1>{data.name.common}</h1>
                    <b>Continent:</b> {data.continents}<br />
                    <b>Capital:</b> {loopCapitals(data.capital)}<br />
                    <b>Area:</b> {data.area} km²<br /><br />
                    <b>Languages:</b> <ul>{loopLanguages(data.languages)}</ul>
                    <img className="flag" src={data.flags.png} alt='' /><br /><br />
                    {data.flags.alt && <><b>Flag Alt:</b> {data.flags.alt}</>}<br />
                    {loadingWeather && <h2>Loading weather data...</h2>}
                    {
                        weatherData !== null &&
                        <div className="weather">
                            <h2>Weather in {data.capital[0]}</h2>
                            <b>Temperature:</b> {weatherData.temp} °C<br />
                            <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt={weatherData.description} /><br />
                            <b>Wind Speed:</b> {weatherData.wind_speed} ms⁻¹<br /><br />
                        </div>
                    }
                    <div className="border"></div>
                </>
            }

        </div>
    )
}

export default CountriesData