export type WishListDb = {
  Row: {
    id: number;
    created_at: string;
    game_product: string;
    user_id: string;
  };
  Insert: {
    id?: number;
    created_at?: string;
    game_product: string;
    user_id: string;
  };
  Update: {
    id?: number;
    created_at?: string;
    game_product?: string;
    user_id?: string;
  };
};
