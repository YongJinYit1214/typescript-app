// Weather service using OpenWeatherMap API
// Using a free API key for demonstration purposes
// In a production app, you would use environment variables to store API keys

const API_KEY = '4a049a5b6480c24ceb2f6c8d5e8d6243'; // Free API key for demo purposes
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  date: Date;
}

export interface ForecastData {
  daily: WeatherData[];
  current: WeatherData;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Get user's current location using browser's geolocation API
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

// For demo purposes, we'll use mock data instead of actual API calls
export const getMockWeatherData = (date: Date): WeatherData => {
  // Generate deterministic but random-looking weather based on the date
  const dateStr = date.toISOString().split('T')[0];
  const seed = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const randomTemp = 10 + (seed % 25); // Temperature between 10 and 35°C
  const descriptions = [
    'Clear sky', 'Few clouds', 'Scattered clouds',
    'Broken clouds', 'Shower rain', 'Rain',
    'Thunderstorm', 'Snow', 'Mist'
  ];
  const icons = [
    '01d', '02d', '03d', '04d', '09d',
    '10d', '11d', '13d', '50d'
  ];

  const descIndex = seed % descriptions.length;

  return {
    temperature: randomTemp,
    description: descriptions[descIndex],
    icon: icons[descIndex],
    humidity: 30 + (seed % 60), // Humidity between 30% and 90%
    windSpeed: 2 + (seed % 18), // Wind speed between 2 and 20 km/h
    date: date
  };
};

export const getMockForecast = (startDate: Date, days: number = 5): ForecastData => {
  const daily: WeatherData[] = [];

  for (let i = 0; i < days; i++) {
    const forecastDate = new Date(startDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    daily.push(getMockWeatherData(forecastDate));
  }

  return {
    daily,
    current: daily[0]
  };
};

// Real weather API functions
export const getWeatherForLocation = async (
  lat: number,
  lon: number,
  date?: Date
): Promise<WeatherData> => {
  try {
    // If date is provided and it's not today, use the forecast endpoint
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = date || new Date();
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(targetDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If the date is today or in the past, use current weather
    // Otherwise use forecast for future dates
    if (diffDays === 0 || targetDate < today) {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        date: new Date()
      };
    } else {
      // For future dates, use the forecast
      const forecast = await getForecastForLocation(lat, lon, diffDays + 1);
      return forecast.daily[diffDays];
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Fall back to mock data if API fails
    return getMockWeatherData(date || new Date());
  }
};

export const getForecastForLocation = async (
  lat: number,
  lon: number,
  days: number = 5
): Promise<ForecastData> => {
  try {
    // OpenWeatherMap's free tier doesn't have daily forecast endpoint anymore
    // Using the 5-day/3-hour forecast and aggregating by day
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    // Group forecast data by day
    const dailyData: { [key: string]: any[] } = {};

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = [];
      }

      dailyData[dateKey].push(item);
    });

    // Calculate daily averages
    const daily = Object.keys(dailyData).slice(0, days).map(dateKey => {
      const items = dailyData[dateKey];
      const temps = items.map(item => item.main.temp);
      const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;

      // Use the noon forecast or the middle of the day if available
      const middleIndex = Math.floor(items.length / 2);
      const middleItem = items[middleIndex];

      return {
        temperature: avgTemp,
        description: middleItem.weather[0].description,
        icon: middleItem.weather[0].icon,
        humidity: middleItem.main.humidity,
        windSpeed: middleItem.wind.speed,
        date: new Date(dateKey)
      };
    });

    return {
      daily,
      current: daily[0]
    };
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    // Fall back to mock data if API fails
    return getMockForecast(new Date(), days);
  }
};

// Get real-time weather for the user's current location
export const getCurrentLocationWeather = async (date?: Date): Promise<WeatherData> => {
  try {
    const { latitude, longitude } = await getCurrentLocation();
    return await getWeatherForLocation(latitude, longitude, date);
  } catch (error) {
    console.error('Error getting location or weather:', error);
    return getMockWeatherData(date || new Date());
  }
};

// Get forecast for the user's current location
export const getCurrentLocationForecast = async (days: number = 5): Promise<ForecastData> => {
  try {
    const { latitude, longitude } = await getCurrentLocation();
    return await getForecastForLocation(latitude, longitude, days);
  } catch (error) {
    console.error('Error getting location or forecast:', error);
    return getMockForecast(new Date(), days);
  }
};
