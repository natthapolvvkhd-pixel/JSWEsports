import { useState } from 'react';
import { Shuffle, Calendar, HelpCircle, Trophy, Users, ShieldAlert } from 'lucide-react';
import { Team, Match, BracketType, GameType } from '../types';

interface BracketsViewProps {
  teams: Team[];
  matches: Match[];
  onGenerateBrackets: (type: BracketType, game: GameType) => void;
  gameFilter: GameType;
  setGameFilter: (game: GameType) => void;
  bracketType: BracketType;
  setBracketType: (type: BracketType) => void;
}

export default function BracketsView({
  teams,
  matches,
  onGenerateBrackets,
  gameFilter,
  setGameFilter,
  bracketType,
  setBracketType
}: BracketsViewProps) {
  const filteredMatches = matches.filter(m => {
    // Find if the match's teams belong to the selected game filter
    const sampleTeamId = m.teamAId || m.teamBId;
    if (!sampleTeamId) return true; // Keep placeholder matches
    
    // Find match metadata by checking team game
    const matchTeam = teams.find(t => t.id === sampleTeamId);
    return matchTeam ? matchTeam.game === gameFilter : true;
  });

  const getTeamName = (id: string | null) => {
    if (!id) return 'TBD';
    const found = teams.find(t => t.id === id);
    return found ? found.name : 'Unknown';
  };

  const getTeamLogo = (id: string | null) => {
    if (!id) return '❓';
    const found = teams.find(t => t.id === id);
    return found ? found.logo : '❓';
  };

  // Helper to split matches by round name
  const qfMatches = filteredMatches.filter(m => m.roundId === 'QF');
  const sfMatches = filteredMatches.filter(m => m.roundId === 'SF');
  const gfMatches = filteredMatches.filter(m => m.roundId === 'GF');
  
  // Lower bracket matches
  const lbMatches = filteredMatches.filter(m => !m.isUpperBracket);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-sans font-black text-3xl md:text-4xl text-white uppercase tracking-tight">
            ผังสายการแข่งขัน (Brackets)
          </h1>
          <p className="font-mono text-xs text-[#00dbe7] uppercase tracking-widest mt-1">
            {bracketType} • {gameFilter}
          </p>
        </div>

        {/* Game Switcher & Bracket Switcher */}
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-[#1d2026] p-1 rounded-full border border-white/5">
            <button
              onClick={() => setGameFilter('ROV')}
              className={`px-5 py-1.5 rounded-full font-mono text-xs font-bold transition-all ${
                gameFilter === 'ROV'
                  ? 'bg-[#00dbe7] text-black shadow-[0_0_10px_rgba(0,219,231,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ROV
            </button>
            <button
              onClick={() => setGameFilter('Free Fire')}
              className={`px-5 py-1.5 rounded-full font-mono text-xs font-bold transition-all ${
                gameFilter === 'Free Fire'
                  ? 'bg-[#ff571a] text-white shadow-[0_0_10px_rgba(255,87,26,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              FREE FIRE
            </button>
          </div>

          <select
            value={bracketType}
            onChange={(e) => setBracketType(e.target.value as BracketType)}
            className="bg-[#161b22] border border-white/10 rounded-xl text-xs font-mono px-4 py-1.5 text-white focus:outline-none focus:border-[#00dbe7]"
          >
            <option value="Single Elimination">Single Elimination</option>
            <option value="Double Elimination">Double Elimination</option>
            <option value="Round Robin">Round Robin</option>
          </select>
        </div>
      </div>

      {/* Randomized Bracket generator banner */}
      <div className="bg-[#161b22]/90 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00dbe7]/10 rounded-xl text-[#00dbe7]">
            <Shuffle size={24} className="animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">จัดสายและสุ่มทีมการแข่งขันอัตโนมัติ</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              ดึงข้อมูลทีมที่ลงทะเบียนเกม <span className="font-bold text-white">{gameFilter}</span> จำนวน {teams.filter(t => t.game === gameFilter).length} ทีมมาจับคู่ทันทีด้วยคลิกเดียว!
            </p>
          </div>
        </div>
        <button
          onClick={() => onGenerateBrackets(bracketType, gameFilter)}
          className="bg-gradient-to-r from-[#00dbe7] to-[#00696f] text-black font-sans font-black text-xs px-5 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shadow-[#00dbe7]/25"
        >
          🎲 สุ่มแบ่งสาย Bracket ทันที
        </button>
      </div>

      {/* Bracket Tree rendering */}
      {bracketType === 'Round Robin' ? (
        /* Round Robin League Grid Layout */
        <div className="bg-[#161b22]/95 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-white/5 pb-2">
            <h3 className="font-bold text-white text-base">Round Robin Match Matrix</h3>
            <p className="text-xs text-gray-400">พบกันหมดในกลุ่มการแข่งขัน ทุกนัดจะเก็บคะแนนเพื่อจัดตารางลีค</p>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm font-mono italic">
              ไม่มีข้อมูลแมตช์พบกันหมด กรุณากดสุ่มแบ่งสายด้านบน
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-black/30 border-b border-white/5">
                    <th className="p-3 text-gray-400">ID</th>
                    <th className="p-3 text-gray-400 text-right">Team A</th>
                    <th className="p-3 text-center text-gray-400">VS / SCORE</th>
                    <th className="p-3 text-gray-400">Team B</th>
                    <th className="p-3 text-center text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMatches.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-white/5">
                      <td className="p-3 text-gray-500">M-{idx + 1}</td>
                      <td className="p-3 text-right">
                        <span className="font-bold text-white mr-2">{getTeamName(m.teamAId)}</span>
                        <span className="text-lg">{getTeamLogo(m.teamAId)}</span>
                      </td>
                      <td className="p-3 text-center font-bold font-sans text-sm">
                        {m.status === 'FINISHED' ? (
                          <span className="text-[#00dbe7]">{m.scoreA} - {m.scoreB}</span>
                        ) : (
                          <span className="text-gray-500">VS</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-lg mr-2">{getTeamLogo(m.teamBId)}</span>
                        <span className="font-bold text-white">{getTeamName(m.teamBId)}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                          m.status === 'FINISHED' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : m.status === 'LIVE' 
                              ? 'bg-red-500/10 text-red-400 animate-pulse'
                              : 'bg-white/5 text-gray-500'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Elimination Bracket View (Single/Double) */
        <div className="space-y-12">
          {/* Upper Bracket Section */}
          <div className="bg-[#161b22]/40 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-x-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-5 bg-[#00dbe7] shadow-[0_0_8px_#00dbe7]" />
              <h2 className="font-sans font-bold text-lg text-white uppercase tracking-wider">
                {bracketType === 'Double Elimination' ? 'Upper Bracket' : 'Main Bracket Tree'}
              </h2>
            </div>

            {filteredMatches.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm font-mono italic">
                ยังไม่ได้จับสายแบ่งสายแข่งขัน กรุณากดสุ่มแบ่งสายด้านบน
              </div>
            ) : (
              <div className="flex gap-10 md:gap-16 min-w-[900px] justify-between relative pb-4">
                
                {/* Quarter Finals */}
                <div className="flex flex-col justify-around gap-6 w-64">
                  <div className="text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                    Quarter Finals (R1)
                  </div>
                  {qfMatches.map((m) => (
                    <div 
                      key={m.id} 
                      className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden relative group shadow-md"
                    >
                      <div className="flex flex-col divide-y divide-white/5 font-mono text-xs">
                        <div className={`p-3 flex justify-between items-center ${m.winnerId === m.teamAId && m.winnerId ? 'bg-[#00dbe7]/5' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span>{getTeamLogo(m.teamAId)}</span>
                            <span className="font-bold text-white max-w-[120px] truncate">{getTeamName(m.teamAId)}</span>
                          </div>
                          <span className={`font-bold font-sans text-sm ${m.winnerId === m.teamAId && m.winnerId ? 'text-[#00dbe7]' : 'text-gray-500'}`}>
                            {m.scoreA !== null ? m.scoreA : '-'}
                          </span>
                        </div>
                        <div className={`p-3 flex justify-between items-center ${m.winnerId === m.teamBId && m.winnerId ? 'bg-[#00dbe7]/5' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span>{getTeamLogo(m.teamBId)}</span>
                            <span className="font-bold text-white max-w-[120px] truncate">{getTeamName(m.teamBId)}</span>
                          </div>
                          <span className={`font-bold font-sans text-sm ${m.winnerId === m.teamBId && m.winnerId ? 'text-[#00dbe7]' : 'text-gray-500'}`}>
                            {m.scoreB !== null ? m.scoreB : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Semi Finals */}
                <div className="flex flex-col justify-around gap-6 w-64">
                  <div className="text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                    Semi Finals (R2)
                  </div>
                  {sfMatches.map((m) => (
                    <div 
                      key={m.id} 
                      className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden relative group shadow-md"
                    >
                      <div className="flex flex-col divide-y divide-white/5 font-mono text-xs">
                        <div className={`p-3 flex justify-between items-center ${m.winnerId === m.teamAId && m.winnerId ? 'bg-[#00dbe7]/5' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span>{getTeamLogo(m.teamAId)}</span>
                            <span className="font-bold text-white max-w-[120px] truncate">{getTeamName(m.teamAId)}</span>
                          </div>
                          <span className={`font-bold font-sans text-sm ${m.winnerId === m.teamAId && m.winnerId ? 'text-[#00dbe7]' : 'text-gray-500'}`}>
                            {m.scoreA !== null ? m.scoreA : '-'}
                          </span>
                        </div>
                        <div className={`p-3 flex justify-between items-center ${m.winnerId === m.teamBId && m.winnerId ? 'bg-[#00dbe7]/5' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span>{getTeamLogo(m.teamBId)}</span>
                            <span className="font-bold text-white max-w-[120px] truncate">{getTeamName(m.teamBId)}</span>
                          </div>
                          <span className={`font-bold font-sans text-sm ${m.winnerId === m.teamBId && m.winnerId ? 'text-[#00dbe7]' : 'text-gray-500'}`}>
                            {m.scoreB !== null ? m.scoreB : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grand Finals */}
                <div className="flex flex-col justify-center gap-6 w-64">
                  <div className="text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                    Grand Finals
                  </div>
                  {gfMatches.map((m) => (
                    <div 
                      key={m.id} 
                      className="bg-[#161b22] border-2 border-[#00dbe7]/40 rounded-xl overflow-hidden relative group shadow-lg shadow-[#00dbe7]/10"
                    >
                      <div className="scanner-line h-[1px] bg-[#00dbe7] absolute top-0 left-0 w-full opacity-30" />
                      <div className="flex flex-col divide-y divide-white/5 font-mono text-xs">
                        <div className="p-3 bg-black/40 text-[10px] text-[#00dbe7] font-bold uppercase tracking-widest">
                          🏆 CHAMPIONSHIP MATCH
                        </div>
                        <div className={`p-4 flex justify-between items-center ${m.winnerId === m.teamAId && m.winnerId ? 'bg-[#00dbe7]/10' : ''}`}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{getTeamLogo(m.teamAId)}</span>
                            <span className="font-bold text-white max-w-[120px] truncate">{getTeamName(m.teamAId)}</span>
                          </div>
                          <span className={`font-bold font-sans text-lg ${m.winnerId === m.teamAId && m.winnerId ? 'text-[#00dbe7]' : 'text-gray-500'}`}>
                            {m.scoreA !== null ? m.scoreA : '-'}
                          </span>
                        </div>
                        <div className={`p-4 flex justify-between items-center ${m.winnerId === m.teamBId && m.winnerId ? 'bg-[#00dbe7]/10' : ''}`}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{getTeamLogo(m.teamBId)}</span>
                            <span className="font-bold text-white max-w-[120px] truncate">{getTeamName(m.teamBId)}</span>
                          </div>
                          <span className={`font-bold font-sans text-lg ${m.winnerId === m.teamBId && m.winnerId ? 'text-[#00dbe7]' : 'text-gray-500'}`}>
                            {m.scoreB !== null ? m.scoreB : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

          {/* Lower Bracket Section (Double Elimination ONLY) */}
          {bracketType === 'Double Elimination' && lbMatches.length > 0 && (
            <div className="bg-[#161b22]/40 border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-x-auto">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-5 bg-[#ff571a] shadow-[0_0_8px_#ff571a]" />
                <h2 className="font-sans font-bold text-lg text-white uppercase tracking-wider">
                  Lower Bracket (Losers Stage)
                </h2>
              </div>

              <div className="flex gap-10 md:gap-16 min-w-[700px] pb-4">
                {/* Losers Round 1 */}
                <div className="flex flex-col justify-around gap-6 w-64">
                  <div className="text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                    Losers Semis
                  </div>
                  {lbMatches.slice(0, Math.ceil(lbMatches.length / 2)).map((m) => (
                    <div 
                      key={m.id} 
                      className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden relative shadow-md"
                    >
                      <div className="flex flex-col divide-y divide-white/5 font-mono text-xs">
                        <div className={`p-3 flex justify-between items-center ${m.winnerId === m.teamAId && m.winnerId ? 'bg-[#ff571a]/5' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span>{getTeamLogo(m.teamAId)}</span>
                            <span className="font-bold text-white max-w-[120px] truncate">{getTeamName(m.teamAId)}</span>
                          </div>
                          <span className={`font-bold font-sans text-sm ${m.winnerId === m.teamAId && m.winnerId ? 'text-[#ff571a]' : 'text-gray-500'}`}>
                            {m.scoreA !== null ? m.scoreA : '-'}
                          </span>
                        </div>
                        <div className={`p-3 flex justify-between items-center ${m.winnerId === m.teamBId && m.winnerId ? 'bg-[#ff571a]/5' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span>{getTeamLogo(m.teamBId)}</span>
                            <span className="font-bold text-white max-w-[120px] truncate">{getTeamName(m.teamBId)}</span>
                          </div>
                          <span className={`font-bold font-sans text-sm ${m.winnerId === m.teamBId && m.winnerId ? 'text-[#ff571a]' : 'text-gray-500'}`}>
                            {m.scoreB !== null ? m.scoreB : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Losers Finals */}
                <div className="flex flex-col justify-center gap-6 w-64">
                  <div className="text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                    Losers Finals
                  </div>
                  {lbMatches.slice(Math.ceil(lbMatches.length / 2)).map((m) => (
                    <div 
                      key={m.id} 
                      className="bg-[#161b22] border border-white/15 rounded-xl overflow-hidden relative shadow-md"
                    >
                      <div className="flex flex-col divide-y divide-white/5 font-mono text-xs">
                        <div className={`p-3 flex justify-between items-center ${m.winnerId === m.teamAId && m.winnerId ? 'bg-[#ff571a]/5' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span>{getTeamLogo(m.teamAId)}</span>
                            <span className="font-bold text-white max-w-[120px] truncate">{getTeamName(m.teamAId)}</span>
                          </div>
                          <span className={`font-bold font-sans text-sm ${m.winnerId === m.teamAId && m.winnerId ? 'text-[#ff571a]' : 'text-gray-500'}`}>
                            {m.scoreA !== null ? m.scoreA : '-'}
                          </span>
                        </div>
                        <div className={`p-3 flex justify-between items-center ${m.winnerId === m.teamBId && m.winnerId ? 'bg-[#ff571a]/5' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span>{getTeamLogo(m.teamBId)}</span>
                            <span className="font-bold text-white max-w-[120px] truncate">{getTeamName(m.teamBId)}</span>
                          </div>
                          <span className={`font-bold font-sans text-sm ${m.winnerId === m.teamBId && m.winnerId ? 'text-[#ff571a]' : 'text-gray-500'}`}>
                            {m.scoreB !== null ? m.scoreB : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export { BracketsView };
