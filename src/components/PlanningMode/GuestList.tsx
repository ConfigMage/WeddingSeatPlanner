import React, { useState } from 'react';
import { useSeatingChart } from '../../context/SeatingChartContext';
import type { Guest } from '../../types';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Search, Users } from 'lucide-react';

interface DraggableGuestProps {
  guest: Guest;
}

const DraggableGuest: React.FC<DraggableGuestProps> = ({ guest }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: guest.id,
    data: { type: 'guest', guest },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const getMealIcon = (meal?: string) => {
    if (!meal) return '';
    switch (meal.toLowerCase()) {
      case 'steak': return '🥩';
      case 'chicken': return '🍗';
      case 'veg': return '🥗';
      default: return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-2 bg-white border rounded-md cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{guest.name}</span>
        <span className="text-lg">{getMealIcon(guest.mealChoice)}</span>
      </div>
      {guest.notes && (
        <div className="text-xs text-gray-500 mt-1">{guest.notes}</div>
      )}
    </div>
  );
};

export const GuestList: React.FC = () => {
  const { seatingChart } = useSeatingChart();
  const [searchQuery, setSearchQuery] = useState('');

  if (!seatingChart) {
    return (
      <div className="text-gray-500 text-sm">
        No guests to display
      </div>
    );
  }

  const filteredGuests = seatingChart.unassignedGuests.filter(guest =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGuests = seatingChart.unassignedGuests.length + 
    seatingChart.tables.reduce((sum, table) => sum + table.guests.length, 0);

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium mb-2 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Unassigned Guests ({seatingChart.unassignedGuests.length}/{totalGuests})
        </h3>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredGuests.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">
            {searchQuery ? 'No matching guests' : 'All guests are assigned'}
          </div>
        ) : (
          filteredGuests.map((guest) => (
            <DraggableGuest key={guest.id} guest={guest} />
          ))
        )}
      </div>
    </div>
  );
};