import { BaseColumns } from './base.type';

export type UserAccount = BaseColumns & {
  userId?: string;
  avatarType?: number | null;
  avatarImageUrl?: string | null;
  displayName?: string | null;
  fullName?: string;
  email?: string;
};
