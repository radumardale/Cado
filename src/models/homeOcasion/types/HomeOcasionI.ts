import { Ocasions } from '@/lib/enums/Ocasions';
import { ProductInfo } from '@/models/product/types/productInfo';

export interface HomeOcasionI {
  _id: string;
  title: ProductInfo;
  ocasion: Ocasions;
}
