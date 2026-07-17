import React, { useState } from 'react';
import { Shield, User, Award, Phone, Send, Info } from 'lucide-react';
import { Team, GameType } from '../types';

interface RegistrationViewProps {
  onRegisterTeam: (team: Omit<Team, 'id' | 'stats' | 'registeredAt'>) => void;
  isRegistrationOpen: boolean;
}

const PREDEFINED_LOGOS = [
  "🐯", "🐲", "🐺", "🦅", "⚔️", "⚡", "🔮", "🔥", "🪐"
];

export default function RegistrationView({
  onRegisterTeam,
  isRegistrationOpen
}: RegistrationViewProps) {
  const [game, setGame] = useState<GameType>('ROV');
  const [name, setName] = useState('');
  const [logo, setLogo] = useState(PREDEFINED_LOGOS[0]);
  const [logoType, setLogoType] = useState<'emoji' | 'url'>('emoji');
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [gameUid, setGameUid] = useState('');
  
  // Players (5 active + 1 reserve)
  const [players, setPlayers] = useState({
    player1: '',
    player2: '',
    player3: '',
    player4: '',
    player5: '',
    substitute: ''
  });

  // Contact info
  const [discord, setDiscord] = useState('');
  const [facebook, setFacebook] = useState('');
  const [line, setLine] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePlayerChange = (field: string, value: string) => {
    setPlayers(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isRegistrationOpen) {
      setError('ขณะนี้ระบบปิดรับสมัครทีมแข่งขันแล้ว ขออภัยในความไม่สะดวก');
      return;
    }

    if (!name.trim()) return setError('กรุณากรอกชื่อทีม');
    if (!captainName.trim()) return setError('กรุณากรอกชื่อหัวหน้าทีม');
    if (!gameUid.trim()) return setError('กรุณากรอก UID เกม');
    if (!players.player1.trim() || !players.player2.trim() || !players.player3.trim() || !players.player4.trim() || !players.player5.trim()) {
      return setError('กรุณากรอกรายชื่อผู้เล่นตัวจริงให้ครบทั้ง 5 คน');
    }

    const finalLogo = logoType === 'emoji' ? logo : (customLogoUrl.trim() || '🛡️');

    onRegisterTeam({
      name,
      logo: finalLogo,
      captainName,
      gameUid,
      roster: players,
      contact: {
        discord: discord.trim() || undefined,
        facebook: facebook.trim() || undefined,
        line: line.trim() || undefined,
      },
      game
    });

    setSuccess(true);
    // Reset form
    setName('');
    setCaptainName('');
    setGameUid('');
    setPlayers({
      player1: '',
      player2: '',
      player3: '',
      player4: '',
      player5: '',
      substitute: ''
    });
    setDiscord('');
    setFacebook('');
    setLine('');
    setCustomLogoUrl('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h1 className="font-sans font-black text-3xl md:text-4xl text-white tracking-tight">
          ลงทะเบียนสมัครทีมแข่งขัน
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          ฟอร์มสมัครเข้าร่วมการแข่งขัน Arena Ops ทัวร์นาเมนต์เกมชั้นนำระดับประเทศ กรุณากรอกข้อมูลทีมของคุณให้ครบถ้วนเพื่อทำการสุ่มจัดสาย
        </p>
      </div>

      {!isRegistrationOpen && (
        <div className="bg-[#ff571a]/10 border border-[#ff571a]/30 p-4 rounded-xl flex items-start gap-3 text-[#ff571a]">
          <Info className="shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-sm">การเปิดรับสมัครปิดอยู่</h4>
            <p className="text-xs text-gray-400 mt-1">ผู้จัดทัวร์นาเมนต์ได้ทำการปิดสิทธิ์การรับสมัครชั่วคราว หรือขณะนี้การคัดเลือกเสร็จสิ้นแล้ว</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-[#00dbe7]/10 border border-[#00dbe7]/40 p-4 rounded-xl flex items-start gap-3 text-[#00dbe7]">
          <Award className="shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-sm">ส่งข้อมูลสมัครเรียบร้อยแล้ว!</h4>
            <p className="text-xs text-gray-300 mt-1">ทีมของคุณได้รับการจัดเก็บลงระบบและพร้อมสำหรับจัดสายการแข่งขันแล้ว ตรวจสอบสถิติมุมมองทีมในหน้าตารางคะแนนได้ทันที</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#161b22]/90 border border-white/10 rounded-2xl p-6 md:p-8 space-y-8 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00dbe7] to-[#ff571a]" />

        {/* Game Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
            เลือกรอบการแข่งขัน (Game Mode)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled={!isRegistrationOpen}
              onClick={() => setGame('ROV')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                game === 'ROV'
                  ? 'bg-[#00dbe7]/10 border-[#00dbe7] text-[#00dbe7] shadow-[0_0_15px_rgba(0,219,231,0.2)]'
                  : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <span className="text-2xl">🔵</span>
              <span className="font-bold text-sm">ROV PRO LEAGUE</span>
            </button>
            
            <button
              type="button"
              disabled={!isRegistrationOpen}
              onClick={() => setGame('Free Fire')}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                game === 'Free Fire'
                  ? 'bg-[#ff571a]/10 border-[#ff571a] text-[#ff571a] shadow-[0_0_15px_rgba(255,87,26,0.2)]'
                  : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <span className="text-2xl">🟠</span>
              <span className="font-bold text-sm">FREE FIRE CUP</span>
            </button>
          </div>
        </div>

        {/* Team Core Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-gray-400 uppercase">
              ชื่อทีมแข่งขัน (Team Name)
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                disabled={!isRegistrationOpen}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น NEON TIGERS"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#00dbe7] text-sm font-sans"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-gray-400 uppercase">
              ชื่อหัวหน้าทีม / กัปตันทีม (Captain Name)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                disabled={!isRegistrationOpen}
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                placeholder="ชื่อเรียกในเกมหรือชื่อจริง"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#00dbe7] text-sm font-sans"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-gray-400 uppercase">
              UID ประจำเกมของกัปตันทีม
            </label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                disabled={!isRegistrationOpen}
                value={gameUid}
                onChange={(e) => setGameUid(e.target.value)}
                placeholder="เช่น 1234567890 (เพื่อส่งรางวัล)"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#00dbe7] text-sm font-mono"
              />
            </div>
          </div>

          {/* Logo Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-gray-400 uppercase">
              ตราสัญลักษณ์ประจำทีม (Team Logo Icon)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLogoType('emoji')}
                className={`px-3 py-1 text-xs rounded border ${logoType === 'emoji' ? 'bg-[#00dbe7]/10 border-[#00dbe7] text-[#00dbe7]' : 'border-white/10 text-gray-400'}`}
              >
                Emoji Icon
              </button>
              <button
                type="button"
                onClick={() => setLogoType('url')}
                className={`px-3 py-1 text-xs rounded border ${logoType === 'url' ? 'bg-[#00dbe7]/10 border-[#00dbe7] text-[#00dbe7]' : 'border-white/10 text-gray-400'}`}
              >
                Custom URL
              </button>
            </div>
            
            {logoType === 'emoji' ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {PREDEFINED_LOGOS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    disabled={!isRegistrationOpen}
                    onClick={() => setLogo(em)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      logo === em ? 'bg-[#00dbe7]/25 border-2 border-[#00dbe7]' : 'bg-black/30 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                disabled={!isRegistrationOpen}
                value={customLogoUrl}
                onChange={(e) => setCustomLogoUrl(e.target.value)}
                placeholder="วางลิงก์รูปภาพ เช่น https://example.com/logo.png"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#00dbe7] text-xs font-mono"
              />
            )}
          </div>
        </div>

        {/* Players Roster */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase border-b border-white/5 pb-2">
            รายชื่อสมาชิกในทีม (5 ผู้เล่นหลัก + 1 ตัวสำรอง)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400">
                  ผู้เล่นตัวจริงคนที่ {num} *
                </label>
                <input
                  type="text"
                  disabled={!isRegistrationOpen}
                  required
                  value={(players as any)[`player${num}`]}
                  onChange={(e) => handlePlayerChange(`player${num}`, e.target.value)}
                  placeholder={`ชื่อหรือ UID คนที่ ${num}`}
                  className="w-full bg-black/30 border border-white/5 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#00dbe7] text-xs font-sans"
                />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400">
                ผู้เล่นสำรอง (Substitute) (ถ้ามี)
              </label>
              <input
                type="text"
                disabled={!isRegistrationOpen}
                value={players.substitute}
                onChange={(e) => handlePlayerChange('substitute', e.target.value)}
                placeholder="ชื่อผู้เล่นสำรอง"
                className="w-full bg-black/30 border border-white/5 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#00dbe7] text-xs font-sans"
              />
            </div>
          </div>
        </div>

        {/* Contact Channels */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase border-b border-white/5 pb-2">
            ช่องทางการติดต่อประสานงาน
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400">DISCORD</label>
              <div className="relative">
                <Send className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="text"
                  disabled={!isRegistrationOpen}
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  placeholder="เช่น user#1234"
                  className="w-full bg-black/30 border border-white/5 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:border-[#00dbe7] text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400">FACEBOOK</label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="text"
                  disabled={!isRegistrationOpen}
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="ลิงก์โปรไฟล์หรือชื่อเฟส"
                  className="w-full bg-black/30 border border-white/5 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:border-[#00dbe7] text-xs font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400">LINE ID</label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  type="text"
                  disabled={!isRegistrationOpen}
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  placeholder="ไลน์ไอดีติดต่อ"
                  className="w-full bg-black/30 border border-white/5 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:border-[#00dbe7] text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isRegistrationOpen}
          className={`w-full py-3 rounded-xl font-sans font-bold text-sm tracking-wide transition-all ${
            isRegistrationOpen
              ? 'bg-gradient-to-r from-[#00dbe7] to-[#ff571a] text-black hover:scale-[1.01] hover:brightness-110 shadow-[0_0_20px_rgba(0,219,231,0.3)] cursor-pointer'
              : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
          }`}
        >
          {isRegistrationOpen ? '🚀 ส่งข้อมูลสมัครเข้าร่วมการแข่งขัน' : '🔒 ปิดรับสมัครทีมแล้ว'}
        </button>
      </form>
    </div>
  );
}
export { RegistrationView };
