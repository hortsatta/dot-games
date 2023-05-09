import { BaseColumns } from './base.type';

export type UserAccount = BaseColumns & {
  userId?: string;
  avatarType?: number | null;
  avatarImageUrl?: string | null;
  displayName?: string | null;
  fullName?: string;
  email?: string;
};

export type UserAccountDb = {
  Row: {
    id: number;
    created_at: string;
    is_active: boolean;
    user_id: string;
    avatar_type: number | null;
    avatar_image_url: string | null;
    display_name: string | null;
    full_name: string;
  };
  Insert: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    user_id: string;
    avatar_type?: number | null;
    avatar_image_url?: string | null;
    display_name?: string | null;
    full_name: string;
  };
  Update: {
    id?: number;
    created_at?: string;
    is_active?: boolean;
    user_id?: string;
    avatar_type?: number | null;
    avatar_image_url?: string | null;
    display_name?: string | null;
    full_name?: string;
  };
};
