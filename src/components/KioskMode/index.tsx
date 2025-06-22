import React, { useState, useRef } from 'react';
import { useSeatingChart } from '../../context/SeatingChartContext';
import { GuestSearch } from './GuestSearch';
import { TableDisplay } from './TableDisplay';
import { Upload } from 'lucide-react';
import type { SeatingChart } from '../../types';

export const KioskMode: React.FC = () => {
  const { seatingChart, setSeatingChart } = useSeatingChart();
  const [highlightedGuestId, setHighlightedGuestId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as SeatingChart;
        setSeatingChart(data);
      } catch (error) {
        alert('Invalid JSON file. Please upload a valid seating chart.');
      }
    };
    reader.readAsText(file);
  };

  if (!seatingChart) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Kiosk Mode</h2>
          <p className="text-gray-600 mb-6">Upload a seating chart to get started</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Seating Chart (JSON)
          </button>
        </div>
      </div>
    );
  }

  const allGuests = [
    ...seatingChart.tables.flatMap(table => 
      table.guests.map(guest => ({ ...guest, table: table.name }))
    ),
    ...seatingChart.unassignedGuests,
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <GuestSearch 
            guests={allGuests}
            onGuestSelect={(guestId) => setHighlightedGuestId(guestId)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-50">
        <TableDisplay
          seatingChart={seatingChart}
          highlightedGuestId={highlightedGuestId}
        />
      </div>
    </div>
  );
};