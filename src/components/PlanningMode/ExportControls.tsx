import React from 'react';
import { useSeatingChart } from '../../context/SeatingChartContext';
import { Download } from 'lucide-react';

export const ExportControls: React.FC = () => {
  const { seatingChart } = useSeatingChart();

  const exportToJSON = () => {
    if (!seatingChart) return;

    const dataStr = JSON.stringify(seatingChart, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seating-chart-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!seatingChart) return;

    const rows = ['Name,Table,Meal choice,Notes'];
    
    // Add assigned guests
    seatingChart.tables.forEach(table => {
      table.guests.forEach(guest => {
        rows.push(`"${guest.name}","${table.name}","${guest.mealChoice || ''}","${guest.notes || ''}"`);
      });
    });
    
    // Add unassigned guests
    seatingChart.unassignedGuests.forEach(guest => {
      rows.push(`"${guest.name}","","${guest.mealChoice || ''}","${guest.notes || ''}"`);
    });

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!seatingChart) return null;

  return (
    <div className="space-y-2">
      <button
        onClick={exportToJSON}
        className="w-full flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Export for Kiosk Mode
      </button>
      <button
        onClick={exportToCSV}
        className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Guest List (CSV)
      </button>
    </div>
  );
};