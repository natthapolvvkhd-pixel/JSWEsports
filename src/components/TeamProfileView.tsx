import { Shield, User, Award, Mail, Phone, ExternalLink, Calendar, MessageSquare, X } from 'lucide-react';
import { Team, Match } from '../types';

interface TeamProfileViewProps {
  team: Team;
  matches: Match[];
  onClose: () => void;
  allTeams: Team[];
}

export default function TeamProfileView({
  team,
  matches,
  onClose,
  allTeams
}: TeamProfileViewProps) {
  // Find matches of this team
  const teamMatches = matches.filter(m => m.teamAId === team.id || m.teamBId === team.id);

  const getTeamName = (id: string | null) => {
    if (!id) return 'TBD';
    const found = allTeams.find(t => t.id === id);
    return found ? found.name : 'Unknown';
  };

  const getTeamLogo = (id: string | null) => {
    if (!id) return '❓';
    const found = allTeams.find(t => t.id === id);
    return found ? found.logo : '❓';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#161b22] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header decoration */}
        <div className={`h-2 w-full ${team.game === 'ROV' ? 'bg-[#00dbe7]' : 'bg-[#ff571a]'}`} />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/30 p-1.5 rounded-full hover:bg-black/60 transition-all z-10"
        >
          <X size={18} />
        </button>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Identity Header */}
          <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-white/5 pb-6">
            <div className={`w-16 h-16 rounded-2xl bg-black/50 border-2 flex items-center justify-center text-3xl overflow-hidden ${
              team.game === 'ROV' ? 'border-[#00dbe7]' : 'border-[#ff571a]'
            }`}>
              {team.logo.length < 5 ? team.logo : <img src={team.logo} className="w-full h-full object-cover" />}
            </div>
            
            <div className="text-center sm:text-left space-y-1">
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest ${
                team.game === 'ROV' ? 'bg-[#00dbe7]/10 text-[#00dbe7]' : 'bg-[#ff571a]/10 text-[#ff571a]'
              }`}>
                {team.game} TOURNAMENT
              </span>
              <h2 className="font-sans font-black text-2xl text-white">{team.name}</h2>
              <p className="text-xs text-gray-400 font-mono">Captain: {team.captainName} • UID: {team.gameUid}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
              <p className="text-[10px] font-mono text-gray-400 uppercase">Matches</p>
              <p className="text-xl font-bold font-mono text-white mt-1">{team.stats.played}</p>
            </div>
            {team.game === 'ROV' ? (
              <>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-mono text-gray-400 uppercase">Wins</p>
                  <p className="text-xl font-bold font-mono text-emerald-400 mt-1">{team.stats.wins}</p>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-mono text-gray-400 uppercase">Losses</p>
                  <p className="text-xl font-bold font-mono text-red-400 mt-1">{team.stats.losses}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-mono text-gray-400 uppercase">Kills</p>
                  <p className="text-xl font-bold font-mono text-[#ff571a] mt-1">{team.stats.kills}</p>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-mono text-gray-400 uppercase">Total Score</p>
                  <p className="text-xl font-bold font-mono text-[#ff571a] mt-1">{team.stats.totalPoints}</p>
                </div>
              </>
            )}
          </div>

          {/* Player Roster */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1.5">
              Player Roster (รายชื่อนักกีฬา)
            </h3>
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs text-white">
              <div className="bg-white/5 px-3 py-2.5 rounded-lg flex items-center gap-2">
                <span className="text-gray-500 font-bold">P1</span>
                <span>{team.roster.player1} <span className="text-[9px] bg-white/10 px-1 py-0.5 rounded text-gray-400">Main</span></span>
              </div>
              <div className="bg-white/5 px-3 py-2.5 rounded-lg flex items-center gap-2">
                <span className="text-gray-500 font-bold">P2</span>
                <span>{team.roster.player2} <span className="text-[9px] bg-white/10 px-1 py-0.5 rounded text-gray-400">Main</span></span>
              </div>
              <div className="bg-white/5 px-3 py-2.5 rounded-lg flex items-center gap-2">
                <span className="text-gray-500 font-bold">P3</span>
                <span>{team.roster.player3} <span className="text-[9px] bg-white/10 px-1 py-0.5 rounded text-gray-400">Main</span></span>
              </div>
              <div className="bg-white/5 px-3 py-2.5 rounded-lg flex items-center gap-2">
                <span className="text-gray-500 font-bold">P4</span>
                <span>{team.roster.player4} <span className="text-[9px] bg-white/10 px-1 py-0.5 rounded text-gray-400">Main</span></span>
              </div>
              <div className="bg-white/5 px-3 py-2.5 rounded-lg flex items-center gap-2">
                <span className="text-gray-500 font-bold">P5</span>
                <span>{team.roster.player5} <span className="text-[9px] bg-white/10 px-1 py-0.5 rounded text-gray-400">Main</span></span>
              </div>
              <div className="bg-white/5 px-3 py-2.5 rounded-lg flex items-center gap-2">
                <span className="text-[#00dbe7] font-bold">SUB</span>
                <span>{team.roster.substitute || 'ไม่มีผู้เล่นสำรอง'}</span>
              </div>
            </div>
          </div>

          {/* Social Contact Contacts */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1.5">
              Contact Channels (ช่องทางการติดต่อ)
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {team.contact.discord && (
                <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <MessageSquare size={14} />
                  Discord: {team.contact.discord}
                </span>
              )}
              {team.contact.facebook && (
                <span className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ExternalLink size={14} />
                  Facebook: {team.contact.facebook}
                </span>
              )}
              {team.contact.line && (
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <User size={14} />
                  LINE ID: {team.contact.line}
                </span>
              )}
              {!team.contact.discord && !team.contact.facebook && !team.contact.line && (
                <span className="text-gray-500 font-mono italic">ไม่ได้ลงทะเบียนข้อมูลการติดต่อไว้</span>
              )}
            </div>
          </div>

          {/* Recent Match Logs */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1.5">
              Match History (ประวัติแมตช์ล่าสุด)
            </h3>
            <div className="space-y-2">
              {teamMatches.map((m) => {
                const isTeamA = m.teamAId === team.id;
                const opponentId = isTeamA ? m.teamBId : m.teamAId;
                const teamScore = isTeamA ? m.scoreA : m.scoreB;
                const oppScore = isTeamA ? m.scoreB : m.scoreA;
                const isWinner = m.winnerId === team.id;
                
                return (
                  <div key={m.id} className="bg-black/20 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{m.roundName}</span>
                      <span className="text-gray-400">vs</span>
                      <span>{getTeamLogo(opponentId)}</span>
                      <span className="font-bold text-white">{getTeamName(opponentId)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-sans font-black">
                        {m.status === 'FINISHED' ? `${teamScore} - ${oppScore}` : 'PENDING'}
                      </span>
                      {m.status === 'FINISHED' && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isWinner ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          {isWinner ? 'WIN' : 'LOSS'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {teamMatches.length === 0 && (
                <p className="text-xs text-gray-500 font-mono italic text-center py-4">
                  ไม่มีประวัติการแข่งที่บันทึกไว้ในระบบ
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export { TeamProfileView };
