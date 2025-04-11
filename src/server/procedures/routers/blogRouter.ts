import { router } from '../../trpc';
import { getBlogProcedure } from "../blog/getBlog";
import { addBlogProcedure } from "../blog/addBlog";
import { updateBlogProcedure } from "../blog/updateBlog";
import { deleteBlogProcedure } from "../blog/deleteBlog";
import { getLimitedBlogsProcedure } from '../blog/getLimitedBlogs';

export const blogRouter = router({
    getLimitedBlogs: getLimitedBlogsProcedure,
    getBlogById: getBlogProcedure,
    createBlog: addBlogProcedure,
    updateBlog: updateBlogProcedure,
    deleteBlog: deleteBlogProcedure
});