import mongoose from "mongoose";
import { ProductInfoSchema } from "../product/types/productInfo";
import { BlogInterface } from "./types/BlogInterface";
import { BlogTags } from "@/lib/enums/BlogTags";
import { SectionSchema } from "./types/SectionInterface";

// Product Schema
const BlogSchema = new mongoose.Schema<BlogInterface>({
  title: {
    type: ProductInfoSchema,
    required: true,
  },
  image: {
    type: String,
    default: ""
  },
  tag: {
    type: String,
    enum: BlogTags,
    required: true,
  },
  date: {
    type: Date,
    required: false
  },
  reading_length: {
    type: Number,
    required: true,
  },
  sections: {
    type: [SectionSchema],
    required: true,
  },
});

const Blog = mongoose.models.Blog || mongoose.model<BlogInterface>("Blog", BlogSchema);

export { Blog };