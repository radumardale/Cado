import { test } from 'vitest';
// import { imageUploadResponseInterface, uploadImage } from '@/actions/image/uploadImage';
import { appRouter } from '@/server';
import { image as image1 } from './testImage';
import { image as image2 } from './testImage2';
import { image as image3 } from './testImage3';
import { image as image4 } from './testImage4';

test.skip('uploadImage', async () => {
  const caller = appRouter.createCaller({});

  await caller.image.updateImage({
    id: '67fff88f619441448665e2ab',
    destination: 'BLOG',
    image: image1,
  });

  await caller.image.updateImage({
    id: '67fff890619441448665e2b5',
    destination: 'BLOG',
    image: image2,
  });

  await caller.image.updateImage({
    id: '67fff890619441448665e2c2',
    destination: 'BLOG',
    image: image3,
  });

  await caller.image.updateImage({
    id: '67fff890619441448665e2ce',
    destination: 'BLOG',
    image: image4,
  });

  // expectTypeOf(res).toEqualTypeOf<imageUploadResponseInterface>();
});
