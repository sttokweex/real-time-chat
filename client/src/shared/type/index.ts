import { QueryObserverResult } from '@tanstack/react-query';

export interface Message {
  id: number;
  channel_id: string;
  message: string;
  username: string;
  timestamp: string;
}

export interface Channel {
  id: number;
  name: string;
  creator: string;
}
export interface TokenData {
  token: string;
  exp: number;
}
export interface User {
  username: string;
  role: string;
  id: string;
}
export interface Refetch {
  (options?: {
    throwOnError?: boolean;
    cancelRefetch?: boolean;
  }): Promise<QueryObserverResult<User | undefined, unknown>>;
}
