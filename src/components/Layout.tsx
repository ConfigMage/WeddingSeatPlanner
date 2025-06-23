import React from 'react';
import { useSeatingChart } from '../context/SeatingChartContext';
import { PlanningMode } from './PlanningMode';
import { KioskMode } from './KioskMode';
import { ModeSwitcher } from './ModeSwitcher';

export const Layout: React.FC = () => {
  const { mode } = useSeatingChart();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-semibold text-gray-900">
              Wedding Seating Chart
            </h1>
            <ModeSwitcher />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {mode === 'planning' ? <PlanningMode /> : <KioskMode />}
      </main>
    </div>
  );
};