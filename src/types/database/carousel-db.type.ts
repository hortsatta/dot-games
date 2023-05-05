import type { JsonDb } from './json-db.type';

export type CarouselDb = {
  Row: {
    id: number;
    created_at: string;
    is_active: boolean;
    content: JsonDb | null;
  };
  Insert: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    content?: JsonDb | null;
  };
  Update: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    content?: JsonDb | null;
  };
};
