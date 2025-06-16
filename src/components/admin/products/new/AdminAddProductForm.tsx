import {
    Form,
  } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { StockState } from '@/lib/enums/StockState'
import { useTRPC } from '@/app/_trpc/client'
import { LoaderCircle } from 'lucide-react'
import { addProductRequestSchema } from "@/lib/validation/product/addProductRequest"
import AdminProductDetails from "@/components/admin/products/AdminProductDetails"
import AdminProductImages from "@/components/admin/products/AdminProductImages"
import { useRouter } from "@/i18n/navigation"

import { useMutation } from "@tanstack/react-query";

export default function AdminAddProductForm() {
    const trpc = useTRPC();
    const {isSuccess, mutate, data, isPending} = useMutation(trpc.products.createProduct.mutationOptions());
    const { mutate: UpdateMutate, isSuccess: UpdateIsSuccess, error } = useMutation(trpc.image.uploadProductImages.mutationOptions());
    const router = useRouter();
    const [imagesData, setImagesData] = useState<string[]>([]);

    // triggers when form is submitted
    useEffect(() => {
        const uploadImagesInOrder = async () => {
            if (isSuccess && data.product?._id) {
                
                const newImageKeys = [];
                
                // Upload images sequentially to maintain order
                for (let i = 0; i < data.imagesLinks.length; i++) {
                    try {
                        const dataUrl = data.imagesLinks[i];
                        const imageData = imagesData[i];
                        
                        // Convert base64 to Buffer
                        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
                        const buf = Buffer.from(base64Data, 'base64');
    
                        // Upload to S3
                        const response = await fetch(dataUrl, {
                            method: 'PUT',
                            body: buf
                        });
                        
                        // Extract key from URL
                        const extractedKey = dataUrl.split('.com/')[1]?.split('?')[0];
    
                        if (response.ok && extractedKey) {
                            newImageKeys.push(extractedKey);
                        } else {
                            console.error(`Failed to upload image ${i+1}`);
                        }
                    } catch (error) {
                        console.error(`Error uploading image ${i+1}:`, error);
                    }
                }
                
                // Update product with all image keys in the correct order
                if (newImageKeys.length === data.imagesLinks.length) {
                    UpdateMutate({
                        id: data.product._id, 
                        filenames: newImageKeys
                    });
                }
            }
        };
    
        // Call the async function
        if (isSuccess && data.product?._id) {
            uploadImagesInOrder();
        }
    }, [isSuccess, data, imagesData]);


    useEffect(() => {
        if (UpdateIsSuccess && data?.product?.custom_id) {
            router.push({pathname: "/admin/products/[id]", params: {id: data?.product?.custom_id}})
        }
    }, [UpdateIsSuccess, data?.product?.custom_id, router]);


    const form = useForm<z.infer<typeof addProductRequestSchema>>({
        resolver: zodResolver(addProductRequestSchema),
        defaultValues: {
            data: {
                title: { ro: "", ru: "", en: "" },
                description: { ro: "", ru: "", en: "" },
                long_description: { ro: "", ru: "", en: "" },
                image_description: { ro: "", ru: "", en: "" },
                set_description: { ro: "", ru: "", en: "" },
                price: 1000,
                imagesNumber: 0,
                nr_of_items: 1,
                categories: [],
                ocasions: [],
                product_content: [],
                stock_availability: {
                    stock: 5,
                    state: StockState.IN_STOCK
                },
                sale: {
                    active: false,
                    sale_price: 0
                },
                optional_info: {
                    weight: "",
                    dimensions: "",
                    color: { ro: "", ru: "", en: "" },
                    material: { ro: "", ru: "", en: "" },
                }
            }
        }
    });

    function onSubmit(values: z.infer<typeof addProductRequestSchema>) {
        if (isPending) return;
        // if(!UpdateIsSuccess) {
        //     console.log(error)
        //     return;
        // }
        mutate(values);
    }

    return (
        <>
            {
                UpdateIsSuccess &&
                <div className='fixed top-0 left-0 w-full h-full bg-pureblack/25 z-10 items-center justify-center'>
                    <div className="flex items-center justify-center h-full w-full">
                        <LoaderCircle className='animate-spin text-white size-20' />
                    </div>
                </div>
            }
            <Form {...form}>
                <form 
                    id="update-product-form" 
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className="col-span-12 grid grid-cols-12 flex-1 overflow-auto gap-x-6">
                    <div data-lenis-prevent className='col-span-7 grid grid-cols-7 overflow-y-auto flex-1 -mr-6 pr-6 mt-16 scroll-bar-custom'>
                        <AdminProductDetails />
                    </div>
                    <AdminProductImages product={null} imagesData={imagesData} initialImagesData={[]} setImagesData={setImagesData}/>
                </form>
            </Form>
        </>
    );
}
