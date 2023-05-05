import type { AddressDb } from './address-db.type';
import type { CarouselDb } from './carousel-db.type';
import type { CartDb } from './cart-db.type';
import type { FavoriteDb } from './favorite-db.type';
import type { GameDb } from './game-db.type';
import type { GameProductDb } from './game-product-db.type';
import type { GenreDb } from './genre-db.type';
import type { OrderDb } from './order-db.type';
import type { UserAccountDb } from './user-account-db.type';

export type Database = {
  public: {
    Tables: {
      address: AddressDb;
      carousel: CarouselDb;
      cart: CartDb;
      favorite: FavoriteDb;
      game: GameDb;
      game_product: GameProductDb;
      genre: GenreDb;
      order: OrderDb;
      user_account: UserAccountDb;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
