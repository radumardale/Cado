import { router } from '../../trpc';
import { deleteImageProcedure } from '../image/deleteImage';
import { UploadBlogImagesProcedure } from '../image/uploadBlogImages';
import { UploadProductImagesProcedure } from '../image/uploadProductImages';

export const imageRouter = router({
    deleteImage: deleteImageProcedure,
    uploadProductImages: UploadProductImagesProcedure,
    uploadBlogImages: UploadBlogImagesProcedure
});