export type JsonDb =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonDb }
  | JsonDb[];
