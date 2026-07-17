import { Flame, Trophy, ShieldAlert, Award, Radio } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isFirebaseDemoVisible: boolean;
  setFirebaseDemoVisible: (visible: boolean) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  isFirebaseDemoVisible,
  setFirebaseDemoVisible
}: NavbarProps) {
  const navItems = [
    { id: 'home', name: 'Home', icon: Flame },
    { id: 'registration', name: 'Tournaments', icon: Trophy },
    { id: 'brackets', name: 'Brackets', icon: Award },
    { id: 'standings', name: 'Standings', icon: Radio },
    { id: 'admin', name: 'Admin', icon: ShieldAlert },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#10131a]/90 backdrop-blur-md border-b border-white/10 shadow-[0_0_15px_rgba(0,219,231,0.15)] h-20 flex justify-between items-center px-4 md:px-10">
      <div className="flex items-center gap-4 md:gap-10">
        <span 
          className="font-sans font-extrabold text-2xl md:text-3xl tracking-tighter text-[#00dbe7] cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setActiveTab('home')}
        >
          ARENA OPS
        </span>
        
        <div className="hidden md:flex items-center gap-6 font-mono text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 py-1 px-2.5 rounded transition-all duration-300 group ${
                  isActive 
                    ? 'text-[#00dbe7] font-bold' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#00dbe7]' : 'text-gray-400 group-hover:text-white'} />
                {item.name}
                {isActive && (
                  <span className="absolute bottom-[-10px] left-0 right-0 h-[2px] bg-[#00dbe7] shadow-[0_0_8px_rgba(0,219,231,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Firebase Config Indicator */}
        <button 
          onClick={() => setFirebaseDemoVisible(!isFirebaseDemoVisible)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold bg-[#ff571a]/10 hover:bg-[#ff571a]/20 border border-[#ff571a]/30 text-[#ff571a] rounded transition-all"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff571a] animate-pulse" />
          Firebase v9 Code Ready
        </button>

        {/* Mobile Nav Button */}
        <div className="md:hidden flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-1.5 rounded text-xs ${
                  isActive ? 'text-[#00dbe7] bg-white/5' : 'text-gray-400'
                }`}
              >
                <item.icon size={18} />
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('admin')} 
            className="p-1.5 text-gray-400 hover:text-[#00dbe7] hover:bg-white/5 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-[#161b22] border border-[#00dbe7]/30 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
            <span className="material-symbols-outlined text-gray-300">account_circle</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
