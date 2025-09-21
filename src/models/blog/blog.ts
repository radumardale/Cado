import mongoose from 'mongoose';
import { ProductInfoSchema } from '../product/types/productInfo';
import { BlogInterface } from './types/BlogInterface';
import { BlogTags } from '@/lib/enums/BlogTags';
import { SectionSchema } from './types/SectionInterface';
import { SectionImagesSchema } from './types/SectionImagesInterface';

// Product Schema
const BlogSchema = new mongoose.Schema<BlogInterface>({
  title: {
    type: ProductInfoSchema,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    enum: BlogTags,
    required: true,
  },
  date: {
    type: Date,
    required: false,
    default: new Date(),
  },
  sections: {
    type: [SectionSchema],
    required: true,
  },
  section_images: {
    type: [SectionImagesSchema],
    required: true,
    default: [],
  },
});

const Blog = mongoose.models.Blog || mongoose.model<BlogInterface>('Blog', BlogSchema);

export { Blog };
