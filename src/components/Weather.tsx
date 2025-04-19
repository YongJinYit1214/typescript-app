import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun, faCloud, faCloudRain, faCloudShowersHeavy,
  faBolt, faSnowflake, faSmog, faCloudSun, faWind,
  faDroplet, faTemperatureHalf, faLocationDot, faExclamationTriangle,
  faSync, faCheck, faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import {
  WeatherData,
  getCurrentLocationWeather,
  getMockWeatherData,
  getWeatherForLocation,
  getLocationName,
  Coordinates,
  getCurrentLocation
} from '../services/weatherService';
import { format } from 'date-fns';
import LocationSelector from './LocationSelector';

interface WeatherProps {
  date: Date;
}

const Weather = ({ date }: WeatherProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [customLocation, setCustomLocation] = useState<Coordinates | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');

  // Check if geolocation is available
  const isGeolocationAvailable = 'geolocation' in navigator;

  // Function to fetch weather data
  const fetchWeather = async (useDate: Date) => {
    try {
      setLoading(true);
      setUsingMockData(false);
      setConnectionStatus('unknown');

      let data: WeatherData;

      // Use custom location if available, otherwise use current location
      if (customLocation) {
        data = await getWeatherForLocation(
          customLocation.latitude,
          customLocation.longitude,
          useDate
        );

        // If we don't have a location name yet, try to get it
        if (!locationName) {
          const name = await getLocationName(customLocation.latitude, customLocation.longitude);
          setLocationName(name);
        }
      } else {
        // Get real-time weather based on user's current location
        data = await getCurrentLocationWeather(useDate);

        // Try to get the current location name
        if (locationPermission === 'granted') {
          try {
            const coords = await getCurrentLocation();
            const name = await getLocationName(coords.latitude, coords.longitude);
            setLocationName(name);
          } catch (locErr) {
            console.error('Error getting location name:', locErr);
          }
        }
      }

      setWeather(data);
      setError(null);
      setLastUpdated(new Date());
      setConnectionStatus('connected');

      // Check if we fell back to mock data
      if (data === getMockWeatherData(useDate)) {
        setUsingMockData(true);
      }
    } catch (err: any) {
      // Handle geolocation permission errors
      if (err.code === 1) { // Permission denied
        setLocationPermission('denied');
        setError('Location access denied. Please enable location services.');
      } else {
        setError('Failed to load weather data');
        setConnectionStatus('disconnected');
      }
      console.error(err);

      // Fall back to mock data
      const mockData = getMockWeatherData(useDate);
      setWeather(mockData);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Request location permission and fetch weather on component mount
  useEffect(() => {
    if (isGeolocationAvailable) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state as 'granted' | 'denied' | 'prompt');

        // Listen for permission changes
        result.onchange = () => {
          setLocationPermission(result.state as 'granted' | 'denied' | 'prompt');
          if (result.state === 'granted') {
            fetchWeather(date);
          }
        };

        // If permission is already granted, fetch weather
        if (result.state === 'granted') {
          fetchWeather(date);
        } else {
          // Otherwise, use mock data until permission is granted
          setWeather(getMockWeatherData(date));
          setUsingMockData(true);
          setLoading(false);
        }
      });
    } else {
      // Geolocation not available, use mock data
      setWeather(getMockWeatherData(date));
      setUsingMockData(true);
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

  // Update weather when date changes
  useEffect(() => {
    if (locationPermission === 'granted') {
      fetchWeather(date);
    } else {
      // Use mock data if no permission
      setWeather(getMockWeatherData(date));
      setUsingMockData(true);
      setLoading(false);
    }
  }, [date, locationPermission]);

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

  // Function to request location permission
  const requestLocationPermission = () => {
    if (isGeolocationAvailable) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission('granted');
          setCustomLocation(null); // Clear any custom location
          setLocationName(null);
          fetchWeather(date);
        },
        (err) => {
          console.error('Error getting location:', err);
          setLocationPermission('denied');
          setError('Location access denied');
        }
      );
    }
  };

  // Function to refresh weather data
  const refreshWeather = () => {
    if (customLocation) {
      fetchWeather(date);
    } else if (locationPermission === 'granted') {
      fetchWeather(date);
    } else {
      requestLocationPermission();
    }
  };

  // Function to handle custom location selection
  const handleLocationSelect = (location: Coordinates, name: string) => {
    setCustomLocation(location);
    setLocationName(name);
    setShowLocationSelector(false);
    fetchWeather(date);
  };

  // Function to use current location
  const handleUseCurrentLocation = () => {
    setCustomLocation(null);
    setLocationName(null);
    requestLocationPermission();
    setShowLocationSelector(false);
  };

  // Toggle location selector
  const toggleLocationSelector = () => {
    setShowLocationSelector(!showLocationSelector);
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="weather-loading">
          <FontAwesomeIcon icon={faSync} spin />
          <span>Loading weather data...</span>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="weather-widget error">
        <div className="weather-error">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
        </div>
        {locationPermission !== 'granted' && (
          <button className="location-permission-btn" onClick={requestLocationPermission}>
            <FontAwesomeIcon icon={faLocationDot} />
            <span>Enable Location</span>
          </button>
        )}
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-widget error">
        <div className="weather-error">Failed to load weather</div>
      </div>
    );
  }

  return (
    <div className="weather-container">
      {showLocationSelector ? (
        <LocationSelector
          onLocationSelect={handleLocationSelect}
          onUseCurrentLocation={handleUseCurrentLocation}
          currentLocationName={locationName}
        />
      ) : null}

      <div className="weather-widget">
        <div className="weather-header">
          <div className="weather-date">{format(date, 'EEEE, MMMM d')}</div>
          <div className="weather-actions">
            <button
              className="location-toggle"
              onClick={toggleLocationSelector}
              title="Change location"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </button>
            <button
              className="refresh-weather"
              onClick={refreshWeather}
              title="Refresh weather data"
            >
              <FontAwesomeIcon icon={faSync} spin={loading} />
            </button>
          </div>
        </div>

        <div className="weather-status-bar">
          {locationName && (
            <div className="weather-location">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{locationName}</span>
            </div>
          )}

          <div className="weather-connection-status">
            {connectionStatus === 'connected' && (
              <span className="status-connected">
                <FontAwesomeIcon icon={faCheck} />
                <span>Connected</span>
              </span>
            )}
            {connectionStatus === 'disconnected' && (
              <span className="status-disconnected">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <span>Disconnected</span>
              </span>
            )}
            {lastUpdated && (
              <span className="last-updated">
                Updated: {format(lastUpdated, 'h:mm a')}
              </span>
            )}
          </div>
        </div>

        {usingMockData && (
          <div className="weather-location-notice">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>Using simulated weather data</span>
            {!customLocation && locationPermission !== 'granted' && (
              <button onClick={requestLocationPermission}>Enable real-time weather</button>
            )}
          </div>
        )}

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
    </div>
  );
};

export default Weather;
