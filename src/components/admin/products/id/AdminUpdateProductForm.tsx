'use client';
import {
    Form,
  } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { updateProductRequestSchema } from '@/lib/validation/product/updateProductRequest'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { StockState } from '@/lib/enums/StockState'
import AdminProductDetails from '../AdminProductDetails'
import AdminProductImages from '../AdminProductImages'
import { useTRPC } from '@/app/_trpc/client'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { revalidateServerPath } from "@/server/actions/revalidateServerPath";

interface AdminProductFormProps {
    id: string
}

export default function AdminUpdateProductForm({id}: AdminProductFormProps) {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.products.getProductById.queryOptions({id: id}));
    const {isSuccess, isPending, mutate, data: MutatedData} = useMutation(trpc.products.updateProduct.mutationOptions());
    const { mutate: UpdateMutate, isSuccess: UpdateIsSuccess, data: UpdateData } = useMutation(trpc.image.uploadProductImages.mutationOptions());
    const [initialImagesData, setInitialImagesData] = useState<string[]>([]);
    const [imagesData, setImagesData] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof updateProductRequestSchema>>({
        resolver: zodResolver(updateProductRequestSchema),
        defaultValues: {
            id: data?.product?._id,
            data: {
                title: { ro: "", ru: "", en: "" },
                description: { ro: "", ru: "", en: "" },
                long_description: { ro: "", ru: "", en: "" },
                image_description: { ro: "", ru: "", en: "" },
                set_description: { ro: "", ru: "", en: "" },
                price: 1000,
                imagesNumber: 0,
                imagesChanged: false,
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

    useEffect(() => {
        // Define an async function for sequential uploads
        const uploadImagesInOrder = async () => {
            if (isSuccess && MutatedData) {
                const newImageKeys = [];
                
                // Upload images sequentially to maintain order
                let j = 0;
                for (let i = 0; i < imagesData.length; i++) {
                    if (imagesData[i].startsWith("https")) {
                        const extractedKey = imagesData[i].split('.net/')[1]?.split('?')[0];
                        newImageKeys.push(extractedKey);
                        continue;
                    }

                    try {
                        const dataUrl = MutatedData.imagesLinks[j];
                        j++;
                        const imageData = imagesData[i];
                        
                        if (!dataUrl || !imageData) {
                            console.error(`Missing data for image ${i+1}`);
                            continue;
                        }
                        
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
                            console.error(`Failed to upload image ${i+1}: ${response.statusText}`);
                        }
                    } catch (error) {
                        console.error(`Error uploading image ${i+1}:`, error);
                    }
                }
                
                // Update product with image keys if all uploads succeeded
                if (newImageKeys.length > 0) {
                    // If we have the product ID, update the images
                    if (MutatedData.product?._id) {
                        UpdateMutate({
                            id: MutatedData.product._id,
                            filenames: newImageKeys
                        });
                    }
                }
                
                // Reset form with updated product data
                form.reset({
                    id: MutatedData.product?._id,
                    data: {
                        ...MutatedData.product
                    }
                });
                form.resetField("data.imagesChanged");
                form.resetField("data.imagesNumber");
            }
        };
    
        // Call the async function if we have successful mutation
        if (isSuccess && MutatedData) {
            uploadImagesInOrder();
        }
    }, [isSuccess, MutatedData, form]);

    useEffect(() => {
        if (UpdateIsSuccess) {
            toast.success("Produsul a fost actualizat cu succes!");
            setInitialImagesData(UpdateData.images || []);
            revalidateServerPath(`/ro/catalog/product/${data?.product?.custom_id}`);
            revalidateServerPath(`/ru/catalog/product/${data?.product?.custom_id}`);
            revalidateServerPath(`/en/catalog/product/${data?.product?.custom_id}`);
            
            const myQueryKey = trpc.products.getProductById.queryKey({id: data?.product?.custom_id});
            queryClient.invalidateQueries({queryKey: myQueryKey});
        }
    }, [UpdateIsSuccess])

    useEffect(() => {
        if (data?.product) {
            form.reset({
                id: data?.product._id,
                data: {
                    title: data?.product.title,
                    description: data?.product.description,
                    long_description: data?.product.long_description,
                    image_description: data?.product.image_description,
                    set_description: data?.product.set_description,
                    price: data?.product.price,
                    imagesNumber: 0,
                    imagesChanged: false,
                    nr_of_items: data?.product.nr_of_items || 1,
                    categories: data?.product.categories || [],
                    ocasions: data?.product.ocasions || [],
                    product_content: data?.product.product_content || [],
                    stock_availability: {
                        stock: data?.product.stock_availability?.stock || 5,
                        state: data?.product.stock_availability?.state || StockState.IN_STOCK
                    },
                    sale: data?.product.sale || {
                        active: false,
                        sale_price: 0
                    },
                    optional_info: {
                        weight: data?.product.optional_info?.weight || "",
                        dimensions: data?.product.optional_info?.dimensions || "",
                        color: data?.product.optional_info?.color || { ro: "", ru: "", en: "" },
                        material: data?.product.optional_info?.material || { ro: "", ru: "", en: "" },
                    }
                }
            });
            setImagesData(data?.product.images || []);
            setInitialImagesData(data?.product.images || []);
        }

    }, [data?.product, form]);

    function onSubmit(values: z.infer<typeof updateProductRequestSchema>) {
        mutate(values);
    }

    return (
        <>
            {
                isPending &&
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
                    className="col-span-12 grid grid-cols-12 flex-1 overflow-auto gap-x-6"
                    >
                    <div data-lenis-prevent className='col-span-7 grid grid-cols-7 scroll-bar-custom overflow-y-auto flex-1 -mr-6 pr-6 mt-16'>
                        <AdminProductDetails />
                    </div>
                    <AdminProductImages product={data?.product} imagesData={imagesData} initialImagesData={initialImagesData} setImagesData={setImagesData}/>
                </form>
            </Form>
        </>
    );
}
