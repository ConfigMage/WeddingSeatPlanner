import React, { useState } from 'react';
import { useSeatingChart } from '../../context/SeatingChartContext';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { Table as TableType, Guest } from '../../types';
import { ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';
import { getInitials, getMealIcon } from '../../utils/nameUtils';

interface TableProps {
  table: TableType;
}

interface GuestSeatProps {
  guest: Guest;
  table: TableType;
  x: number;
  y: number;
  hoveredGuestId: string | null;
  setHoveredGuestId: (id: string | null) => void;
}

const GuestSeat: React.FC<GuestSeatProps> = ({ 
  guest, 
  table, 
  x, 
  y, 
  hoveredGuestId, 
  setHoveredGuestId 
}) => {
  const { moveGuest } = useSeatingChart();
  const isHovered = hoveredGuestId === guest.id;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: guest.id,
    data: { type: 'guest', guest, sourceTableId: table.id },
  });

  const dragStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleRemoveGuest = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    moveGuest(guest.id, null);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium cursor-move transition-all ${
        isHovered ? 'bg-purple-500 scale-125 z-10 shadow-lg shadow-purple-500/50' : 'bg-purple-600 hover:bg-purple-700'
      } ${isDragging ? 'opacity-50' : ''}`}
      style={{ left: x, top: y, ...dragStyle }}
      onMouseEnter={() => setHoveredGuestId(guest.id)}
      onMouseLeave={() => setHoveredGuestId(null)}
    >
      <span className={`font-semibold ${isHovered ? 'text-sm' : 'text-xs'}`}>
        {getInitials(guest.name)}
      </span>
      
      {/* Remove button */}
      {isHovered && !isDragging && (
        <button
          onClick={handleRemoveGuest}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white z-20"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      
      {/* Hover tooltip */}
      {isHovered && !isDragging && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-30">
          <div className="text-sm font-medium">{guest.name}</div>
          {guest.mealChoice && (
            <div className="text-xs text-gray-300">
              {getMealIcon(guest.mealChoice)} {guest.mealChoice}
            </div>
          )}
          {guest.notes && (
            <div className="text-xs text-gray-300 mt-1 max-w-xs">
              {guest.notes}
            </div>
          )}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

const Table: React.FC<TableProps> = ({ table }) => {
  const [hoveredGuestId, setHoveredGuestId] = useState<string | null>(null);
  
  const { setNodeRef, isOver } = useDroppable({
    id: table.id,
    data: { type: 'table', table },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: `table-${table.id}`,
    data: { type: 'table-move', table },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };


  const isFull = table.guests.length >= table.seats;

  return (
    <div
      ref={setDragRef}
      style={{
        ...style,
        position: 'absolute',
        left: table.x,
        top: table.y,
      }}
      className="select-none"
    >
      <div
        ref={setNodeRef}
        className={`relative w-48 h-48 bg-white rounded-full shadow-lg transition-all ${
          isOver && !isFull ? 'ring-4 ring-purple-400' : ''
        } ${isFull ? 'bg-red-50' : ''}`}
      >
        <div
          {...listeners}
          {...attributes}
          className="absolute inset-0 flex flex-col items-center justify-center cursor-move"
        >
          <h3 className="text-lg font-semibold">{table.name}</h3>
          <p className={`text-sm ${isFull ? 'text-red-600' : 'text-gray-600'}`}>
            {table.guests.length}/{table.seats} seats
          </p>
        </div>

        {/* Guest seats around the table */}
        <div className="absolute inset-0">
          {table.guests.map((guest, index) => {
            const angle = (index * 2 * Math.PI) / table.seats;
            const radius = 75;
            const x = Math.cos(angle) * radius + 96 - 16;
            const y = Math.sin(angle) * radius + 96 - 16;

            return (
              <GuestSeat
                key={guest.id}
                guest={guest}
                table={table}
                x={x}
                y={y}
                hoveredGuestId={hoveredGuestId}
                setHoveredGuestId={setHoveredGuestId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const VenueLayout: React.FC = () => {
  const { seatingChart } = useSeatingChart();
  const [zoom, setZoom] = useState(1);

  if (!seatingChart) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Create a seating chart to start arranging tables
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div 
        className="relative w-full h-full overflow-auto"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}
      >
        <div className="relative min-w-[1200px] min-h-[800px] p-8">
          {seatingChart.tables.map((table) => (
            <Table key={table.id} table={table} />
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button
          onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};