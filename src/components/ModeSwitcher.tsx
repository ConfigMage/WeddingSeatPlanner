import React from 'react';
import { useSeatingChart } from '../context/SeatingChartContext';
import { Edit3, Monitor } from 'lucide-react';

export const ModeSwitcher: React.FC = () => {
  const { mode, setMode } = useSeatingChart();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setMode('planning')}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
          mode === 'planning'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <Edit3 className="w-4 h-4 mr-2" />
        Planning Mode
      </button>
      <button
        onClick={() => setMode('kiosk')}
        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
          mode === 'kiosk'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <Monitor className="w-4 h-4 mr-2" />
        Kiosk Mode
      </button>
    </div>
  );
};