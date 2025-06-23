import React, { useState, useEffect, useRef } from 'react';
import type { Guest } from '../../types';
import { Search, X } from 'lucide-react';

interface GuestSearchProps {
  guests: Guest[];
  onGuestSelect: (guestId: string) => void;
}

export const GuestSearch: React.FC<GuestSearchProps> = ({ guests, onGuestSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = guests.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, guests]);

  const handleGuestSelect = (guest: Guest) => {
    onGuestSelect(guest.id);
    setSearchQuery(guest.name);
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for your name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto z-10">
          {searchResults.map((guest) => (
            <button
              key={guest.id}
              onClick={() => handleGuestSelect(guest)}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{guest.name}</div>
                {guest.table && (
                  <div className="text-sm text-gray-600">{guest.table}</div>
                )}
              </div>
              {guest.mealChoice && (
                <span className="text-sm text-gray-500">{guest.mealChoice}</span>
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};