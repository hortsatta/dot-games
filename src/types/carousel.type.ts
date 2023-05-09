import { BaseJsonDb } from './base.type';

export type CarouselDb = {
  Row: {
    id: number;
    created_at: string;
    is_active: boolean;
    content: BaseJsonDb | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    content?: BaseJsonDb | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    content?: BaseJsonDb | null;
  };
};
