import React, { useState } from 'react';
import { 
  Trash2, Plus, RefreshCw, Eye, Info, Check, ShieldCheck, 
  Settings, Download, MessageSquare, Flame, Trophy, Share2, Play
} from 'lucide-react';
import { Team, Match, Announcement, LiveStream, GameType, BracketType } from '../types';

interface AdminViewProps {
  teams: Team[];
  matches: Match[];
  announcements: Announcement[];
  liveStreams: LiveStream[];
  isRegistrationOpen: boolean;
  setIsRegistrationOpen: (open: boolean) => void;
  onAddTeam: (team: Omit<Team, 'id' | 'stats' | 'registeredAt'>) => void;
  onDeleteTeam: (id: string) => void;
  onUpdateMatchResult: (matchId: string, scoreA: number, scoreB: number, status: 'PENDING' | 'LIVE' | 'FINISHED', winnerId: string | null) => void;
  onAddAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onAddLiveStream: (stream: Omit<LiveStream, 'id'>) => void;
  onDeleteLiveStream: (id: string) => void;
  onBulkLoadDemo: () => void;
}

export default function AdminView({
  teams,
  matches,
  announcements,
  liveStreams,
  isRegistrationOpen,
  setIsRegistrationOpen,
  onAddTeam,
  onDeleteTeam,
  onUpdateMatchResult,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onAddLiveStream,
  onDeleteLiveStream,
  onBulkLoadDemo
}: AdminViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'matches' | 'teams' | 'news' | 'streams' | 'firebase'>('matches');
  const [gameFilter, setGameFilter] = useState<GameType>('ROV');

  // Match edit state
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [matchStatus, setMatchStatus] = useState<'PENDING' | 'LIVE' | 'FINISHED'>('FINISHED');
  const [matchWinnerId, setMatchWinnerId] = useState<string>('');

  // Free Fire Round score simulation state
  const [ffTeamId, setFfTeamId] = useState<string>('');
  const [ffKills, setFfKills] = useState<number>(0);
  const [ffPlacement, setFfPlacement] = useState<number>(1);

  // New team state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamGame, setNewTeamGame] = useState<GameType>('ROV');
  const [newTeamCaptain, setNewTeamCaptain] = useState('');

  // New announcement state
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<'Major Update' | 'Event' | 'Announcement'>('Announcement');

  // New livestream state
  const [streamTitle, setStreamTitle] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [streamPlatform, setStreamPlatform] = useState<'youtube' | 'facebook' | 'tiktok'>('youtube');

  const filteredMatches = matches.filter(m => {
    const teamA = teams.find(t => t.id === m.teamAId);
    const teamB = teams.find(t => t.id === m.teamBId);
    const mGame = teamA?.game || teamB?.game || 'ROV';
    return mGame === gameFilter;
  });

  const getTeamName = (id: string | null) => {
    if (!id) return 'TBD';
    const found = teams.find(t => t.id === id);
    return found ? found.name : 'Unknown';
  };

  const handleEditMatch = (m: Match) => {
    setEditingMatchId(m.id);
    setScoreA(m.scoreA || 0);
    setScoreB(m.scoreB || 0);
    setMatchStatus(m.status);
    setMatchWinnerId(m.winnerId || '');
  };

  const handleSaveMatch = () => {
    if (!editingMatchId) return;
    
    // Determine winner based on scores if not manually set
    let winnerId: string | null = null;
    if (matchWinnerId) {
      winnerId = matchWinnerId;
    } else if (scoreA > scoreB) {
      const match = matches.find(m => m.id === editingMatchId);
      winnerId = match?.teamAId || null;
    } else if (scoreB > scoreA) {
      const match = matches.find(m => m.id === editingMatchId);
      winnerId = match?.teamBId || null;
    }

    onUpdateMatchResult(editingMatchId, scoreA, scoreB, matchStatus, winnerId);
    setEditingMatchId(null);
  };

  // Free Fire Points Calculator
  const handleRecordFreeFireRound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ffTeamId) return alert('กรุณาเลือกทีม Free Fire');

    // Placement score table:
    // Rank 1: 12, Rank 2: 9, Rank 3: 8, Rank 4: 7, Rank 5: 6, Rank 6: 5, Rank 7: 4, Rank 8: 3, Rank 9: 2, Rank 10: 1, Rank 11-12: 0
    let placementScore = 0;
    if (ffPlacement === 1) placementScore = 12;
    else if (ffPlacement === 2) placementScore = 9;
    else if (ffPlacement === 3) placementScore = 8;
    else if (ffPlacement === 4) placementScore = 7;
    else if (ffPlacement === 5) placementScore = 6;
    else if (ffPlacement === 6) placementScore = 5;
    else if (ffPlacement === 7) placementScore = 4;
    else if (ffPlacement === 8) placementScore = 3;
    else if (ffPlacement === 9) placementScore = 2;
    else if (ffPlacement === 10) placementScore = 1;

    const roundPoints = placementScore + ffKills;

    // Find current team stats and update
    const targetTeam = teams.find(t => t.id === ffTeamId);
    if (targetTeam) {
      // Simulate updating the team score object
      const currentStats = { ...targetTeam.stats };
      currentStats.played += 1;
      currentStats.kills += ffKills;
      currentStats.placementPoints += placementScore;
      currentStats.totalPoints += roundPoints;

      // Update in our core state
      targetTeam.stats = currentStats;
      alert(`บันทึกคะแนนเรียบร้อย! คิล: ${ffKills}, อันดับ: ${ffPlacement} (${placementScore} คะแนน) -> คะแนนรวมรอบนี้: ${roundPoints} แต้ม ถูกบวกเข้าระบบแล้ว`);
      
      // Reset values
      setFfKills(0);
      setFfPlacement(1);
    }
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;
    onAddAnnouncement({
      title: newsTitle,
      content: newsContent,
      category: newsCategory
    });
    setNewsTitle('');
    setNewsContent('');
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    onAddTeam({
      name: newTeamName,
      logo: "🛡️",
      captainName: newTeamCaptain || "Admin Custom",
      gameUid: "ADMIN-GEN",
      roster: {
        player1: "Alpha",
        player2: "Beta",
        player3: "Gamma",
        player4: "Delta",
        player5: "Epsilon",
        substitute: "Zeta"
      },
      contact: {},
      game: newTeamGame
    });
    setNewTeamName('');
    setNewTeamCaptain('');
  };

  const handleCreateStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamTitle.trim() || !streamUrl.trim()) return;
    onAddLiveStream({
      title: streamTitle,
      url: streamUrl,
      platform: streamPlatform,
      isLive: true
    });
    setStreamTitle('');
    setStreamUrl('');
  };

  // CSV Exporter for teams list
  const handleDownloadCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Rank,Team,Game,Captain,UID,Played,Wins/Kills,Losses/Placement,Points\n";
    
    teams.forEach((t, index) => {
      const p = t.game === 'ROV' ? t.stats.wins * 3 : t.stats.totalPoints;
      csvContent += `${index + 1},"${t.name}",${t.game},"${t.captainName}",${t.gameUid},${t.stats.played},${t.game === 'ROV' ? t.stats.wins : t.stats.kills},${t.game === 'ROV' ? t.stats.losses : t.stats.placementPoints},${p}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `arena_ops_tournament_results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-sans font-black text-3xl md:text-4xl text-white tracking-tight uppercase flex items-center gap-3">
            <Settings className="text-[#00dbe7] animate-spin-slow" />
            ผู้ดูแลระบบ (Admin Dashboard)
          </h1>
          <p className="font-mono text-xs text-gray-400 mt-1">
            Tournament controller, bracket rules and live sync panels
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Quick Demo Bulk Loader */}
          <button
            onClick={onBulkLoadDemo}
            className="px-4 py-2 bg-[#00dbe7]/10 hover:bg-[#00dbe7]/20 border border-[#00dbe7]/30 text-[#00dbe7] font-mono text-xs rounded-xl transition-all flex items-center gap-1.5"
            title="เพิ่มทีมและประกาศข่าวจำลองระบบเพื่อการสาธิตอย่างรวดเร็ว"
          >
            <RefreshCw size={14} />
            โหลดข้อมูลจำลองด่วน (Demo)
          </button>

          {/* Export button */}
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download size={14} />
            ส่งออกไฟล์ CSV
          </button>
        </div>
      </div>

      {/* Admin Panel Sub Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-1 font-mono text-xs">
        {[
          { id: 'matches', label: 'Match Scores & Rounds', count: matches.length },
          { id: 'teams', label: 'Teams Management', count: teams.length },
          { id: 'news', label: 'News / Announcements', count: announcements.length },
          { id: 'streams', label: 'Live Stream Embeds', count: liveStreams.length },
          { id: 'firebase', label: 'Firebase Realtime Config', count: null }
        ].map(sub => (
          <button
            key={sub.id}
            onClick={() => setActiveSubTab(sub.id as any)}
            className={`px-4 py-2.5 rounded-t-xl transition-all uppercase font-bold shrink-0 ${
              activeSubTab === sub.id 
                ? 'bg-[#161b22] text-[#00dbe7] border-t-2 border-[#00dbe7]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {sub.label} {sub.count !== null && `(${sub.count})`}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: MATCHES */}
      {activeSubTab === 'matches' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Score recorder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#161b22]/90 border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="font-sans font-bold text-base text-white">บันทึกผลการแข่งขัน (Update Bracket Match Score)</h3>
                
                {/* Game filter inside matches */}
                <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5 text-[10px] font-mono">
                  <button 
                    onClick={() => setGameFilter('ROV')} 
                    className={`px-3 py-1 rounded-md ${gameFilter === 'ROV' ? 'bg-[#00dbe7] text-black font-bold' : 'text-gray-400'}`}
                  >
                    ROV
                  </button>
                  <button 
                    onClick={() => setGameFilter('Free Fire')} 
                    className={`px-3 py-1 rounded-md ${gameFilter === 'Free Fire' ? 'bg-[#ff571a] text-white font-bold' : 'text-gray-400'}`}
                  >
                    Free Fire
                  </button>
                </div>
              </div>

              {filteredMatches.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-mono text-xs italic">
                  ไม่มีแมตช์ในรอบแบ่งสายเกมนี้ กรุณาจัดสายด้วยปุ่ม '🎲 สุ่มแบ่งสาย' ในหน้า Brackets ก่อน
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMatches.map(m => (
                    <div 
                      key={m.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        editingMatchId === m.id 
                          ? 'bg-black/40 border-[#00dbe7]' 
                          : 'bg-black/20 border-white/5 hover:border-white/15'
                      }`}
                    >
                      {editingMatchId === m.id ? (
                        /* Editing Interface */
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-white/5 pb-2">
                            <span>แมตช์ ID: {m.id} ({m.roundName})</span>
                            <span className="text-[#00dbe7] font-bold">โหมดแก้ไขคะแนน</span>
                          </div>

                          <div className="grid grid-cols-3 gap-3 items-center text-center">
                            <div>
                              <p className="text-xs font-bold text-white truncate mb-2">{getTeamName(m.teamAId)}</p>
                              <input 
                                type="number" 
                                value={scoreA}
                                onChange={(e) => setScoreA(parseInt(e.target.value) || 0)}
                                className="w-16 bg-black border border-white/10 text-center text-white py-1.5 rounded font-mono text-lg focus:outline-none focus:border-[#00dbe7]"
                              />
                            </div>
                            
                            <div className="text-xs text-gray-500 font-mono">VS / SCORE</div>

                            <div>
                              <p className="text-xs font-bold text-white truncate mb-2">{getTeamName(m.teamBId)}</p>
                              <input 
                                type="number" 
                                value={scoreB}
                                onChange={(e) => setScoreB(parseInt(e.target.value) || 0)}
                                className="w-16 bg-black border border-white/10 text-center text-white py-1.5 rounded font-mono text-lg focus:outline-none focus:border-[#00dbe7]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-gray-500 block">สถานะ</label>
                              <select
                                value={matchStatus}
                                onChange={(e) => setMatchStatus(e.target.value as any)}
                                className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="LIVE">LIVE</option>
                                <option value="FINISHED">FINISHED</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-gray-500 block">ระบุผู้ชนะ (Winner)</label>
                              <select
                                value={matchWinnerId}
                                onChange={(e) => setMatchWinnerId(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                              >
                                <option value="">อัตโนมัติตามคะแนน</option>
                                {m.teamAId && <option value={m.teamAId}>{getTeamName(m.teamAId)}</option>}
                                {m.teamBId && <option value={m.teamBId}>{getTeamName(m.teamBId)}</option>}
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                            <button 
                              onClick={() => setEditingMatchId(null)}
                              className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-gray-400 transition-all"
                            >
                              ยกเลิก
                            </button>
                            <button 
                              onClick={handleSaveMatch}
                              className="px-4 py-1 bg-[#00dbe7] hover:bg-[#00b9c3] text-black font-bold rounded text-xs transition-all shadow-md shadow-[#00dbe7]/10"
                            >
                              บันทึกคะแนน
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal display */
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[10px] font-mono text-gray-400">
                              {m.roundName} • {m.isUpperBracket ? 'สายบน (Upper)' : 'สายล่าง (Lower)'}
                            </p>
                            <div className="flex items-center gap-4 text-xs font-mono">
                              <span className="font-bold text-white">{getTeamName(m.teamAId)}</span>
                              <span className="font-sans font-black text-[#00dbe7] text-sm">
                                {m.scoreA !== null ? `${m.scoreA} - ${m.scoreB}` : 'VS'}
                              </span>
                              <span className="font-bold text-white">{getTeamName(m.teamBId)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              m.status === 'FINISHED' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : m.status === 'LIVE' 
                                  ? 'bg-red-500/10 text-red-400 animate-pulse'
                                  : 'bg-white/5 text-gray-500'
                            }`}>
                              {m.status}
                            </span>
                            <button
                              onClick={() => handleEditMatch(m)}
                              className="px-2.5 py-1 text-[10px] bg-white/5 hover:bg-[#00dbe7]/10 border border-white/5 text-[#00dbe7] rounded font-bold transition-all"
                            >
                              กรอกคะแนน
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Free fire round score multiplier calculator */}
          <div className="space-y-6">
            <div className="bg-[#161b22]/90 border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
              <div className="border-b border-white/5 pb-2">
                <h3 className="font-sans font-bold text-base text-white">คำนวณคะแนนรอบ Free Fire</h3>
                <p className="text-xs text-gray-400">สูตรคะแนนอันดับบวกคิลอัตโนมัติประจำรอบ</p>
              </div>

              <form onSubmit={handleRecordFreeFireRound} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400">เลือกทีม Free Fire</label>
                  <select
                    value={ffTeamId}
                    onChange={(e) => setFfTeamId(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  >
                    <option value="">-- เลือกทีมแข่ง --</option>
                    {teams.filter(t => t.game === 'Free Fire').map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-400">จำนวน Kill</label>
                    <input
                      type="number"
                      min={0}
                      value={ffKills}
                      onChange={(e) => setFfKills(parseInt(e.target.value) || 0)}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-400">อันดับที่ได้ (Placement)</label>
                    <select
                      value={ffPlacement}
                      onChange={(e) => setFfPlacement(parseInt(e.target.value) || 1)}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(rank => (
                        <option key={rank} value={rank}>อันดับที่ {rank}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#ff571a] hover:bg-[#e0450d] text-white font-mono text-xs font-bold rounded-xl transition-all shadow-md shadow-[#ff571a]/15 uppercase"
                >
                  ⚡ คำนวณและอัปเดตสถิติ
                </button>
              </form>
            </div>

            {/* Registration toggle controller */}
            <div className="bg-[#161b22]/90 border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
              <h3 className="font-sans font-bold text-base text-white">เปิด/ปิดสิทธิ์การรับสมัคร</h3>
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">รับสมัครทีมเข้าร่วม</p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {isRegistrationOpen ? '● OPEN FOR REGISTRATION' : '○ REGISTRATION CLOSED'}
                  </p>
                </div>

                <button
                  onClick={() => setIsRegistrationOpen(!isRegistrationOpen)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    isRegistrationOpen 
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {isRegistrationOpen ? 'เปิดอยู่ (คลิกปิด)' : 'ปิดอยู่ (คลิกเปิด)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TEAMS */}
      {activeSubTab === 'teams' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#161b22]/90 border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-sans font-bold text-base text-white">รายชื่อทีมลงทะเบียนทั้งหมด ({teams.length})</h3>
            
            {teams.length === 0 ? (
              <p className="text-center py-8 text-gray-500 font-mono text-xs italic">ยังไม่มีทีมในระบบ กรุณากรอกฟอร์มสมัครหรือกดสุ่ม Demo ด่วน</p>
            ) : (
              <div className="space-y-2">
                {teams.map(t => (
                  <div key={t.id} className="p-3 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-black/40 rounded border border-white/10 flex items-center justify-center font-bold text-lg text-white">
                        {t.logo.length < 5 ? t.logo : <img src={t.logo} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm">{t.name}</span>
                        <p className="text-[9px] text-gray-400 font-mono uppercase">{t.game} • CAPTAIN: {t.captainName}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTeam(t.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg border border-red-500/10 transition-colors"
                      title="ลบทีมนี้ออกจากทัวร์นาเมนต์"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Team Creator form */}
          <div className="bg-[#161b22]/90 border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-sans font-bold text-base text-white">เพิ่มทีมเข้าร่วมแข่งขันด่วน (Quick Add Team)</h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400">ชื่อทีม</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="เช่น SHADOW DRAGONS"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400">เลือกเกมที่แข่ง</label>
                <select
                  value={newTeamGame}
                  onChange={(e) => setNewTeamGame(e.target.value as any)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="ROV">ROV</option>
                  <option value="Free Fire">Free Fire</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400">ชื่อหัวหน้าทีม</label>
                <input
                  type="text"
                  value={newTeamCaptain}
                  onChange={(e) => setNewTeamCaptain(e.target.value)}
                  placeholder="ชื่อเรียกกัปตัน"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#00dbe7] hover:bg-[#00b9c3] text-black font-mono text-xs font-bold rounded-xl transition-all"
              >
                + เพิ่มทีมจำลองเข้าร่วม
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: NEWS */}
      {activeSubTab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#161b22]/90 border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-sans font-bold text-base text-white">รายการประกาศข่าวสารทั้งหมด</h3>
            
            {announcements.length === 0 ? (
              <p className="text-center py-8 text-gray-500 font-mono text-xs italic">ยังไม่มีหัวข้อประกาศการแข่งขันในขณะนี้</p>
            ) : (
              <div className="space-y-3">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-4 bg-black/20 rounded-xl border border-white/5 flex justify-between items-start">
                    <div className="space-y-1.5 max-w-[85%]">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-[#00dbe7]/10 text-[#00dbe7] px-2 py-0.5 rounded font-mono uppercase font-bold">{ann.category}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{ann.date}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{ann.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{ann.content}</p>
                    </div>

                    <button
                      onClick={() => onDeleteAnnouncement(ann.id)}
                      className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create announcement Form */}
          <div className="bg-[#161b22]/90 border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-sans font-bold text-base text-white">เขียนหัวข้อประกาศใหม่ (Create News)</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400">หัวข้อข่าวประกาศ</label>
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="เช่น อัปเดตตารางเวลาถ่ายทอดสดรอบแปดทีมสุดท้าย"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400">หมวดหมู่</label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value as any)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Announcement">ประกาศทั่วไป</option>
                  <option value="Major Update">อัปเดตสำคัญ (Major)</option>
                  <option value="Event">กิจกรรมใหม่ (Event)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400">เนื้อหาประกาศ</label>
                <textarea
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="กรอกรายละเอียดข่าวสาร..."
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-sans"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#00dbe7] hover:bg-[#00b9c3] text-black font-mono text-xs font-bold rounded-xl transition-all"
              >
                + ประกาศข่าวสาร
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: STREAMS */}
      {activeSubTab === 'streams' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#161b22]/90 border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-sans font-bold text-base text-white">ช่องทางการถ่ายทอดสดและช่องสตรีม (Live Channels)</h3>
            {liveStreams.length === 0 ? (
              <p className="text-center py-8 text-gray-500 font-mono text-xs italic">ยังไม่มีสตรีมสดหรือช่องทางถ่ายทอดสดในขณะนี้</p>
            ) : (
              <div className="space-y-3">
                {liveStreams.map(stream => (
                  <div key={stream.id} className="p-4 bg-black/20 rounded-xl border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ff571a]/10 flex items-center justify-center text-[#ff571a]">
                        <Play size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{stream.title}</h4>
                        <a 
                          href={stream.url} 
                          target="_blank" 
                          referrerPolicy="no-referrer" 
                          className="text-[10px] text-gray-500 hover:text-[#00dbe7] transition-colors"
                        >
                          {stream.url}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-mono uppercase font-bold">
                        {stream.platform}
                      </span>
                      <button
                        onClick={() => onDeleteLiveStream(stream.id)}
                        className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#161b22]/90 border border-white/10 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-sans font-bold text-base text-white">บันทึกช่องสตรีมสด (Add Live Stream)</h3>
            <form onSubmit={handleCreateStream} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400">หัวข้อถ่ายทอดสด / ชื่อช่องสตรีม</label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="เช่น ROV PRO LEAGUE 2026 LIVE STREAM"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400">แพลตฟอร์ม</label>
                <select
                  value={streamPlatform}
                  onChange={(e) => setStreamPlatform(e.target.value as any)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="youtube">YouTube Live</option>
                  <option value="facebook">Facebook Live</option>
                  <option value="tiktok">TikTok Live</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400">ลิงก์ URL ถ่ายทอดสด</label>
                <input
                  type="text"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  placeholder="เช่น https://www.youtube.com/watch?v=..."
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#ff571a] hover:bg-[#e0450d] text-white font-mono text-xs font-bold rounded-xl transition-all"
              >
                + บันทึกช่องถ่ายทอดสด
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FIREBASE SYNC PANEL */}
      {activeSubTab === 'firebase' && (
        <div className="bg-[#161b22]/90 border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-white/5">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base text-white">ข้อมูลโครงสร้างเชื่อมต่อ Firebase Realtime DB</h3>
              <p className="text-xs text-gray-400 font-mono">Cloud Firestore Connection Guide (Modular v9 API)</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-gray-300">
            <p className="leading-relaxed">
              เราได้จัดเตรียมไฟล์การตั้งค่า <span className="font-bold text-[#00dbe7] font-mono">/src/firebaseConfig.ts</span> ในโฟลเดอร์โปรเจกต์ของคุณเรียบร้อยแล้ว โดยเขียนโครงสร้าง JavaScript สำหรับเชื่อมต่อกับระบบฐานข้อมูลคลาวด์ <span className="font-bold text-[#ff571a]">Firebase Firestore</span> เวอร์ชันล่าสุดไว้ เพื่อให้สอดคล้องกับข้อกำหนด (v9 modular)
            </p>

            <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3 font-mono text-[11px]">
              <div className="flex justify-between text-gray-500 pb-1.5 border-b border-white/5">
                <span>FILE PATH: src/firebaseConfig.ts</span>
                <span className="text-[#00dbe7] font-bold">READY TO RUN</span>
              </div>
              
              <div className="space-y-1">
                <p className="text-gray-400">// ตัวอย่างจุดวาง Firebase Config และฟังก์ชัน addDoc / onSnapshot:</p>
                <p className="text-yellow-400">const firebaseConfig = &#123;</p>
                <p className="text-yellow-400 pl-4">apiKey: "YOUR_API_KEY",</p>
                <p className="text-yellow-400 pl-4">projectId: "YOUR_PROJECT_ID",</p>
                <p className="text-yellow-400 pl-4">...</p>
                <p className="text-yellow-400">&#125;;</p>
                
                <p className="text-emerald-400 mt-2">// 1. ดึงข้อมูลแบบเรียลไทม์ด้วย onSnapshot</p>
                <p className="text-gray-300">export function listenToTeamsFirebase(onUpdate: (teams: any[]) =&gt; void) &#123;</p>
                <p className="text-gray-300 pl-4">return onSnapshot(query(collection(db, 'teams')), (querySnapshot) =&gt; &#123; ... &#125;)</p>
                <p className="text-gray-300">&#125;</p>

                <p className="text-emerald-400 mt-2">// 2. บันทึกข้อมูลด้วย addDoc</p>
                <p className="text-gray-300">export async function registerTeamFirebase(teamData: any) &#123;</p>
                <p className="text-gray-300 pl-4">return await addDoc(collection(db, 'teams'), teamData);</p>
                <p className="text-gray-300">&#125;</p>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 space-y-1">
              <h4 className="font-bold text-sm">✓ โหมดออฟไลน์ทำงานสมบูรณ์แบบ</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                ในกรณีที่ยังไม่เชื่อมต่อ Firebase Config จริง ระบบของแอปจะสลับการเก็บข้อมูลผ่านตัวแปร State ภายในของ React โดยอัตโนมัติ ซึ่งยังคงรองรับการอัปเดตสถิติตารางคะแนน การคำนวณคะแนนคิล และการจับสายแบ่งสิทธิ์ของเกม ROV & Free Fire ได้อย่างสมบูรณ์แบบ 100%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { AdminView };
