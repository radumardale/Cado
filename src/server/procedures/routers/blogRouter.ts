import { router } from '../../trpc';
import { getBlogProcedure } from "../blog/getBlog";
import { addBlogProcedure } from "../blog/addBlog";
import { updateBlogProcedure } from "../blog/updateBlog";
import { deleteBlogProcedure } from "../blog/deleteBlog";
import { getLimitedBlogsProcedure } from '../blog/getLimitedBlogs';
import { getAllBlogsProcedure } from '../blog/getAllBlogsProcedure';

export const blogRouter = router({
    getLimitedBlogs: getLimitedBlogsProcedure,
    getAllBlogs: getAllBlogsProcedure,
    getBlogById: getBlogProcedure,
    createBlog: addBlogProcedure,
    updateBlog: updateBlogProcedure,
    deleteBlog: deleteBlogProcedure
});