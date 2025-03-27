import { router } from '../../trpc';
import { deleteImageProcedure } from '../image/deleteImage';
import { uploadImageProcedure } from '../image/uploadImage';

export const imageRouter = router({
    deleteImage: deleteImageProcedure,
    updateImage: uploadImageProcedure,
});