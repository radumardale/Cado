import { router } from '../../trpc';
import { deleteImageProcedure } from '../image/deleteImage';
import { uploadBannerImageProcedure } from '../image/uploadBannerImage';
import { UploadBlogImagesProcedure } from '../image/uploadBlogImages';
import { UploadProductImagesProcedure } from '../image/uploadProductImages';

export const imageRouter = router({
  deleteImage: deleteImageProcedure,
  uploadProductImages: UploadProductImagesProcedure,
  uploadBlogImages: UploadBlogImagesProcedure,
  uploadBannerImage: uploadBannerImageProcedure,
});
