import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  title: string;
  city: string;
  state: string;
  price: number;
  property_type: string;
}

interface SearchWithSuggestionsProps {
  onSearch: (term: string) => void;
  onSelectProperty: (property: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
}

// Mock property data for search suggestions
const mockProperties: SearchSuggestion[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    city: 'Dhaka',
    state: 'Dhaka',
    price: 250000,
    property_type: 'apartment'
  },
  {
    id: '2',
    title: 'Spacious Family House',
    city: 'Dhaka',
    state: 'Dhaka',
    price: 450000,
    property_type: 'house'
  },
  {
    id: '3',
    title: 'Luxury Condo with View',
    city: 'Dhaka',
    state: 'Dhaka',
    price: 380000,
    property_type: 'condo'
  },
  {
    id: '4',
    title: 'Commercial Office Space',
    city: 'Dhaka',
    state: 'Dhaka',
    price: 650000,
    property_type: 'commercial'
  },
  {
    id: '5',
    title: 'Townhouse Complex',
    city: 'Dhaka',
    state: 'Dhaka',
    price: 320000,
    property_type: 'townhouse'
  }
];

export function SearchWithSuggestions({ 
  onSearch, 
  onSelectProperty,
  placeholder = "Search properties...",
  className 
}: SearchWithSuggestionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  const fetchSuggestions = async (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock search - filter properties based on search term
      const filteredSuggestions = mockProperties.filter(property =>
        property.title.toLowerCase().includes(term.toLowerCase()) ||
        property.city.toLowerCase().includes(term.toLowerCase()) ||
        property.state.toLowerCase().includes(term.toLowerCase()) ||
        property.property_type.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 8);

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    onSelectProperty(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="pl-10"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-muted-foreground">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {suggestion.city}, {suggestion.state}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {suggestion.property_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-primary">
                      {formatPrice(suggestion.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : searchTerm.length >= 2 ? (
            <div className="p-3 text-center text-muted-foreground">
              No properties found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}