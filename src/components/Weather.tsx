import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, faCloud, faCloudRain, faCloudShowersHeavy, 
  faBolt, faSnowflake, faSmog, faCloudSun, faWind, 
  faDroplet, faTemperatureHalf
} from '@fortawesome/free-solid-svg-icons';
import { WeatherData, getMockWeatherData } from '../services/weatherService';
import { format } from 'date-fns';

interface WeatherProps {
  date: Date;
}

const Weather = ({ date }: WeatherProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // In a real app, you would use geolocation and the actual API
        // For demo purposes, we'll use mock data
        const data = getMockWeatherData(date);
        setWeather(data);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [date]);

  const getWeatherIcon = (iconCode: string) => {
    // Map OpenWeatherMap icon codes to FontAwesome icons
    switch (iconCode) {
      case '01d':
      case '01n':
        return faSun;
      case '02d':
      case '02n':
        return faCloudSun;
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return faCloud;
      case '09d':
      case '09n':
        return faCloudRain;
      case '10d':
      case '10n':
        return faCloudShowersHeavy;
      case '11d':
      case '11n':
        return faBolt;
      case '13d':
      case '13n':
        return faSnowflake;
      case '50d':
      case '50n':
        return faSmog;
      default:
        return faSun;
    }
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="weather-loading">Loading weather data...</div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="weather-widget error">
        <div className="weather-error">{error || 'Failed to load weather'}</div>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-date">{format(date, 'EEEE, MMMM d')}</div>
      <div className="weather-main">
        <div className="weather-icon">
          <FontAwesomeIcon icon={getWeatherIcon(weather.icon)} />
        </div>
        <div className="weather-temp">
          <FontAwesomeIcon icon={faTemperatureHalf} />
          {Math.round(weather.temperature)}°C
        </div>
      </div>
      <div className="weather-description">{weather.description}</div>
      <div className="weather-details">
        <div className="weather-detail">
          <FontAwesomeIcon icon={faDroplet} />
          <span>{weather.humidity}%</span>
        </div>
        <div className="weather-detail">
          <FontAwesomeIcon icon={faWind} />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;
