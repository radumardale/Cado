import { BlogTags } from '@/lib/enums/BlogTags';
import { ProductInfo } from '@/models/product/types/productInfo';
import { SectionInterface } from './SectionInterface';
import { SectionImagesInterface } from './SectionImagesInterface';

export interface BlogInterface {
  _id: string;
  title: ProductInfo;
  image: string;
  tag: BlogTags;
  date: Date;
  reading_length: number;
  sections: SectionInterface[];
  section_images: SectionImagesInterface[];
}

export interface OptimizedBlogInterface {
  _id: string;
  title: ProductInfo;
  image: string;
  tag: BlogTags;
  date: Date;
}
