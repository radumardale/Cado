import { Model } from 'mongoose';
import { HomeBannerInterface } from '@/models/home_banner/types/HomeBannerInterface';
import { ProductInterface } from '@/models/product/types/productInterface';
import { BlogInterface } from '@/models/blog/types/BlogInterface';
import { OrderInterface } from '@/models/order/types/orderInterface';
import { ClientInterface } from '@/models/client/types/clientInterface';
import { HomeOcasionI } from '@/models/homeOcasion/types/HomeOcasionI';

declare module 'mongoose' {
  interface Models {
    HomeBanner: Model<HomeBannerInterface>;
    HomeOcasion: Model<HomeOcasionI>;
    Product: Model<ProductInterface>;
    Blog: Model<BlogInterface>;
    Order: Model<OrderInterface>;
    Client: Model<ClientInterface>;
  }
}