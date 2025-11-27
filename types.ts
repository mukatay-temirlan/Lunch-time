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

// Telegram WebApp Types
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date?: string;
          hash?: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
      };
    };
  }
}
