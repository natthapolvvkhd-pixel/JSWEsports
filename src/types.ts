export type GameType = 'ROV' | 'Free Fire';

export interface Team {
  id: string;
  name: string;
  logo: string; // URL or predefined logo index
  captainName: string;
  gameUid: string;
  roster: {
    player1: string;
    player2: string;
    player3: string;
    player4: string;
    player5: string;
    substitute: string;
  };
  contact: {
    discord?: string;
    facebook?: string;
    line?: string;
  };
  game: GameType;
  stats: {
    played: number;
    wins: number;
    losses: number;
    kills: number; // For Free Fire
    placementPoints: number; // For Free Fire
    totalPoints: number; // For Free Fire / Overall
  };
  registeredAt: string;
}

export type BracketType = 'Single Elimination' | 'Double Elimination' | 'Round Robin';

export interface Match {
  id: string;
  roundId: string; // e.g., 'QF', 'SF', 'GF', 'L1', 'L2' etc.
  roundName: string; // e.g., 'Quarter Finals', 'Semi Finals', 'Grand Finals'
  teamAId: string | null; // null represents TBD
  teamBId: string | null;
  scoreA: number | null;
  scoreB: number | null;
  winnerId: string | null;
  loserId: string | null;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
  nextMatchId: string | null; // target match ID for the winner
  isUpperBracket: boolean;
  scheduledTime?: string;
}

export interface FreeFireRoundInput {
  id: string;
  teamId: string;
  kills: number;
  placement: number; // 1 to 12
  points: number; // Calculated points
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Major Update' | 'Event' | 'Announcement';
  date: string;
}

export interface LiveStream {
  id: string;
  title: string;
  url: string; // YouTube/FB/TikTok embed or share URL
  platform: 'youtube' | 'facebook' | 'tiktok';
  isLive: boolean;
}

export interface TournamentConfig {
  id: string;
  name: string;
  game: GameType;
  bracketType: BracketType;
  isOpen: boolean;
  prizePool: string;
}
