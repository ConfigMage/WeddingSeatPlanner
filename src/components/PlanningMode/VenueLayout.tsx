import React, { useState } from 'react';
import { useSeatingChart } from '../../context/SeatingChartContext';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Table as TableType, Guest } from '../../types';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface TableProps {
  table: TableType;
}

const Table: React.FC<TableProps> = ({ table }) => {
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

  const getMealIcon = (meal?: string) => {
    if (!meal) return '';
    switch (meal?.toLowerCase()) {
      case 'steak': return '🥩';
      case 'chicken': return '🍗';
      case 'veg': return '🥗';
      default: return '';
    }
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
              <div
                key={guest.id}
                className="absolute w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:bg-purple-700 transition-colors"
                style={{ left: x, top: y }}
                title={`${guest.name} - ${guest.mealChoice || 'No meal selected'}`}
              >
                {getMealIcon(guest.mealChoice) || guest.name.charAt(0)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const VenueLayout: React.FC = () => {
  const { seatingChart, moveGuest, updateTable } = useSeatingChart();
  const [zoom, setZoom] = useState(1);
  const [activeGuest, setActiveGuest] = useState<Guest | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.data.current?.type === 'guest') {
      const guest = active.data.current.guest;
      const targetTableId = over.id as string;
      
      if (over.data.current?.type === 'table') {
        moveGuest(guest.id, targetTableId);
      }
    } else if (active.data.current?.type === 'table-move') {
      const table = active.data.current.table;
      const delta = event.delta;
      
      updateTable(table.id, {
        x: table.x + delta.x,
        y: table.y + delta.y,
      });
    }

    setActiveGuest(null);
  };

  const handleDragStart = (event: any) => {
    if (event.active.data.current?.type === 'guest') {
      setActiveGuest(event.active.data.current.guest);
    }
  };

  if (!seatingChart) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Create a seating chart to start arranging tables
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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

        <DragOverlay>
          {activeGuest && (
            <div className="p-2 bg-white border-2 border-purple-600 rounded-md shadow-lg">
              <span className="text-sm font-medium">{activeGuest.name}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

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