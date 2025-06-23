import React, { useState } from 'react';
import type { Guest } from '../../types';
import { getLastName } from '../../utils/nameUtils';

interface AlphabeticalQuickSearchProps {
  guests: (Guest & { table?: string })[];
  onGuestSelect: (guestId: string) => void;
}

export const AlphabeticalQuickSearch: React.FC<AlphabeticalQuickSearchProps> = ({ guests, onGuestSelect }) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [showGuestList, setShowGuestList] = useState(false);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const getGuestsByLetter = (letter: string) => {
    return guests.filter(guest => {
      const lastName = getLastName(guest.name);
      return lastName.toUpperCase().startsWith(letter);
    }).sort((a, b) => {
      const lastNameA = getLastName(a.name);
      const lastNameB = getLastName(b.name);
      return lastNameA.localeCompare(lastNameB);
    });
  };

  const getLettersWithGuests = () => {
    const lettersWithGuests = new Set<string>();
    guests.forEach(guest => {
      const lastName = getLastName(guest.name);
      if (lastName) {
        lettersWithGuests.add(lastName.charAt(0).toUpperCase());
      }
    });
    return lettersWithGuests;
  };

  const lettersWithGuests = getLettersWithGuests();

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    setShowGuestList(true);
  };

  const handleGuestClick = (guestId: string) => {
    onGuestSelect(guestId);
    setShowGuestList(false);
    setSelectedLetter(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3">Quick Search by Last Name</h3>
      
      {showGuestList && selectedLetter && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">
              Guests with last name starting with "{selectedLetter}"
            </h4>
            <button
              onClick={() => {
                setShowGuestList(false);
                setSelectedLetter(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {getGuestsByLetter(selectedLetter).length === 0 ? (
            <p className="text-gray-500 text-sm">No guests found</p>
          ) : (
            <ul className="space-y-2">
              {getGuestsByLetter(selectedLetter).map(guest => (
                <li key={guest.id}>
                  <button
                    onClick={() => handleGuestClick(guest.id)}
                    className="w-full text-left p-2 rounded hover:bg-purple-100 transition-colors"
                  >
                    <div className="font-medium">{guest.name}</div>
                    {guest.table && (
                      <div className="text-sm text-gray-600">Table: {guest.table}</div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-13 gap-1">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            disabled={!lettersWithGuests.has(letter)}
            className={`
              p-2 text-sm font-medium rounded transition-all
              ${lettersWithGuests.has(letter)
                ? 'bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
              ${selectedLetter === letter ? 'bg-purple-600 text-white' : ''}
            `}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};