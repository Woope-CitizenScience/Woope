// Coordinates for Sitting Bull
// 46.0853,-100.6746
// Weather.gov API Call
// https://api.weather.gov/points/{point x},{point y}
// Forecast Hourly API Call
// https://api.weather.gov/gridpoints/City/{x},{y}/forecast/hourly
import axios from 'axios';
interface ForecastDictionary {
    Day: string;
    Temp: number;
    TempUnit: string;
    Description: string;
}
const getWeatherData = (): Promise<ForecastDictionary[]> => {
    const point_x = 40.0853; // Hard-coded coordinates
    const point_y = -100.6746;
    const weather_api = 'https://api.weather.gov/points/';
    const initial_api = `${weather_api}${point_x},${point_y}`;
    return axios.get(initial_api)
        .then(response => {
            const forecast_api = response.data.properties.forecast;
            return axios.get(forecast_api);
        })
        .then(forecast_response => {
            let forecast = forecast_response.data.properties.periods;
            let forecast_return: ForecastDictionary[] = [];
            for (let i = 0; i < forecast.length; i++) {
                let dictionary: ForecastDictionary = {
                    Day: forecast[i].name,
                    Temp: forecast[i].temperature,
                    TempUnit: forecast[i].temperatureUnit,
                    Description: forecast[i].shortForecast,
                };
                forecast_return.push(dictionary);
            }
            return forecast_return;
        })
        .catch(error => {
            console.error(error);
            throw new Error('Failed to retrieve weather data'); // Throw an error to be handled by the caller
        });
}
export default getWeatherData; // Export the function