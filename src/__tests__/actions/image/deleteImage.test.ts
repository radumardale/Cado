import { appRouter } from '@/server';
import { test } from 'vitest';

test.skip('deleteImage', async () => {
  const caller = appRouter.createCaller({});

  await caller.image.deleteImage({
    id: '67f63c3a8c5badf784225b1c',
    destination: 'BLOG',
    image: 'https://d3rus23k068yq9.cloudfront.net/BLOG/67f63c3a8c5badf784225b1c/d96337b6.png',
  });

  await caller.image.deleteImage({
    id: '67f63c3b8c5badf784225b26',
    destination: 'BLOG',
    image: 'https://d3rus23k068yq9.cloudfront.net/BLOG/67f63c3b8c5badf784225b26/2cb89404.png',
  });

  await caller.image.deleteImage({
    id: '67f63c3b8c5badf784225b30',
    destination: 'BLOG',
    image: 'https://d3rus23k068yq9.cloudfront.net/BLOG/67f63c3b8c5badf784225b30/c8880e19.png',
  });

  await caller.image.deleteImage({
    id: '67f63c3b8c5badf784225b39',
    destination: 'BLOG',
    image: 'https://d3rus23k068yq9.cloudfront.net/BLOG/67f63c3b8c5badf784225b39/ea8e9a22.png',
  });
});
