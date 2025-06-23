import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Guest, Table, SeatingChart, AppMode } from '../types';

interface SeatingChartContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  seatingChart: SeatingChart | null;
  setSeatingChart: (chart: SeatingChart | null) => void;
  addTable: (table: Table) => void;
  removeTable: (tableId: string) => void;
  updateTable: (tableId: string, updates: Partial<Table>) => void;
  moveGuest: (guestId: string, tableId: string | null) => void;
  updateGuest: (guestId: string, updates: Partial<Guest>) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  clearChart: () => void;
}

const SeatingChartContext = createContext<SeatingChartContextType | undefined>(undefined);

export const useSeatingChart = () => {
  const context = useContext(SeatingChartContext);
  if (!context) {
    throw new Error('useSeatingChart must be used within a SeatingChartProvider');
  }
  return context;
};

interface SeatingChartProviderProps {
  children: ReactNode;
}

export const SeatingChartProvider: React.FC<SeatingChartProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('planning');
  const [seatingChart, setSeatingChart] = useState<SeatingChart | null>(null);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const saveToLocalStorage = () => {
    if (seatingChart) {
      localStorage.setItem('weddingSeatingChart', JSON.stringify(seatingChart));
    }
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('weddingSeatingChart');
    if (saved) {
      setSeatingChart(JSON.parse(saved));
    }
  };

  const clearChart = () => {
    setSeatingChart(null);
    localStorage.removeItem('weddingSeatingChart');
  };

  const addTable = (table: Table) => {
    if (!seatingChart) return;
    
    setSeatingChart({
      ...seatingChart,
      tables: [...seatingChart.tables, table],
      updatedAt: new Date().toISOString(),
    });
  };

  const removeTable = (tableId: string) => {
    if (!seatingChart) return;
    
    const table = seatingChart.tables.find(t => t.id === tableId);
    if (!table) return;

    setSeatingChart({
      ...seatingChart,
      tables: seatingChart.tables.filter(t => t.id !== tableId),
      unassignedGuests: [...seatingChart.unassignedGuests, ...table.guests],
      updatedAt: new Date().toISOString(),
    });
  };

  const updateTable = (tableId: string, updates: Partial<Table>) => {
    if (!seatingChart) return;
    
    setSeatingChart({
      ...seatingChart,
      tables: seatingChart.tables.map(table =>
        table.id === tableId ? { ...table, ...updates } : table
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const moveGuest = (guestId: string, targetTableId: string | null) => {
    if (!seatingChart) return;

    let guest: Guest | undefined;
    let updatedTables = [...seatingChart.tables];
    let updatedUnassigned = [...seatingChart.unassignedGuests];

    // Find and remove guest from current location
    const sourceTable = updatedTables.find(t => t.guests.some(g => g.id === guestId));
    if (sourceTable) {
      guest = sourceTable.guests.find(g => g.id === guestId);
      sourceTable.guests = sourceTable.guests.filter(g => g.id !== guestId);
    } else {
      guest = updatedUnassigned.find(g => g.id === guestId);
      updatedUnassigned = updatedUnassigned.filter(g => g.id !== guestId);
    }

    if (!guest) return;

    // Add guest to new location
    if (targetTableId) {
      const targetTable = updatedTables.find(t => t.id === targetTableId);
      if (targetTable && targetTable.guests.length < targetTable.seats) {
        targetTable.guests.push({ ...guest, table: targetTable.name });
      } else {
        // If table is full or not found, add to unassigned
        updatedUnassigned.push({ ...guest, table: undefined });
      }
    } else {
      updatedUnassigned.push({ ...guest, table: undefined });
    }

    setSeatingChart({
      ...seatingChart,
      tables: updatedTables,
      unassignedGuests: updatedUnassigned,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateGuest = (guestId: string, updates: Partial<Guest>) => {
    if (!seatingChart) return;

    setSeatingChart({
      ...seatingChart,
      tables: seatingChart.tables.map(table => ({
        ...table,
        guests: table.guests.map(guest =>
          guest.id === guestId ? { ...guest, ...updates } : guest
        ),
      })),
      unassignedGuests: seatingChart.unassignedGuests.map(guest =>
        guest.id === guestId ? { ...guest, ...updates } : guest
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (seatingChart) {
      saveToLocalStorage();
    }
  }, [seatingChart]);

  return (
    <SeatingChartContext.Provider
      value={{
        mode,
        setMode,
        seatingChart,
        setSeatingChart,
        addTable,
        removeTable,
        updateTable,
        moveGuest,
        updateGuest,
        saveToLocalStorage,
        loadFromLocalStorage,
        clearChart,
      }}
    >
      {children}
    </SeatingChartContext.Provider>
  );
};