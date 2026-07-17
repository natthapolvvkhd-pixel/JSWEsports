import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import RegistrationView from './components/RegistrationView';
import BracketsView from './components/BracketsView';
import StandingsView from './components/StandingsView';
import TeamProfileView from './components/TeamProfileView';
import AdminView from './components/AdminView';
import { Team, Match, Announcement, LiveStream, GameType, BracketType } from './types';
import { Flame, Trophy, Award, Radio, Info, X } from 'lucide-react';

const INITIAL_TEAMS: Team[] = [
  {
    id: 't-1',
    name: 'ALPHA SQUAD',
    logo: '🐯',
    captainName: 'ProPlayer_X',
    gameUid: '202938472',
    roster: {
      player1: 'Warlord',
      player2: 'SniperKing',
      player3: 'ShadowWalker',
      player4: 'Vanguard',
      player5: 'GhostRider',
      substitute: 'Phoenix'
    },
    contact: { discord: 'alpha#1001', line: 'alpha_line' },
    game: 'ROV',
    stats: { played: 3, wins: 2, losses: 1, kills: 0, placementPoints: 0, totalPoints: 6 },
    registeredAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 't-2',
    name: 'SHADOW STEP',
    logo: '🐲',
    captainName: 'NeonKnight',
    gameUid: '394857620',
    roster: {
      player1: 'Cypher',
      player2: 'Sentinel',
      player3: 'Phantom',
      player4: 'Viper',
      player5: 'Sage',
      substitute: 'Omen'
    },
    contact: { facebook: 'ShadowStepEsports' },
    game: 'ROV',
    stats: { played: 3, wins: 3, losses: 0, kills: 0, placementPoints: 0, totalPoints: 9 },
    registeredAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 't-3',
    name: 'TITAN VANGUARD',
    logo: '🐺',
    captainName: 'TitanSlayer',
    gameUid: '857493019',
    roster: {
      player1: 'Atlas',
      player2: 'Hercules',
      player3: 'Orion',
      player4: 'Zeus',
      player5: 'Poseidon',
      substitute: 'Hades'
    },
    contact: { discord: 'titan#8888' },
    game: 'ROV',
    stats: { played: 3, wins: 1, losses: 2, kills: 0, placementPoints: 0, totalPoints: 3 },
    registeredAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 't-4',
    name: 'NEON TIGERS',
    logo: '⚡',
    captainName: 'VoltagePro',
    gameUid: '584736291',
    roster: {
      player1: 'Sparky',
      player2: 'Current',
      player3: 'Ohm',
      player4: 'Ampere',
      player5: 'Tesla',
      substitute: 'Watt'
    },
    contact: { line: 'neon_tigers' },
    game: 'ROV',
    stats: { played: 3, wins: 0, losses: 3, kills: 0, placementPoints: 0, totalPoints: 0 },
    registeredAt: new Date(Date.now() - 3600000 * 15).toISOString()
  },
  // Free Fire teams
  {
    id: 't-5',
    name: 'HYDRA ECLIPSE',
    logo: '🦅',
    captainName: 'SunStrike',
    gameUid: '475829103',
    roster: {
      player1: 'Solar',
      player2: 'Lunar',
      player3: 'Cosmic',
      player4: 'Nova',
      player5: 'Nebula',
      substitute: 'Comet'
    },
    contact: { discord: 'hydra#2026' },
    game: 'Free Fire',
    stats: { played: 2, wins: 0, losses: 2, kills: 18, placementPoints: 21, totalPoints: 39 },
    registeredAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 't-6',
    name: 'VALOR VORTEX',
    logo: '🔮',
    captainName: 'Zenith',
    gameUid: '928374162',
    roster: {
      player1: 'Apex',
      player2: 'Summit',
      player3: 'Crest',
      player4: 'Pinnacle',
      player5: 'Peak',
      substitute: 'Base'
    },
    contact: { facebook: 'valoresports' },
    game: 'Free Fire',
    stats: { played: 2, wins: 0, losses: 2, kills: 24, placementPoints: 17, totalPoints: 41 },
    registeredAt: new Date(Date.now() - 3600000 * 10).toISOString()
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a-1',
    title: '🏆 เปิดรับสมัครทัวร์นาเมนต์รอบแบ่งกลุ่มซีซั่นใหม่!',
    content: 'Arena Ops เปิดรับลงทะเบียนทีมเพื่อเข้าร่วมคัดเลือกทั้งเกม RoV และ Free Fire ทั่วประเทศไทย สมัครด่วนโควตามีจำนวนจำกัด!',
    category: 'Major Update',
    date: '2026-07-16'
  },
  {
    id: 'a-2',
    title: '📢 ข้อกำหนดกฎกติกาการบันทึกคะแนนเพื่อป้องกันคะแนนผิดพลาด',
    content: 'สำหรับเกม Free Fire ผู้ดูแลระบบจะคำนวณคะแนนรวมโดยใช้ระบบ Placement Points บวกกับ Kills Points (1 คิล = 1 แต้ม) ตามตารางคะแนนมาตรฐาน',
    category: 'Announcement',
    date: '2026-07-15'
  }
];

