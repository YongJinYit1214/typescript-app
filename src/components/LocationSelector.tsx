import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
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

  const searchLocations = async () => {
    if (!query.trim()) return;
    
    setSearching(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${GEOCODING_API_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: LocationResult[] = await response.json();
      
      if (data.length === 0) {
        setError('No locations found. Try a different search term.');
      } else {
        setResults(data);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error('Error searching locations:', err);
      setError('Failed to search locations. Please try again.');
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
  };

  return (
    <div className="location-selector">
      <div className="location-header">
        <FontAwesomeIcon icon={faLocationDot} />
        <span>Weather Location</span>
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
