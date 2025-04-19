// Weather service using OpenWeatherMap API
// You would need to sign up for a free API key at https://openweathermap.org/

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
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

// In a real app, you would use these functions instead of the mock ones
export const getWeatherForLocation = async (
  lat: number, 
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      date: new Date()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return getMockWeatherData(new Date());
  }
};

export const getForecastForLocation = async (
  lat: number, 
  lon: number, 
  days: number = 5
): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast/daily?lat=${lat}&lon=${lon}&cnt=${days}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    
    const daily = data.list.map((day: any) => ({
      temperature: day.temp.day,
      description: day.weather[0].description,
      icon: day.weather[0].icon,
      humidity: day.humidity,
      windSpeed: day.speed,
      date: new Date(day.dt * 1000)
    }));
    
    return {
      daily,
      current: daily[0]
    };
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return getMockForecast(new Date(), days);
  }
};
