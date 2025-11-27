import React, { useMemo, useState } from 'react';
import { VoteRecord, VoteOption } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { generateLunchSummary } from '../services/geminiService';
import { Sparkles, Users, User as UserIcon } from 'lucide-react';

interface ResultsViewProps {
  votes: VoteRecord[];
}

const COLORS = ['#22c55e', '#ef4444']; // Green, Red

export const ResultsView: React.FC<ResultsViewProps> = ({ votes }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const stats = useMemo(() => {
    const yes = votes.filter(v => v.option === VoteOption.YES).length;
    const no = votes.filter(v => v.option === VoteOption.NO).length;
    return [
      { name: 'Having Lunch', value: yes },
      { name: 'Skipping', value: no }
    ];
  }, [votes]);

  const attendees = votes.filter(v => v.option === VoteOption.YES);
  
  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    const result = await generateLunchSummary(votes);
    setSummary(result);
    setLoadingSummary(false);
  };

  if (votes.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm mt-4">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p>No votes yet today.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-500" />
          Live Results
        </h3>

        <div className="h-48 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Attendees List */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Who's going ({attendees.length})</h4>
          <div className="grid grid-cols-2 gap-2">
            {attendees.map(vote => (
              <div key={vote.userId} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                 <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                    {vote.userName.charAt(0)}
                 </div>
                 <span className="text-sm font-medium text-gray-700 truncate">{vote.userName}</span>
              </div>
            ))}
            {attendees.length === 0 && (
                <span className="text-sm text-gray-400 italic">No one yet...</span>
            )}
          </div>
        </div>

        {/* AI Chef Summary */}
        <div className="border-t border-gray-100 pt-4">
            {!summary && !loadingSummary && (
                <button 
                    onClick={handleGenerateSummary}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <Sparkles className="w-4 h-4" />
                    Ask AI Chef for Suggestion
                </button>
            )}
            
            {loadingSummary && (
                <div className="text-center py-4 text-gray-500 animate-pulse flex flex-col items-center">
                    <Sparkles className="w-6 h-6 text-purple-400 mb-2 animate-spin" />
                    <span className="text-sm">Thinking about food...</span>
                </div>
            )}

            {summary && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2 text-purple-700 font-semibold text-sm">
                        <Sparkles className="w-4 h-4" />
                        AI Chef says:
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">
                        "{summary}"
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
