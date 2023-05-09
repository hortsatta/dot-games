export type BaseColumns = {
  id: number;
  createdAt: string;
  isActive: boolean;
};

export type BaseJsonDb =
  | string
  | number
  | boolean
  | null
  | { [key: string]: BaseJsonDb }
  | BaseJsonDb[];
