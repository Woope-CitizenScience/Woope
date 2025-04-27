// Coordinates for Sitting Bull
// 46.0853,-100.6746
// Weather.gov API Call
// https://api.weather.gov/points/{point x},{point y}
// Forecast Hourly API Call
// https://api.weather.gov/gridpoints/City/{x},{y}/forecast/hourly
import axios from 'axios';

/**
 * Represents the structure of a weather forecast dictionary.
 */
interface ForecastDictionary {
    Day: string;
    Temp: number;
    TempUnit: string;
    Description: string;
}

/**
 * Fetches weather data from the Weather.gov API for a hard-coded set of coordinates.
 * 
 * This function makes an API call to the Weather.gov API to retrieve the forecast for a specific location.
 * It first retrieves the forecast endpoint using the provided coordinates, then fetches the hourly forecast data.
 * The data is transformed into an array of `ForecastDictionary` objects, each representing a forecast period.
 * 
 * @returns {Promise<ForecastDictionary[]>} - A promise that resolves to an array of `ForecastDictionary` objects representing the weather forecast.
 * @throws {Error} - If the API call fails or the data cannot be retrieved.
 */

const getWeatherData = (lat: number, lon: number): Promise<ForecastDictionary[]> => {
    const weather_api = 'https://api.weather.gov/points/';
    const initial_api = `${weather_api}${lat},${lon}`;
    
    return axios.get(initial_api)
        .then(response => {
            const forecast_api = response.data.properties.forecast;
            return axios.get(forecast_api);
        })
        .then(forecast_response => {
            let forecast = forecast_response.data.properties.periods;
            let forecast_return: ForecastDictionary[] = forecast.map((period: any) => ({
                Day: period.name,
                Temp: period.temperature,
                TempUnit: period.temperatureUnit,
                Description: period.shortForecast,
            }));
            return forecast_return;
        })
        .catch(error => {
            console.error(error);
            throw new Error('Failed to retrieve weather data');
        });
};

export default getWeatherData; // Export the function
