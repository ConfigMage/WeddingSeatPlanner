import React, { useRef } from 'react';
import Papa from 'papaparse';
import { useSeatingChart } from '../../context/SeatingChartContext';
import type { Guest, SeatingChart, CSVRow } from '../../types';
import { Upload, Download } from 'lucide-react';

interface CSVUploadProps {
  onComplete: () => void;
}

export const CSVUpload: React.FC<CSVUploadProps> = ({ onComplete }) => {
  const { setSeatingChart } = useSeatingChart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as CSVRow[];
        const guests: Guest[] = [];
        const tableMap = new Map<string, Guest[]>();

        rows.forEach((row) => {
          if (row.Name) {
            const guest: Guest = {
              id: generateId(),
              name: row.Name,
              table: row.Table,
              mealChoice: row['Meal choice'] as Guest['mealChoice'],
              notes: row.Notes,
            };

            if (row.Table) {
              const tableName = row.Table.replace('Table ', '');
              if (!tableMap.has(tableName)) {
                tableMap.set(tableName, []);
              }
              tableMap.get(tableName)!.push(guest);
            } else {
              guests.push(guest);
            }
          }
        });

        const newChart: SeatingChart = {
          id: generateId(),
          name: 'My Wedding Seating Chart',
          tables: Array.from(tableMap.entries()).map(([name, tableGuests], index) => ({
            id: generateId(),
            name: `Table ${name}`,
            seats: Math.max(tableGuests.length, 8),
            x: 100 + (index % 4) * 250,
            y: 100 + Math.floor(index / 4) * 250,
            guests: tableGuests,
          })),
          unassignedGuests: guests,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setSeatingChart(newChart);
        onComplete();
      },
      error: (error) => {
        alert(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  const downloadTemplate = () => {
    const template = `Name,Table,Meal choice,Notes
John Doe,Table 1,Steak,
Jane Smith,Table 1,Chicken,Vegetarian option needed
Bob Johnson,Table 2,Veg,Nut allergy`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seating_chart_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Guest List (CSV)
        </button>
      </div>
      
      <button
        onClick={downloadTemplate}
        className="w-full flex items-center justify-center px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Download CSV Template
      </button>
    </div>
  );
};