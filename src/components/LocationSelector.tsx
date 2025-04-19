import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faSearch, faTimes, faInfoCircle, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Coordinates } from '../services/weatherService';

interface LocationSelectorProps {
  onLocationSelect: (location: Coordinates, locationName: string) => void;
  onUseCurrentLocation: () => void;
  currentLocationName: string | null;
}

// OpenWeatherMap Geocoding API
const GEOCODING_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const API_KEY = '4a049a5b6480c24ceb2f6c8d5e8d6243'; // Free API key for demo purposes

interface LocationResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// Popular cities for quick selection
const POPULAR_CITIES = [
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
  { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198 },
  { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 },
  { name: 'Rio de Janeiro', country: 'BR', lat: -22.9068, lon: -43.1729 },
  { name: 'Cape Town', country: 'ZA', lat: -33.9249, lon: 18.4241 },
  { name: 'Toronto', country: 'CA', lat: 43.6532, lon: -79.3832 }
];

// Search tips
const SEARCH_TIPS = [
  'Enter a city name (e.g., "Paris", "New York")',
  'Include country for better results (e.g., "Paris, France")',
  'Try using local language names for better results',
  'For US cities, you can include the state (e.g., "Portland, OR")',
  'Search is case-insensitive'
];

const LocationSelector = ({
  onLocationSelect,
  onUseCurrentLocation,
  currentLocationName
}: LocationSelectorProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTips, setShowTips] = useState(true); // Always show tips by default

  const searchLocations = async () => {
    if (!query.trim()) return;

    setSearching(true);
    setError(null);
    setShowTips(false);

    try {
      // Check if query is too short
      if (query.trim().length < 2) {
        setError('Please enter at least 2 characters');
        setSearching(false);
        return;
      }

      const response = await fetch(
        `${GEOCODING_API_URL}?q=${encodeURIComponent(query)}&limit=10&appid=${API_KEY}`
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (response.status === 401) {
          throw new Error('API key error. Please contact support.');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data: LocationResult[] = await response.json();

      if (data.length === 0) {
        setError(`No locations found for "${query}". Try adding country name or check spelling.`);
        setShowTips(true); // Show tips when no results found
      } else {
        setResults(data);
        setShowDropdown(true);
      }
    } catch (err: any) {
      console.error('Error searching locations:', err);
      setError(err.message || 'Failed to search locations. Please try again.');
      setShowTips(true); // Show tips when there's an error
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchLocations();
    }
  };

  const handleLocationSelect = (location: LocationResult) => {
    const locationName = location.state
      ? `${location.name}, ${location.state}, ${location.country}`
      : `${location.name}, ${location.country}`;

    onLocationSelect(
      { latitude: location.lat, longitude: location.lon },
      locationName
    );

    setQuery('');
    setResults([]);
    setShowDropdown(false);
    setShowTips(false);
  };

  // Handle popular city selection
  const handlePopularCitySelect = (city: typeof POPULAR_CITIES[0]) => {
    onLocationSelect(
      { latitude: city.lat, longitude: city.lon },
      `${city.name}, ${city.country}`
    );

    setQuery('');
    setResults([]);
    setShowDropdown(false);
    setShowTips(false);
  };

  // Toggle search tips
  const toggleTips = () => {
    setShowTips(!showTips);
  };

  return (
    <div className="location-selector">
      <div className="location-header">
        <FontAwesomeIcon icon={faLocationDot} />
        <span>Weather Location</span>
        <button
          className="tips-toggle"
          onClick={toggleTips}
          title="Search tips"
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </button>
      </div>

      <div className="location-current">
        <button
          className="use-current-location"
          onClick={onUseCurrentLocation}
          title="Use your current location"
        >
          <FontAwesomeIcon icon={faLocationDot} />
          <span>Use my current location</span>
        </button>

        {currentLocationName && (
          <div className="current-location-name">
            Current: {currentLocationName}
          </div>
        )}
      </div>

      {/* Popular cities section */}
      <div className="popular-cities">
        <div className="popular-cities-header">
          <FontAwesomeIcon icon={faGlobe} />
          <span>Popular Cities</span>
        </div>
        <div className="popular-cities-list">
          {POPULAR_CITIES.slice(0, 5).map((city, index) => (
            <button
              key={`${city.name}-${index}`}
              className="popular-city"
              onClick={() => handlePopularCitySelect(city)}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      <div className="location-search">
        <div className="search-input-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a city..."
            className="location-input"
          />
          {query && (
            <button
              className="clear-search"
              onClick={() => {
                setQuery('');
                setResults([]);
                setShowDropdown(false);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>

        <button
          className="search-button"
          onClick={searchLocations}
          disabled={searching || !query.trim()}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="location-error">{error}</div>}

      {/* Search tips */}
      {showTips && (
        <div className="search-tips">
          <div className="search-tips-header">
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>Search Tips</span>
          </div>
          <ul className="tips-list">
            {SEARCH_TIPS.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {showDropdown && results.length > 0 && (
        <div className="location-results">
          {results.map((location, index) => (
            <div
              key={`${location.name}-${location.lat}-${location.lon}-${index}`}
              className="location-result"
              onClick={() => handleLocationSelect(location)}
            >
              <FontAwesomeIcon icon={faLocationDot} />
              <span>
                {location.name}
                {location.state && `, ${location.state}`}
                {location.country && `, ${location.country}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
