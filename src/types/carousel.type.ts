import type { BaseJsonDb } from './base.type';
import type { GameProduct } from './game-product.type';

export type CarouseImage = {
  url: string;
  name?: string;
};

export type CarouselGameProduct = GameProduct & {
  imageUrl: string;
};

export type CarouselImageContent = {
  type: 'image';
  image: CarouseImage;
  excerpt?: string;
};

export type CarouselGameProductContent = {
  type: 'game';
  gameProduct: CarouselGameProduct;
  excerpt?: string;
};

export type CarouselItem = {
  content: CarouselImageContent | CarouselGameProductContent;
  index?: number;
};

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
