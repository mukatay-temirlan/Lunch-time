import React from 'react';
import { User, VoteRecord, VoteOption } from '../types';
import { Utensils, XCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface VotingCardProps {
  currentUser: User;
  currentVote?: VoteRecord;
  isOpen: boolean;
  onVote: (option: VoteOption) => void;
  currentTimeStr: string;
}

export const VotingCard: React.FC<VotingCardProps> = ({ 
  currentUser, 
  currentVote, 
  isOpen, 
  onVote,
  currentTimeStr
}) => {
  const canChange = currentVote ? currentVote.changesMade < 1 : true;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-blue-500" />
              Team Lunch
            </h2>
            <p className="text-sm text-gray-500">
              {isOpen 
                ? "Poll is open! Will you join us?" 
                : "Voting is currently closed."
              }
            </p>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-semibold ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isOpen ? 'OPEN' : 'CLOSED'}
          </div>
        </div>

        <div className="mb-6 text-xs text-gray-400 flex items-center gap-1">
          <ClockIcon className="w-3 h-3" />
          <span>Current Time: {currentTimeStr}</span>
          <span className="mx-1">•</span>
          <span>Open: 08:30 - 10:30</span>
        </div>

        {isOpen ? (
          <div className="space-y-3">
            {!currentVote && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onVote(VoteOption.YES)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-green-50 bg-green-50/50 hover:bg-green-100 hover:border-green-200 transition-all group"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-green-700">Yes, I'm in!</span>
                </button>
                <button
                  onClick={() => onVote(VoteOption.NO)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-red-50 bg-red-50/50 hover:bg-red-100 hover:border-red-200 transition-all group"
                >
                  <XCircle className="w-8 h-8 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-red-700">No, maybe later</span>
                </button>
              </div>
            )}

            {currentVote && (
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-600 mb-2">You voted:</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg mb-4 ${
                  currentVote.option === VoteOption.YES ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {currentVote.option === VoteOption.YES ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                  {currentVote.option === VoteOption.YES ? 'YES' : 'NO'}
                </div>
                
                {canChange ? (
                  <div>
                     <p className="text-xs text-gray-400 mb-2">You can change your mind once.</p>
                     <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => onVote(currentVote.option === VoteOption.YES ? VoteOption.NO : VoteOption.YES)}
                          className="text-sm px-4 py-2 bg-white border border-gray-300 shadow-sm rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                        >
                          Switch to {currentVote.option === VoteOption.YES ? 'NO' : 'YES'}
                        </button>
                     </div>
                  </div>
                ) : (
                  <p className="text-xs text-red-400 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Decision locked (Limit reached)
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Utensils className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p>Voting is closed for today.</p>
            <p className="text-xs mt-1">Please come back tomorrow at 08:30.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
