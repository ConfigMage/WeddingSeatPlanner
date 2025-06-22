import React, { useEffect, useRef } from 'react';
import type { SeatingChart } from '../../types';

interface TableDisplayProps {
  seatingChart: SeatingChart;
  highlightedGuestId: string | null;
}

export const TableDisplay: React.FC<TableDisplayProps> = ({ seatingChart, highlightedGuestId }) => {
  const highlightedTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedGuestId && highlightedTableRef.current) {
      highlightedTableRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [highlightedGuestId]);

  const getHighlightedTable = () => {
    if (!highlightedGuestId) return null;
    
    return seatingChart.tables.find(table =>
      table.guests.some(guest => guest.id === highlightedGuestId)
    );
  };

  const highlightedTable = getHighlightedTable();

  const getMealIcon = (meal?: string) => {
    if (!meal) return '';
    switch (meal?.toLowerCase()) {
      case 'steak': return '🥩';
      case 'chicken': return '🍗';
      case 'veg': return '🥗';
      default: return '';
    }
  };

  return (
    <div className="p-8">
      <div className="relative min-w-[1200px] min-h-[800px]">
        {seatingChart.tables.map((table) => {
          const isHighlighted = table.id === highlightedTable?.id;
          
          return (
            <div
              key={table.id}
              ref={isHighlighted ? highlightedTableRef : null}
              style={{
                position: 'absolute',
                left: table.x,
                top: table.y,
              }}
              className={`transition-all duration-500 ${
                isHighlighted ? 'scale-110 z-10' : ''
              }`}
            >
              <div
                className={`relative w-48 h-48 bg-white rounded-full shadow-lg transition-all ${
                  isHighlighted ? 'ring-4 ring-purple-600 shadow-2xl' : ''
                }`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold">{table.name}</h3>
                  <p className="text-sm text-gray-600">
                    {table.guests.length}/{table.seats} seats
                  </p>
                </div>

                {/* Guest seats */}
                <div className="absolute inset-0">
                  {table.guests.map((guest, index) => {
                    const angle = (index * 2 * Math.PI) / table.seats - Math.PI / 2;
                    const radius = 75;
                    const x = Math.cos(angle) * radius + 96 - 20;
                    const y = Math.sin(angle) * radius + 96 - 20;
                    const isGuestHighlighted = guest.id === highlightedGuestId;

                    return (
                      <div
                        key={guest.id}
                        className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all ${
                          isGuestHighlighted
                            ? 'bg-purple-600 scale-150 z-10 ring-4 ring-purple-300'
                            : 'bg-gray-400'
                        }`}
                        style={{ left: x, top: y }}
                        title={`${guest.name} - ${guest.mealChoice || 'No meal selected'}`}
                      >
                        {isGuestHighlighted ? (
                          <span className="font-bold">{guest.name.charAt(0)}</span>
                        ) : (
                          getMealIcon(guest.mealChoice) || guest.name.charAt(0)
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guest list for highlighted table */}
              {isHighlighted && (
                <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
                  <h4 className="font-semibold mb-2">{table.name} Guests:</h4>
                  <ul className="space-y-1">
                    {table.guests.map((guest) => (
                      <li
                        key={guest.id}
                        className={`text-sm ${
                          guest.id === highlightedGuestId
                            ? 'font-bold text-purple-600'
                            : 'text-gray-700'
                        }`}
                      >
                        {guest.name} {getMealIcon(guest.mealChoice)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};