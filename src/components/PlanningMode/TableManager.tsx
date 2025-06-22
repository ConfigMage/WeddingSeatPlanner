import React, { useState } from 'react';
import { useSeatingChart } from '../../context/SeatingChartContext';
import type { Table } from '../../types';
import { Plus, X } from 'lucide-react';

export const TableManager: React.FC = () => {
  const { seatingChart, addTable, removeTable } = useSeatingChart();
  const [showAddForm, setShowAddForm] = useState(false);
  const [tableName, setTableName] = useState('');
  const [seats, setSeats] = useState(8);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddTable = () => {
    if (!seatingChart || !tableName) return;

    const newTable: Table = {
      id: generateId(),
      name: tableName,
      seats: seats,
      x: 100 + (seatingChart.tables.length % 4) * 250,
      y: 100 + Math.floor(seatingChart.tables.length / 4) * 250,
      guests: [],
    };

    addTable(newTable);
    setTableName('');
    setSeats(8);
    setShowAddForm(false);
  };

  if (!seatingChart) {
    return (
      <div className="text-gray-500 text-sm">
        Create a seating chart to manage tables
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Tables ({seatingChart.tables.length})</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1 text-purple-600 hover:bg-purple-50 rounded"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Table name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <div className="flex items-center space-x-2">
            <label className="text-sm">Seats:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value) || 8)}
              className="w-20 px-2 py-1 border rounded-md"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddTable}
              className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
            >
              Add Table
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {seatingChart.tables.map((table) => (
          <div
            key={table.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
          >
            <div>
              <span className="font-medium">{table.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({table.guests.length}/{table.seats} seats)
              </span>
            </div>
            <button
              onClick={() => removeTable(table.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};