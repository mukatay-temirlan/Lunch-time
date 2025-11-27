export enum VoteOption {
  YES = 'YES',
  NO = 'NO',
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface VoteRecord {
  userId: string;
  userName: string;
  option: VoteOption;
  timestamp: number;
  changesMade: number; // Track how many times they changed their mind
}

export interface PollState {
  isOpen: boolean;
  votes: VoteRecord[];
}

// Minimal type definition for Telegram WebApp
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        colorScheme: 'light' | 'dark';
      };
    };
  }
}