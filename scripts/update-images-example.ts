import { appRouter } from '@/server';

/**
 * Example script for updating images in the database.
 * This demonstrates how to update blog or product images.
 *
 * Usage: Modify the image data and IDs below, then run:
 * npx tsx scripts/update-images-example.ts
 *
 * Note: You'll need to import actual image data or provide base64 strings.
 */
async function updateImagesExample() {
  try {
    const caller = appRouter.createCaller({});

    console.log('🖼️  Updating images...\n');

    // Example: Update a blog image
    // Replace with actual image data and ID
    const imageId = 'YOUR_IMAGE_ID_HERE';
    const destination = 'BLOG'; // or 'PRODUCT'
    const imageData = 'data:image/png;base64,...'; // Your base64 image data

    console.log(`Updating image ${imageId}...`);

    await caller.image.updateImage({
      id: imageId,
      destination: destination,
      image: imageData,
    });

    console.log('✅ Image updated successfully!\n');

    // Add more image updates as needed
    // await caller.image.updateImage({ ... });

    console.log('✅ All images updated!');
  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
}

updateImagesExample()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
