import React, { useState, useEffect, useCallback } from 'react';
import { User, VoteRecord, VoteOption } from './types';
import { VotingCard } from './components/VotingCard';
import { ResultsView } from './components/ResultsView';
import { TimeControls } from './components/TimeControls';

// Fallback user for browser testing outside Telegram
const FALLBACK_USER: User = {
  id: 'test_user_1',
  name: 'Test User',
};

// Mock initial votes for demo purposes
const MOCK_INITIAL_VOTES: VoteRecord[] = [
  { userId: 'u2', userName: 'Sarah', option: VoteOption.YES, timestamp: Date.now(), changesMade: 0 },
  { userId: 'u3', userName: 'Mike', option: VoteOption.NO, timestamp: Date.now(), changesMade: 0 },
  { userId: 'u4', userName: 'Emily', option: VoteOption.YES, timestamp: Date.now(), changesMade: 0 },
];

const App: React.FC = () => {
  // State for simulated time (for demo purposes)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // App State
  const [currentUser, setCurrentUser] = useState<User>(FALLBACK_USER);
  const [votes, setVotes] = useState<VoteRecord[]>(MOCK_INITIAL_VOTES);
  const [isTelegram, setIsTelegram] = useState(false);
  
  // Initialize Telegram Web App
  useEffect(() => {
    // Check if running inside Telegram
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      // Notify Telegram we are ready
      webApp.ready();
      
      // Expand to full height
      webApp.expand();
      
      setIsTelegram(true);

      // Get the user data from Telegram
      const tgUser = webApp.initDataUnsafe?.user;
      if (tgUser) {
        setCurrentUser({
          id: tgUser.id.toString(),
          name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' '),
        });
      }
    }
  }, []);

  // Derived state
  const currentUserVote = votes.find(v => v.userId === currentUser.id);
  
  // Check time constraints (08:30 - 10:30)
  const isTimeInRange = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // 08:30 = 8 * 60 + 30 = 510
    // 10:30 = 10 * 60 + 30 = 630
    return totalMinutes >= 510 && totalMinutes <= 630;
  };

  const isPollOpen = isTimeInRange(currentTime);

  const handleVote = (option: VoteOption) => {
    if (!isPollOpen) return;

    setVotes(prev => {
      const existingIndex = prev.findIndex(v => v.userId === currentUser.id);
      
      if (existingIndex >= 0) {
        // Changing vote
        const existingVote = prev[existingIndex];
        if (existingVote.changesMade >= 1) return prev; // Limit reached (double check)

        const updatedVote = {
          ...existingVote,
          option,
          timestamp: currentTime.getTime(),
          changesMade: existingVote.changesMade + 1
        };
        
        const newVotes = [...prev];
        newVotes[existingIndex] = updatedVote;
        return newVotes;
      } else {
        // New vote
        const newVote: VoteRecord = {
          userId: currentUser.id,
          userName: currentUser.name,
          option,
          timestamp: currentTime.getTime(),
          changesMade: 0
        };
        return [...prev, newVote];
      }
    });
  };

  // Timer simulation effect
  useEffect(() => {
    // In production, this would just check real time every minute
    const interval = setInterval(() => {
      // Logic to auto-update time if needed
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  // Sync real time if user wants to reset
  const resetToRealTime = useCallback(() => {
    setCurrentTime(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-tg-secondaryBg pb-20 text-tg-text font-sans">
      {/* Header */}
      <header className="bg-tg-bg shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-bold text-lg text-tg-text">LunchPoll</h1>
          <div className="flex items-center gap-2">
            {!isTelegram && <span className="text-xs text-tg-hint mr-1 hidden sm:inline">Debug User:</span>}
            <div className="h-8 px-3 rounded-full bg-tg-button flex items-center justify-center text-tg-buttonText font-bold text-sm shadow-sm">
              {currentUser.name}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        
        {/* Debug Controls (Only visible if NOT in Telegram or if explicitly enabled for demo) */}
        {!isTelegram && (
          <TimeControls 
            simulatedTime={currentTime} 
            setSimulatedTime={setCurrentTime}
            resetTime={resetToRealTime}
          />
        )}

        {/* Voting Card */}
        <VotingCard
          currentUser={currentUser}
          currentVote={currentUserVote}
          isOpen={isPollOpen}
          onVote={handleVote}
          currentTimeStr={currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        />

        {/* Live Results */}
        <ResultsView votes={votes} />

      </main>
    </div>
  );
};

export default App;
