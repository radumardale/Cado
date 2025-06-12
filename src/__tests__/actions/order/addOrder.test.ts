/* eslint-disable  @typescript-eslint/no-explicit-any */

import { test } from "vitest";

test.skip("addOrder", async () => {

    await updateProductImageDomains()
})

// scripts/updateProductImageDomains.ts
import { Product } from '@/models/product/product';
import connectMongo from "@/lib/connect-mongo";

const OLD_DOMAIN = 'd3rus23k068yq9.cloudfront.net';
const NEW_DOMAIN = 'd3rus23k068yq9.cloudfront.net';

interface UpdateResult {
  success: boolean;
  updatedCount: number;
  errors: string[];
  details: Array<{
    productId: string;
    title: string;
    fieldsUpdated: string[];
  }>;
}

async function updateProductImageDomains(): Promise<UpdateResult> {
  const result: UpdateResult = {
    success: false,
    updatedCount: 0,
    errors: [],
    details: []
  };

  try {
    await connectMongo();
    console.log('Connected to MongoDB');

    // Get all products
    const products = await Product.find({}).lean();
    console.log(`Found ${products.length} products to process`);

    for (const product of products) {
      try {
        const updates: any = {};
        const fieldsUpdated: string[] = [];

        // Update images array
        if (product.images && Array.isArray(product.images)) {
          const updatedImages = product.images.map((image: string, imageIndex: number) => {
            if (image && image.includes(OLD_DOMAIN)) {
              fieldsUpdated.push(`images[${imageIndex}]`);
              return image.replace(OLD_DOMAIN, NEW_DOMAIN);
            }
            return image;
          });

          // Only update if there were changes
          if (fieldsUpdated.some(field => field.startsWith('images['))) {
            updates.images = updatedImages;
          }
        }

        // Update content fields that might contain images
        const contentFields = ['content', 'long_description', 'short_description'];
        contentFields.forEach(field => {
          if ((product as any)[field]) {
            // Handle multilingual content
            if (typeof (product as any)[field] === 'object') {
              const updatedContent: any = {};
              let hasContentUpdates = false;

              Object.keys((product as any)[field]).forEach(lang => {
                if (typeof (product as any)[field][lang] === 'string' && (product as any)[field][lang].includes(OLD_DOMAIN)) {
                  updatedContent[lang] = (product as any)[field][lang].replace(new RegExp(OLD_DOMAIN, 'g'), NEW_DOMAIN);
                  hasContentUpdates = true;
                  fieldsUpdated.push(`${field}.${lang}`);
                } else {
                  updatedContent[lang] = (product as any)[field][lang];
                }
              });

              if (hasContentUpdates) {
                updates[field] = updatedContent;
              }
            }
            // Handle string content
            else if (typeof (product as any)[field] === 'string' && (product as any)[field].includes(OLD_DOMAIN)) {
              updates[field] = (product as any)[field].replace(new RegExp(OLD_DOMAIN, 'g'), NEW_DOMAIN);
              fieldsUpdated.push(field);
            }
          }
        });

        // Apply updates if any
        if (Object.keys(updates).length > 0) {
          await Product.findByIdAndUpdate(product._id, updates);
          result.updatedCount++;
          result.details.push({
            productId: product._id.toString(),
            title: product.title?.ro || product.title?.en || 'Unknown',
            fieldsUpdated
          });

          console.log(`✅ Updated product: ${product.title?.ro || product._id} (${fieldsUpdated.length} fields)`);
        } else {
          console.log(`⏭️  No updates needed for product: ${product.title?.ro || product._id}`);
        }

      } catch (error) {
        const errorMsg = `Failed to update product ${product._id}: ${error}`;
        result.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    result.success = result.errors.length === 0;
    console.log(`\n📊 Update Summary:`);
    console.log(`✅ Successfully updated: ${result.updatedCount} products`);
    console.log(`❌ Errors: ${result.errors.length}`);
    
    return result;

  } catch (error) {
    const errorMsg = `Database connection or query failed: ${error}`;
    result.errors.push(errorMsg);
    console.error(`❌ ${errorMsg}`);
    return result;
  }
}
