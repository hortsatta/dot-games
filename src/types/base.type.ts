export type BaseColumns = {
  id: number;
  createdAt: string;
  isActive: boolean;
};

export type BaseOrderBy<T> = {
  columnName: keyof T;
  ascending?: boolean;
};

export type BaseJsonDb = { [key: string]: any };
