import React from 'react';
import { Clock } from 'lucide-react';

interface TimeControlsProps {
  simulatedTime: Date;
  setSimulatedTime: (date: Date) => void;
  resetTime: () => void;
}

export const TimeControls: React.FC<TimeControlsProps> = ({ simulatedTime, setSimulatedTime, resetTime }) => {
  const handleTimeChange = (hour: number, minute: number) => {
    const newTime = new Date(simulatedTime);
    newTime.setHours(hour, minute, 0, 0);
    setSimulatedTime(newTime);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 font-medium">
        <Clock className="w-4 h-4" />
        <span>Debug: Time Simulation</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => handleTimeChange(8, 0)}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          08:00 (Early)
        </button>
        <button 
          onClick={() => handleTimeChange(9, 0)}
          className="px-3 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded-full transition-colors"
        >
          09:00 (Open)
        </button>
        <button 
          onClick={() => handleTimeChange(10, 25)}
          className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-full transition-colors"
        >
          10:25 (Ending)
        </button>
        <button 
          onClick={() => handleTimeChange(11, 0)}
          className="px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded-full transition-colors"
        >
          11:00 (Closed)
        </button>
        <button 
          onClick={resetTime}
          className="px-3 py-1 text-xs border border-gray-200 hover:bg-gray-50 rounded-full transition-colors ml-auto"
        >
          Reset to Real
        </button>
      </div>
      <div className="mt-2 text-xs text-center text-gray-400">
        Current Simulated Time: {simulatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};
