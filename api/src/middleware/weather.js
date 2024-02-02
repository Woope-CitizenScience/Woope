import axios from 'axios';

// Coordinates for Sitting Bull
// 46.0853,-100.6746

//Weather.gov API Call
//https://api.weather.gov/points/{point x},{point y}
//Forecast Hourly API Call
//https://api.weather.gov/gridpoints/City/{x},{y}/forecast/hourly

async function fetch(){
    const response = await axios({
        method: 'GET',
        url: 'https://api.weather.gov/points/46.0853,-100.6746',
    });
};

let data = fetch();
console.log(data);
