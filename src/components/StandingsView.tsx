import { useState } from 'react';
import { Award, Zap, Shield, Search, Eye, Info } from 'lucide-react';
import { Team, GameType } from '../types';

interface StandingsViewProps {
  teams: Team[];
  gameFilter: GameType;
  setGameFilter: (game: GameType) => void;
  onSelectTeam: (team: Team) => void;
}

export default function StandingsView({
  teams,
  gameFilter,
  setGameFilter,
  onSelectTeam
}: StandingsViewProps) {
  const [search, setSearch] = useState('');

  // Auto-sort algorithm depending on game type
  const sortedTeams = [...teams]
    .filter(t => t.game === gameFilter && t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (gameFilter === 'ROV') {
        // Sort ROV by wins, then by winrate
        if (b.stats.wins !== a.stats.wins) {
          return b.stats.wins - a.stats.wins;
        }
        return b.stats.totalPoints - a.stats.totalPoints; // tie breaker score
      } else {
        // Sort Free Fire by totalPoints, then by kills
        if (b.stats.totalPoints !== a.stats.totalPoints) {
          return b.stats.totalPoints - a.stats.totalPoints;
        }
        return b.stats.kills - a.stats.kills;
      }
    });

  const getWinRate = (wins: number, played: number) => {
    if (played === 0) return '0%';
    return `${Math.round((wins / played) * 100)}%`;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-sans font-black text-3xl md:text-4xl text-white tracking-tight uppercase">
            ตารางคะแนนและสถิติ (Standings)
          </h1>
          <p className="font-mono text-xs text-[#00dbe7] uppercase tracking-widest mt-1">
            Real-time automatic leaderboard
          </p>
        </div>

        {/* Game Switcher */}
        <div className="flex bg-[#1d2026] p-1 rounded-full border border-white/5">
          <button
            onClick={() => setGameFilter('ROV')}
            className={`px-5 py-1.5 rounded-full font-mono text-xs font-bold transition-all ${
              gameFilter === 'ROV'
                ? 'bg-[#00dbe7] text-black shadow-[0_0_10px_rgba(0,219,231,0.4)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ROV Leaderboard
          </button>
          <button
            onClick={() => setGameFilter('Free Fire')}
            className={`px-5 py-1.5 rounded-full font-mono text-xs font-bold transition-all ${
              gameFilter === 'Free Fire'
                ? 'bg-[#ff571a] text-white shadow-[0_0_10px_rgba(255,87,26,0.4)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Free Fire Leaderboard
          </button>
        </div>
      </div>

      {/* Free Fire Scoring Formula Explanation Box */}
      {gameFilter === 'Free Fire' && (
        <div className="bg-[#161b22] border border-white/10 p-4 rounded-xl flex gap-3 text-xs text-gray-300">
          <Info className="text-[#ff571a] shrink-0" size={18} />
          <div className="space-y-1.5">
            <h4 className="font-bold text-white font-mono uppercase">กติกาการคำนวณคะแนนรวม Free Fire</h4>
            <p className="leading-relaxed text-gray-400">
              คะแนนรวมจะคำนวณจาก <span className="text-[#ff571a] font-bold">คะแนนอันดับ (Placement Points) + คะแนนคิล (1 Kill = 1 คะแนน)</span> โดยอันดับแต่ละรอบมีคะแนนดังนี้:
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-[10px] font-mono text-[#ff571a] font-bold">
              <div>อันดับ 1: 12 คะแนน</div>
              <div>อันดับ 2: 9 คะแนน</div>
              <div>อันดับ 3: 8 คะแนน</div>
              <div>อันดับ 4: 7 คะแนน</div>
              <div>อันดับ 5: 6 คะแนน</div>
              <div>อันดับ 6: 5 คะแนน</div>
              <div>อันดับ 7: 4 คะแนน</div>
              <div>อันดับ 8: 3 คะแนน</div>
              <div>อันดับ 9: 2 คะแนน</div>
              <div>อันดับ 10: 1 คะแนน</div>
              <div className="col-span-2">อันดับ 11-12: 0 คะแนน</div>
            </div>
          </div>
        </div>
      )}

      {/* Search Filter and Stats Header */}
      <div className="flex items-center gap-3 bg-[#161b22] border border-white/10 px-4 py-2 rounded-xl">
        <Search className="text-gray-400 shrink-0" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อทีมที่นี่..."
          className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500 font-sans"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#161b22]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {gameFilter === 'ROV' ? (
            /* ROV TABLE */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/30 border-b border-white/15">
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase">Rank</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase">Team Name</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-center">Played</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-center">Wins</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-center">Losses</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-center">Win Rate</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-center">Points</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-right">View Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedTeams.map((team, idx) => (
                  <tr key={team.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-[#00dbe7]">
                      {idx + 1 === 1 ? '🏆 01' : (idx + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black/40 rounded-lg border border-[#00dbe7]/30 flex items-center justify-center font-bold text-lg text-white">
                          {team.logo.length < 5 ? team.logo : <img src={team.logo} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-[#00dbe7] transition-colors">{team.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">CAPTAIN: {team.captainName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-gray-300">
                      {team.stats.played}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-emerald-400">
                      {team.stats.wins}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-red-400">
                      {team.stats.losses}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-white">
                      {getWinRate(team.stats.wins, team.stats.played)}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-[#00dbe7] text-sm">
                      {team.stats.wins * 3}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectTeam(team)}
                        className="p-1.5 bg-white/5 border border-white/5 rounded-lg text-[#00dbe7] hover:bg-[#00dbe7]/10 transition-colors"
                        title="ดูรายละเอียดทีม"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {sortedTeams.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500 font-mono text-sm italic">
                      ไม่พบข้อมูลทีมสำหรับค้นหาของคุณ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* FREE FIRE TABLE */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/30 border-b border-white/15">
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase">Rank</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase">Team Name</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-center">Played</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-center">Placement Points</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-center">Total Kills</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-right">Total Score</th>
                  <th className="px-6 py-4 font-mono text-xs text-gray-400 uppercase text-right">View Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedTeams.map((team, idx) => (
                  <tr key={team.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-[#ff571a]">
                      {idx + 1 === 1 ? '🏆 01' : (idx + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black/40 rounded-lg border border-[#ff571a]/30 flex items-center justify-center font-bold text-lg text-white">
                          {team.logo.length < 5 ? team.logo : <img src={team.logo} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-[#ff571a] transition-colors">{team.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">UID: {team.gameUid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-gray-300">
                      {team.stats.played}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-[#ff571a] font-bold">
                      {team.stats.placementPoints}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-gray-300">
                      {team.stats.kills}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[#ff571a] text-lg">
                      {team.stats.totalPoints}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectTeam(team)}
                        className="p-1.5 bg-white/5 border border-white/5 rounded-lg text-[#ff571a] hover:bg-[#ff571a]/10 transition-colors"
                        title="ดูรายละเอียดทีม"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {sortedTeams.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500 font-mono text-sm italic">
                      ไม่พบข้อมูลทีมสำหรับค้นหาของคุณ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
export { StandingsView };
