import React, { useState } from 'react';
import { useSeatingChart } from '../../context/SeatingChartContext';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { Guest } from '../../types';
import { CSVUpload } from './CSVUpload';
import { TableManager } from './TableManager';
import { GuestList } from './GuestList';
import { VenueLayout } from './VenueLayout';
import { ExportControls } from './ExportControls';
import { Upload, Trash2 } from 'lucide-react';

export const PlanningMode: React.FC = () => {
  const { seatingChart, clearChart, moveGuest, updateTable } = useSeatingChart();
  const [showCSVUpload, setShowCSVUpload] = useState(!seatingChart);
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

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'guest') {
      setActiveGuest(event.active.data.current.guest);
    }
  };

  const handleClearChart = () => {
    if (window.confirm('Are you sure you want to clear the entire seating chart?')) {
      clearChart();
      setShowCSVUpload(true);
    }
  };

  if (showCSVUpload) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
          <div className="space-y-6">
            <CSVUpload onComplete={() => setShowCSVUpload(false)} />
            <div className="text-center text-gray-600">
              <p>or</p>
            </div>
            <button
              onClick={() => setShowCSVUpload(false)}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Start with an empty chart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-md overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Guests & Tables</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCSVUpload(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                  title="Upload CSV"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearChart}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <ExportControls />
          </div>
          
          <div className="p-4 border-b">
            <TableManager />
          </div>
          
          <div className="p-4">
            <GuestList />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          <VenueLayout />
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
  );
};