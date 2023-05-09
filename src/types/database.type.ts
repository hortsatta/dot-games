import type { AddressDb } from './address.type';
import type { CarouselDb } from './carousel.type';
import type { CartDb } from './cart.type';
import type { FavoriteDb } from './favorite.type';
import type { GameDb } from './game.type';
import type { GameProductDb } from './game-product.type';
import type { GenreDb } from './genre.type';
import type { OrderDb } from './order.type';
import type { UserAccountDb } from './user-account.type';

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
