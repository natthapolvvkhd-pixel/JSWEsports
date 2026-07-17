import { Trophy, Tv, Radio, ArrowRight, Play, TrendingUp, HelpCircle } from 'lucide-react';
import { Announcement, LiveStream, Team } from '../types';

interface HomeViewProps {
  announcements: Announcement[];
  liveStreams: LiveStream[];
  teams: Team[];
  setActiveTab: (tab: string) => void;
  onSelectTeam?: (team: Team) => void;
}

export default function HomeView({
  announcements,
  liveStreams,
  teams,
  setActiveTab,
  onSelectTeam
}: HomeViewProps) {
  // Predefined image references to keep quality high and design dynamic
  const rovProImage = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600";
  const ffCupImage = "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600";
  const newsHeroImage = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=1200";

  // Predefined cool esports avatar colors
  const avatarColors = ["border-[#00dbe7]", "border-[#ff571a]", "border-[#d1bcff]"];

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Section */}
      <section className="relative h-[480px] w-full flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-r from-black via-[#10131a]/80 to-transparent border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-radial-gradient from-[#00dbe7]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="relative z-10 w-full max-w-7xl px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="inline-block bg-[#ff571a]/15 text-[#ff571a] border border-[#ff571a]/40 px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest rounded-full">
              Live Competition
            </span>
            <h1 className="font-sans font-black text-4xl md:text-5xl lg:text-6xl text-white leading-none tracking-tight">
              THE ULTIMATE <br />
              <span className="text-[#00dbe7] text-transparent bg-clip-text bg-gradient-to-r from-[#00dbe7] to-[#00696f]">
                ARENA ASCENSION
              </span>
            </h1>
            <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed">
              ร่วมการแข่งขันสุดเดือดของ ROV และ Free Fire ชิงความเป็นหนึ่งในภูมิภาค สมัครทีมของคุณแล้วไต่อันดับสู่การเป็นตำนานระดับประเทศ!
            </p>
            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => setActiveTab('registration')}
                className="bg-gradient-to-r from-[#00dbe7] to-[#00696f] text-black font-mono font-extrabold px-6 py-3 rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,219,231,0.4)]"
              >
                REGISTER NOW
                <Trophy size={16} />
              </button>
              <button 
                onClick={() => setActiveTab('brackets')}
                className="bg-[#161b22]/80 border border-white/15 px-6 py-3 rounded-xl text-white font-mono font-bold hover:bg-white/5 transition-all"
              >
                VIEW BRACKETS
              </button>
            </div>
          </div>

          {/* Quick tournament features cards */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            <div 
              onClick={() => setActiveTab('registration')}
              className="bg-[#161b22]/80 p-5 rounded-2xl relative overflow-hidden group border border-white/10 hover:border-[#00dbe7]/50 cursor-pointer transition-all duration-300"
            >
              <div className="h-28 w-full mb-4 rounded-xl overflow-hidden relative">
                <img src={rovProImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="RoV League" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10131a] to-transparent opacity-80" />
              </div>
              <h3 className="font-sans font-bold text-lg text-[#00dbe7]">RoV PRO LEAGUE</h3>
              <p className="font-mono text-xs text-gray-400">PRIZE POOL: ฿150,000</p>
              <div className="mt-4 flex items-center justify-between text-xs font-mono">
                <span className="flex items-center text-[#ff571a] font-bold">
                  <span className="w-2 h-2 bg-[#ff571a] rounded-full animate-pulse mr-1.5" />
                  OPEN FOR SIGNUP
                </span>
                <ArrowRight size={14} className="text-[#00dbe7]" />
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('registration')}
              className="bg-[#161b22]/80 p-5 rounded-2xl relative overflow-hidden group border border-white/10 hover:border-[#ff571a]/50 cursor-pointer transition-all duration-300"
            >
              <div className="h-28 w-full mb-4 rounded-xl overflow-hidden relative">
                <img src={ffCupImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Free Fire Cup" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10131a] to-transparent opacity-80" />
              </div>
              <h3 className="font-sans font-bold text-lg text-[#ff571a]">FREE FIRE CUP</h3>
              <p className="font-mono text-xs text-gray-400">PRIZE POOL: ฿100,000</p>
              <div className="mt-4 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">STARTS IN 2 DAYS</span>
                <ArrowRight size={14} className="text-[#ff571a]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Matches Ticker */}
      <div className="w-full bg-[#1d2026] border-y border-white/5 py-3.5 overflow-hidden whitespace-nowrap relative rounded-xl">
        <div className="flex items-center gap-10 animate-[marquee_25s_linear_infinite] hover:pause">
          <div className="flex items-center gap-4 px-6 border-r border-white/10">
            <span className="font-mono text-xs text-[#00dbe7] font-bold uppercase bg-[#00dbe7]/10 px-2 py-0.5 rounded">LIVE ROV</span>
            <span className="text-sm font-bold text-white">ALPHA SQUAD [2] vs [1] SHADOW STEP</span>
            <span className="text-gray-400 text-xs font-mono">GAME 3 UNDERWAY</span>
          </div>
          <div className="flex items-center gap-4 px-6 border-r border-white/10">
            <span className="font-mono text-xs text-[#ff571a] font-bold uppercase bg-[#ff571a]/10 px-2 py-0.5 rounded">UPCOMING FF</span>
            <span className="text-sm font-bold text-white">ROUND Robin - MATCH 4</span>
            <span className="text-gray-400 text-xs font-mono">18:00 UTC</span>
          </div>
          <div className="flex items-center gap-4 px-6 border-r border-white/10">
            <span className="font-mono text-xs text-[#00dbe7] font-bold uppercase bg-[#00dbe7]/10 px-2 py-0.5 rounded">LIVE ROV</span>
            <span className="text-sm font-bold text-white">TITAN VANGUARD [0] vs [0] NEON TIGERS</span>
            <span className="text-gray-400 text-xs font-mono">STREAMING LIVE</span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-4 px-6 border-r border-white/10">
            <span className="font-mono text-xs text-[#00dbe7] font-bold uppercase bg-[#00dbe7]/10 px-2 py-0.5 rounded">LIVE ROV</span>
            <span className="text-sm font-bold text-white">ALPHA SQUAD [2] vs [1] SHADOW STEP</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout (MVP, Announcements and Streams) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Teams Standings preview */}
        <div className="bg-[#161b22]/90 p-6 rounded-2xl flex flex-col justify-between border border-white/10 shadow-lg">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h2 className="font-sans font-bold text-lg text-white">TOP TEAMS</h2>
              <Trophy size={18} className="text-[#00dbe7]" />
            </div>
            
            <div className="space-y-3">
              {teams.slice(0, 3).map((team, idx) => (
                <div 
                  key={team.id}
                  onClick={() => onSelectTeam && onSelectTeam(team)}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#00dbe7]/30 hover:bg-white/10 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#00dbe7] text-sm">#{idx + 1}</span>
                    <div className="w-9 h-9 rounded-lg bg-[#0b0e14] border border-[#00dbe7]/20 overflow-hidden flex items-center justify-center font-mono font-bold text-white">
                      {team.logo.length < 5 ? team.logo : <img src={team.logo} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm truncate max-w-[120px]">{team.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono uppercase">{team.game}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-white">
                      {team.game === 'ROV' ? `${team.stats.wins}W - ${team.stats.losses}L` : `${team.stats.totalPoints} PTS`}
                    </p>
                    <p className="text-[9px] text-gray-500 font-mono uppercase">
                      {team.game === 'ROV' ? 'RECORD' : `KILLS: ${team.stats.kills}`}
                    </p>
                  </div>
                </div>
              ))}

              {teams.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm font-mono">
                  ยังไม่มีทีมลงทะเบียนเข้าร่วม
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('standings')}
            className="w-full mt-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-mono uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Go To Standings
          </button>
        </div>

        {/* Featured News Section */}
        <div className="lg:col-span-2 relative bg-[#161b22]/90 rounded-2xl overflow-hidden group border border-white/10 shadow-lg min-h-[300px] flex flex-col justify-between">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={newsHeroImage} className="w-full h-full object-cover opacity-35 transition-transform duration-700 group-hover:scale-105" alt="Arena Stadium" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10131a] via-[#10131a]/70 to-transparent" />
          </div>

          <div className="relative z-10 p-6 flex flex-col justify-between h-full space-y-6">
            <div className="flex justify-between items-center">
              <span className="bg-[#00dbe7] text-black font-mono font-black text-xs px-2.5 py-0.5 rounded">
                NEWS & UPDATES
              </span>
              <span className="text-xs text-gray-400 font-mono">ARENA CHRONICLES</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-sans font-black text-2xl md:text-3xl leading-tight text-white group-hover:text-[#00dbe7] transition-colors">
                ARENA OPS WORLD CHAMPIONSHIP 2026
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                เตรียมพบกับมหากาพย์ทัวร์นาเมนต์ที่รวบรวมทีม Esports ชั้นนำของไทยมาระเบิดศึกสายฟ้าแลบ ร่วมลุ้นชิงเงินรางวัลรวมกว่า 250,000 บาท! สมาชิกพร้อมสมัครได้แล้ววันนี้
              </p>
            </div>

            {/* List of other news */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              {announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-white/10 text-[#00dbe7] px-1.5 py-0.5 font-mono uppercase rounded">
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{ann.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate hover:text-[#00dbe7] cursor-pointer">
                    {ann.title}
                  </h4>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="col-span-2 text-xs text-gray-500 font-mono italic">
                  ไม่มีประกาศอื่นๆ ในขณะนี้
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Streaming Section & Upcoming Fixtures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Live streams container */}
        <div className="md:col-span-2 bg-[#161b22]/90 p-6 rounded-2xl border border-white/10 shadow-lg space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
              <Radio size={18} className="text-[#ff571a] animate-pulse" />
              LIVE TOURNAMENT COVERAGE
            </h3>
            <Tv size={18} className="text-gray-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {liveStreams.map((stream) => (
              <div key={stream.id} className="bg-black/50 border border-white/5 rounded-xl overflow-hidden group">
                <div className="aspect-video bg-[#0b0e14] relative flex items-center justify-center">
                  {/* Embedded Video Placeholder with high dynamic design */}
                  <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-40 transition-opacity" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400')` }} />
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {stream.isLive && (
                    <span className="absolute top-2 left-2 bg-[#ff571a] text-white text-[10px] font-mono font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      LIVE NOW
                    </span>
                  )}

                  <span className="absolute bottom-2 right-2 bg-black/70 text-gray-400 text-[10px] font-mono px-2 py-0.5 rounded capitalize">
                    {stream.platform}
                  </span>

                  <a 
                    href={stream.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="z-10 w-12 h-12 rounded-full bg-[#00dbe7] text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                  >
                    <Play size={20} fill="black" />
                  </a>
                </div>
                <div className="p-3">
                  <h4 className="font-sans font-bold text-sm text-white truncate">{stream.title}</h4>
                  <p className="text-[10px] text-gray-400 font-mono truncate">{stream.url}</p>
                </div>
              </div>
            ))}

            {liveStreams.length === 0 && (
              <div className="col-span-2 py-12 text-center text-gray-500 text-sm font-mono italic">
                ขณะนี้ไม่มีช่องการถ่ายทอดสดที่บันทึกไว้
              </div>
            )}
          </div>
        </div>

        {/* Pulse / Activity Growth visualizer */}
        <div className="bg-[#161b22]/90 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-white">ARENA PLATFORM PULSE</h3>
            <p className="text-xs text-gray-400 font-mono mt-1">Platform Activity Growth</p>
          </div>

          <div className="h-28 w-full flex items-end gap-1.5 px-2 bg-black/30 rounded-xl p-3 border border-white/5">
            {/* Simulated nice high-contrast sparkline */}
            <div className="flex-1 bg-[#00dbe7]/10 rounded-t h-[40%] hover:bg-[#00dbe7]/30 transition-colors cursor-pointer" title="Monday" />
            <div className="flex-1 bg-[#00dbe7]/20 rounded-t h-[55%] hover:bg-[#00dbe7]/40 transition-colors cursor-pointer" title="Tuesday" />
            <div className="flex-1 bg-[#00dbe7]/30 rounded-t h-[50%] hover:bg-[#00dbe7]/50 transition-colors cursor-pointer" title="Wednesday" />
            <div className="flex-1 bg-[#00dbe7]/40 rounded-t h-[75%] hover:bg-[#00dbe7]/60 transition-colors cursor-pointer" title="Thursday" />
            <div className="flex-1 bg-[#00dbe7]/60 rounded-t h-[60%] hover:bg-[#00dbe7]/70 transition-colors cursor-pointer" title="Friday" />
            <div className="flex-1 bg-[#00dbe7]/80 rounded-t h-[95%] hover:bg-[#00dbe7]/90 transition-colors cursor-pointer" title="Saturday" />
            <div className="flex-1 bg-[#00dbe7] rounded-t h-[85%] shadow-[0_0_10px_rgba(0,219,231,0.5)] cursor-pointer" title="Sunday" />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="flex items-center gap-1 text-[#00dbe7] font-mono text-xs font-bold">
              <TrendingUp size={14} />
              +14.8% THIS WEEK
            </span>
            <span className="text-gray-400 font-mono text-xs">4.2K USERS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Sponsors footer area */}
      <section className="py-6 px-4 rounded-2xl bg-white/[0.02] border border-white/5 opacity-55 hover:opacity-100 transition-opacity">
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 text-center">
          <span className="font-sans font-black text-2xl text-gray-500 tracking-tighter hover:text-[#00dbe7] transition-colors cursor-default">RAZER</span>
          <span className="font-sans font-black text-2xl text-gray-500 tracking-tighter hover:text-[#ff571a] transition-colors cursor-default">RED BULL</span>
          <span className="font-sans font-black text-2xl text-gray-500 tracking-tighter hover:text-white transition-colors cursor-default">INTEL</span>
          <span className="font-sans font-black text-2xl text-gray-500 tracking-tighter hover:text-[#d1bcff] transition-colors cursor-default">MONSTER ENERGY</span>
        </div>
      </section>
    </div>
  );
}
export { HomeView };
