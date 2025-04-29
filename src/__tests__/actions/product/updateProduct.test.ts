import { StockState } from "@/lib/enums/StockState";
import { appRouter } from "@/server";
import { assert, test } from "vitest";

test.skip("update products", async () => {
    // Create a tRPC caller
    const caller = appRouter.createCaller({});
    
    // 1. Get all products
    const productsResponse = await caller.products.getAllProducts();
    
    // Check if products were retrieved successfully
    assert(productsResponse.success === true, "Failed to get products");
    assert(productsResponse.products && productsResponse.products.length > 0, "No products found");
    
    // 2. Track success count
    let successCount = 0;
    
    // 3. Update each product's price
    for (const product of productsResponse.products) {
        const productId = product._id.toString();
        
        const updateRes = await caller.products.updateProduct({
            id: productId,
            data: { 
                title: product.title,
                description: product.description,
                long_description: product.long_description,
                price: product.price,
                ocasions: product.ocasions,
                categories: product.categories,
                product_content: product.product_content,
                stock_availability: {
                    stock: 100,
                    state: StockState.IN_STOCK
                },
                image_description: product.image_description,
                nr_of_items: product.nr_of_items,
                sale: product.sale
            }
        });
        
        // Verify update was successful
        if (updateRes.success) {
            successCount++;
        }
    }
    
    // 4. Verify all products were updated successfully
    assert(successCount === productsResponse.products.length, 
        `Not all products were updated successfully: ${successCount}/${productsResponse.products.length}`);
    
    console.log(`Successfully updated prices for ${successCount} products`);
});