const INITIAL_STREAMS: LiveStream[] = [
  {
    id: 's-1',
    title: '🔴 ROV Pro League 2026 Live Matchday 1',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube',
    isLive: true
  },
  {
    id: 's-2',
    title: '🔴 Free Fire World Series Live Finals',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube',
    isLive: false
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isFirebaseDemoVisible, setFirebaseDemoVisible] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);

  // Core Data State
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(INITIAL_STREAMS);
  const [matches, setMatches] = useState<Match[]>([]);
  
  // Filtering & Modal View States
  const [gameFilter, setGameFilter] = useState<GameType>('ROV');
  const [bracketType, setBracketType] = useState<BracketType>('Single Elimination');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Initialize simulated bracket tree matches on load
  useEffect(() => {
    generateInitialMatches(bracketType, 'ROV');
  }, []);

  const generateInitialMatches = (type: BracketType, game: GameType) => {
    const gameTeams = teams.filter(t => t.game === game);
    const newMatches: Match[] = [];

    if (type === 'Single Elimination') {
      // Create a standard 8-team tree structure (or padded empty slots)
      // Quarter Finals
      const qf1: Match = { id: 'm-qf1', roundId: 'QF', roundName: 'Quarter Final 1', teamAId: gameTeams[0]?.id || null, teamBId: gameTeams[1]?.id || null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-sf1', isUpperBracket: true };
      const qf2: Match = { id: 'm-qf2', roundId: 'QF', roundName: 'Quarter Final 2', teamAId: gameTeams[2]?.id || null, teamBId: gameTeams[3]?.id || null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-sf1', isUpperBracket: true };
      const qf3: Match = { id: 'm-qf3', roundId: 'QF', roundName: 'Quarter Final 3', teamAId: null, teamBId: null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-sf2', isUpperBracket: true };
      const qf4: Match = { id: 'm-qf4', roundId: 'QF', roundName: 'Quarter Final 4', teamAId: null, teamBId: null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-sf2', isUpperBracket: true };

      // Semi Finals
      const sf1: Match = { id: 'm-sf1', roundId: 'SF', roundName: 'Semi Final 1', teamAId: null, teamBId: null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-gf1', isUpperBracket: true };
      const sf2: Match = { id: 'm-sf2', roundId: 'SF', roundName: 'Semi Final 2', teamAId: null, teamBId: null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-gf1', isUpperBracket: true };

      // Grand Finals
      const gf1: Match = { id: 'm-gf1', roundId: 'GF', roundName: 'Grand Finals', teamAId: null, teamBId: null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: null, isUpperBracket: true };

      newMatches.push(qf1, qf2, qf3, qf4, sf1, sf2, gf1);
    } else if (type === 'Double Elimination') {
      // Upper QF
      const qf1: Match = { id: 'm-qf1', roundId: 'QF', roundName: 'Upper Quarter 1', teamAId: gameTeams[0]?.id || null, teamBId: gameTeams[1]?.id || null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-sf1', isUpperBracket: true };
      const qf2: Match = { id: 'm-qf2', roundId: 'QF', roundName: 'Upper Quarter 2', teamAId: gameTeams[2]?.id || null, teamBId: gameTeams[3]?.id || null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-sf1', isUpperBracket: true };

      // Upper SF
      const sf1: Match = { id: 'm-sf1', roundId: 'SF', roundName: 'Upper Semi 1', teamAId: null, teamBId: null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-gf1', isUpperBracket: true };

      // Lower Bracket Matches
      const lb1: Match = { id: 'm-lb1', roundId: 'L1', roundName: 'Losers Semi 1', teamAId: null, teamBId: null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-lb2', isUpperBracket: false };
      const lb2: Match = { id: 'm-lb2', roundId: 'L2', roundName: 'Losers Finals', teamAId: null, teamBId: null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: 'm-gf1', isUpperBracket: false };

      // Grand Finals
      const gf1: Match = { id: 'm-gf1', roundId: 'GF', roundName: 'Grand Finals', teamAId: null, teamBId: null, scoreA: null, scoreB: null, winnerId: null, loserId: null, status: 'PENDING', nextMatchId: null, isUpperBracket: true };

      newMatches.push(qf1, qf2, sf1, lb1, lb2, gf1);
    } else {
      // Round Robin League combinations
      const usable = gameTeams.slice(0, 4); // limit to first 4 for clean combinations
      let matchIdx = 1;
      for (let i = 0; i < usable.length; i++) {
        for (let j = i + 1; j < usable.length; j++) {
          newMatches.push({
            id: `m-rr${matchIdx}`,
            roundId: 'RR',
            roundName: `League Match ${matchIdx}`,
            teamAId: usable[i].id,
            teamBId: usable[j].id,
            scoreA: null,
            scoreB: null,
            winnerId: null,
            loserId: null,
            status: 'PENDING',
            nextMatchId: null,
            isUpperBracket: true
          });
          matchIdx++;
        }
      }
    }

    setMatches(newMatches);
  };

  const handleGenerateBrackets = (type: BracketType, game: GameType) => {
    generateInitialMatches(type, game);
    alert(`⚡ สุ่มสลับและคำนวณผังสายการแข่งขัน ${type} ของเกม ${game} สำเร็จแล้ว!`);
  };

  const handleRegisterTeam = (newTeam: Omit<Team, 'id' | 'stats' | 'registeredAt'>) => {
    const formatted: Team = {
      ...newTeam,
      id: `t-${Date.now()}`,
      stats: {
        played: 0,
        wins: 0,
        losses: 0,
        kills: 0,
        placementPoints: 0,
        totalPoints: 0
      },
      registeredAt: new Date().toISOString()
    };

    setTeams(prev => [formatted, ...prev]);
  };

  const handleDeleteTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateMatchResult = (
    matchId: string, 
    scoreAVal: number, 
    scoreBVal: number, 
    statusVal: 'PENDING' | 'LIVE' | 'FINISHED',
    winnerIdVal: string | null
  ) => {
    setMatches(prev => {
      const updated = prev.map(m => {
        if (m.id !== matchId) return m;

        const isFinished = statusVal === 'FINISHED';
        let loserIdVal: string | null = null;
        if (winnerIdVal) {
          loserIdVal = winnerIdVal === m.teamAId ? m.teamBId : m.teamAId;
        }

        return {
          ...m,
          scoreA: scoreAVal,
          scoreB: scoreBVal,
          status: statusVal,
          winnerId: winnerIdVal,
          loserId: loserIdVal
        };
      });

      // Forward winners to next matches automatically!
      return updated.map(m => {
        if (m.nextMatchId) {
          const sourceMatch = updated.find(src => src.nextMatchId === m.id);
          if (sourceMatch && sourceMatch.winnerId) {
            // Find whether to place in teamAId or teamBId
            if (!m.teamAId) {
              m.teamAId = sourceMatch.winnerId;
            } else if (m.teamAId !== sourceMatch.winnerId && !m.teamBId) {
              m.teamBId = sourceMatch.winnerId;
            }
          }
        }
        return m;
      });
    });

    // Automatically update team leaderboards/points if finished
    if (statusVal === 'FINISHED' && winnerIdVal) {
      setTeams(prevTeams => {
        return prevTeams.map(t => {
          const match = matches.find(m => m.id === matchId);
          if (!match) return t;

          const isTeamA = match.teamAId === t.id;
          const isTeamB = match.teamBId === t.id;

          if (!isTeamA && !isTeamB) return t;

          const isWin = winnerIdVal === t.id;
          const newStats = { ...t.stats };
          newStats.played += 1;
          if (isWin) {
            newStats.wins += 1;
            newStats.totalPoints += 3; // +3 points for ROV Win
          } else {
            newStats.losses += 1;
          }

          return { ...t, stats: newStats };
        });
      });
    }

    alert('บันทึกผลคะแนนเรียบร้อยแล้ว ผังสายการแข่งขันและสถิติลีดเดอร์บอร์ดถูกคำนวณอัปเดตแบบเรียลไทม์');
  };

  const handleAddAnnouncement = (ann: Omit<Announcement, 'id' | 'date'>) => {
    const formatted: Announcement = {
      ...ann,
      id: `a-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [formatted, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleAddLiveStream = (stream: Omit<LiveStream, 'id'>) => {
    const formatted: LiveStream = {
      ...stream,
      id: `s-${Date.now()}`
    };
    setLiveStreams(prev => [formatted, ...prev]);
  };

  const handleDeleteLiveStream = (id: string) => {
    setLiveStreams(prev => prev.filter(s => s.id !== id));
  };

  // Bulk Load Demo elements for amazing presentation
  const handleBulkLoadDemo = () => {
    const demoTeams: Team[] = [
      {
        id: 'demo-t1',
        name: 'HYDRA ECLIPSE',
        logo: '🐲',
        captainName: 'Zenith',
        gameUid: '392817462',
        roster: { player1: 'Cosmic', player2: 'Solar', player3: 'Nebula', player4: 'Comet', player5: 'Star', substitute: 'Sun' },
        contact: { discord: 'hydra#999' },
        game: 'ROV',
        stats: { played: 2, wins: 2, losses: 0, kills: 0, placementPoints: 0, totalPoints: 6 },
        registeredAt: new Date().toISOString()
      },
      {
        id: 'demo-t2',
        name: 'VALOR VORTEX',
        logo: '🦅',
        captainName: 'Aero',
        gameUid: '920192847',
        roster: { player1: 'Storm', player2: 'Wind', player3: 'Gale', player4: 'Tempest', player5: 'Zephyr', substitute: 'Gust' },
        contact: { line: 'valor_vortex' },
        game: 'ROV',
        stats: { played: 2, wins: 0, losses: 2, kills: 0, placementPoints: 0, totalPoints: 0 },
        registeredAt: new Date().toISOString()
      },
      {
        id: 'demo-t3',
        name: 'PHANTOM GHOSTS',
        logo: '🔮',
        captainName: 'Spook',
        gameUid: '485920194',
        roster: { player1: 'Specter', player2: 'Wraith', player3: 'Spirit', player4: 'Shadow', player5: 'Haunt', substitute: 'Grave' },
        contact: { facebook: 'phantom_esports' },
        game: 'Free Fire',
        stats: { played: 4, wins: 0, losses: 4, kills: 38, placementPoints: 28, totalPoints: 66 },
        registeredAt: new Date().toISOString()
      },
      {
        id: 'demo-t4',
        name: 'STORM WALKERS',
        logo: '🪐',
        captainName: 'Thunder',
        gameUid: '201938573',
        roster: { player1: 'Lightning', player2: 'Rain', player3: 'Cloud', player4: 'Flash', player5: 'Shock', substitute: 'Spark' },
        contact: { discord: 'storm#1010' },
        game: 'Free Fire',
        stats: { played: 4, wins: 0, losses: 4, kills: 32, placementPoints: 34, totalPoints: 66 },
        registeredAt: new Date().toISOString()
      }
    ];

    setTeams(prev => [...demoTeams, ...prev]);

    const demoAnnouncement: Announcement = {
      id: 'demo-a1',
      title: '⚡ ประกาศอัปเดตสถิติล่าสุดการสตรีมรอบชิงชนะเลิศ',
      content: 'มียอดผู้ชมสดพร้อมกันทะลุกว่า 5,000 คนแล้ว! ขอขอบคุณแฟนคลับและสปอนเซอร์อย่าง Razer และ Monster Energy ที่ร่วมสนับสนุนรายการแข่งขัน Arena Ops ทัวร์นาเมนต์นี้',
      category: 'Major Update',
      date: '2026-07-17'
    };

    setAnnouncements(prev => [demoAnnouncement, ...prev]);
    alert('โหลดข้อมูลจำลองทีมและสถิติด่วน (Demo) เรียบร้อย! เชิญตรวจสอบความเชื่อมโยงในส่วนตารางคะแนนและ Bracket ได้ทันที');
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-[#00dbe7]/35 selection:text-white">
      {/* Scanner matrix light decoration background */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-radial-gradient from-[#00dbe7]/5 via-[#ff571a]/5 to-transparent pointer-events-none z-0" />
      
      {/* Navbar navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isFirebaseDemoVisible={isFirebaseDemoVisible}
        setFirebaseDemoVisible={setFirebaseDemoVisible}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 pt-28 relative z-10">
        
        {/* Firebase Config Guide Popover Modal */}
        {isFirebaseDemoVisible && (
          <div className="bg-[#1d222d] border-b-2 border-l-2 border-r-2 border-[#ff571a] p-5 rounded-b-2xl mb-8 shadow-[0_0_15px_rgba(255,87,26,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-gray-300">
            <div className="space-y-1">
              <span className="bg-[#ff571a] text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                Firebase Firestore Connected (v9 Modular ready)
              </span>
              <p className="font-bold text-white text-sm pt-1">ระบบจัดเตรียมโค้ดเชื่อมต่อคลาวด์แล้ว!</p>
              <p className="text-gray-400">คุณสามารถวาง Firebase credentials ของคุณในไฟล์ `/src/firebaseConfig.ts` เพื่อให้แอปเชื่อมต่อแบบเรียลไทม์กับฐานข้อมูลจริง</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('admin')} 
                className="px-4 py-1.5 bg-[#ff571a]/20 text-[#ff571a] border border-[#ff571a]/40 rounded-lg hover:bg-[#ff571a]/30 transition-all text-[11px] font-bold"
              >
                ดูคู่มือ Firestore
              </button>
              <button 
                onClick={() => setFirebaseDemoVisible(false)}
                className="p-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Navigation Switching */}
        {activeTab === 'home' && (
          <HomeView 
            announcements={announcements} 
            liveStreams={liveStreams} 
            teams={teams}
            setActiveTab={setActiveTab}
            onSelectTeam={(t) => setSelectedTeam(t)}
          />
        )}

        {activeTab === 'registration' && (
          <RegistrationView 
            onRegisterTeam={handleRegisterTeam}
            isRegistrationOpen={isRegistrationOpen}
          />
        )}

        {activeTab === 'brackets' && (
          <BracketsView 
            teams={teams}
            matches={matches}
            onGenerateBrackets={handleGenerateBrackets}
            gameFilter={gameFilter}
            setGameFilter={setGameFilter}
            bracketType={bracketType}
            setBracketType={setBracketType}
          />
        )}

        {activeTab === 'standings' && (
          <StandingsView 
            teams={teams}
            gameFilter={gameFilter}
            setGameFilter={setGameFilter}
            onSelectTeam={(t) => setSelectedTeam(t)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView 
            teams={teams}
            matches={matches}
            announcements={announcements}
            liveStreams={liveStreams}
            isRegistrationOpen={isRegistrationOpen}
            setIsRegistrationOpen={setIsRegistrationOpen}
            onAddTeam={handleRegisterTeam}
            onDeleteTeam={handleDeleteTeam}
            onUpdateMatchResult={handleUpdateMatchResult}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onAddLiveStream={handleAddLiveStream}
            onDeleteLiveStream={handleDeleteLiveStream}
            onBulkLoadDemo={handleBulkLoadDemo}
          />
        )}
      </main>

      {/* Team Details Profile Modal Popover */}
      {selectedTeam && (
        <TeamProfileView 
          team={selectedTeam} 
          matches={matches}
          onClose={() => setSelectedTeam(null)}
          allTeams={teams}
        />
      )}

      {/* Footer credits and details */}
      <footer className="bg-[#0b0e14] border-t border-white/5 py-8 text-center text-xs font-mono text-gray-500 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="text-gray-400">© 2026 ARENA OPS. ALL RIGHTS RESERVED.</p>
          <p className="text-[10px] text-gray-600">
            ระบบบันทึกคะแนนและพยากรณ์ข้อมูลสายการแข่งขันกีฬาอีสปอร์ต (RoV / Free Fire) • ขับเคลื่อนด้วยระบบ React & Tailwind
          </p>
        </div>
      </footer>
    </div>
  );
}
export { App };
