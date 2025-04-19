import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import { EventCategory, CATEGORIES } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  categories: EventCategory[];
  onlyImportant: boolean;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

const SearchBar = ({ onSearch, onFilter }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [onlyImportant, setOnlyImportant] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleCategory = (category: EventCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const applyFilters = () => {
    onFilter({
      categories: selectedCategories,
      onlyImportant,
      dateRange: {
        start: startDate ? new Date(startDate) : null,
        end: endDate ? new Date(endDate) : null
      }
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setOnlyImportant(false);
    setStartDate('');
    setEndDate('');
    onFilter({
      categories: [],
      onlyImportant: false,
      dateRange: {
        start: null,
        end: null
      }
    });
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="search-input-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {query && (
            <button 
              className="clear-search" 
              onClick={() => {
                setQuery('');
                onSearch('');
              }}
              aria-label="Clear search"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
        >
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <h4>Filter Events</h4>
          
          <div className="filter-section">
            <h5>Categories</h5>
            <div className="category-filters">
              {Object.entries(CATEGORIES).map(([key, { label, color, bgColor }]) => (
                <div 
                  key={key} 
                  className={`category-filter ${selectedCategories.includes(key as EventCategory) ? 'selected' : ''}`}
                  style={{ 
                    backgroundColor: selectedCategories.includes(key as EventCategory) ? bgColor : 'transparent',
                    borderColor: color
                  }}
                  onClick={() => toggleCategory(key as EventCategory)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <label className="important-filter">
              <input 
                type="checkbox" 
                checked={onlyImportant}
                onChange={() => setOnlyImportant(!onlyImportant)}
              />
              <span>Only important events</span>
            </label>
          </div>
          
          <div className="filter-section">
            <h5>Date Range</h5>
            <div className="date-range-inputs">
              <div className="date-input-group">
                <label htmlFor="start-date">From</label>
                <input 
                  type="date" 
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-input-group">
                <label htmlFor="end-date">To</label>
                <input 
                  type="date" 
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="filter-actions">
            <button className="reset-filters" onClick={resetFilters}>
              Reset
            </button>
            <button className="apply-filters" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
