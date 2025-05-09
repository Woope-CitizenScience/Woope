import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

interface WeatherData {
    Day: string;
    Temp: number;
    TempUnit: string;
    Description: string;
}

const getWeatherIcon = (description: string) => {
    const lowerCaseDescription = description.toLowerCase();
    if (lowerCaseDescription.includes('clear')) return '☀️';
    if (lowerCaseDescription.includes('cloudy')) return '☁️';
    if (lowerCaseDescription.includes('rain')) return '🌧️';
    if (lowerCaseDescription.includes('snow')) return '❄️';
    if (lowerCaseDescription.includes('thunder')) return '⛈️';
    return '🌈';
};

const Weather: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [locationName, setLocationName] = useState<string>('Your Location');

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setError('Location permission denied');
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                const response = await axios.get<WeatherData[]>(
                    `${process.env.EXPO_PUBLIC_API_URL}/weather/forecast?lat=${latitude}&lon=${longitude}`
                );

                setWeatherData(response.data.slice(0, 7));

                // Optional: Get location name using reverse geocoding
                const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (geo.length > 0) {
                    const city = geo[0].city || geo[0].region || 'Your Location';
                    setLocationName(city);
                }

            } catch (err) {
                console.error(err);
                setError('Failed to fetch weather data');
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#ff8c00" />;
    if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.cityText}>{locationName}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                {weatherData.map((data, index) => (
                    <View key={index} style={styles.weatherItem}>
                        <Text style={styles.weatherIcon}>{getWeatherIcon(data.Description)}</Text>
                        <View style={styles.weatherDetails}>
                            <Text style={styles.day}>{data.Day}</Text>
                            <Text style={styles.temperature}>{data.Temp}°{data.TempUnit}</Text>
                            <Text style={styles.description}>{data.Description}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#B4D7EE',
        borderRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginHorizontal: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E7F3FD',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    scrollView: {
        flexDirection: 'row',
    },
    weatherItem: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        padding: 10,
        marginRight: 20,
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    weatherDetails: {
        marginLeft: 10,
    },
    weatherIcon: {
        fontSize: 30,
    },
    day: {
        fontWeight: 'bold',
        color: '#ff8c00',
        fontSize: 16,
    },
    temperature: {
        fontSize: 16,
        color: '#555',
        fontWeight: 'bold',
    },
    description: {
        fontSize: 15,
        color: '#555',
    },
    errorText: {
        color: '#D8000C',
        textAlign: 'center',
    },
    cityText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },    
});
export default Weather;