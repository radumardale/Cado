'use client'

import {
    Form,
  } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { updateProductRequestSchema } from '@/lib/validation/product/updateProductRequest'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { StockState } from '@/lib/enums/StockState'
import AdminProductDetails from '../AdminProductDetails'
import AdminProductImages from '../AdminProductImages'
import { trpc } from '@/app/_trpc/client'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

interface AdminProductFormProps {
    id: string
}

export default function AdminUpdateProductForm({id}: AdminProductFormProps) {
    const { data } = trpc.products.getProductById.useQuery({id: id});
    const {isSuccess, isPending, mutate, data: MutatedData} = trpc.products.updateProduct.useMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success("Produsul a fost actualizat cu succes!");
            if (MutatedData) form.reset({
                id: MutatedData.product?._id,
                data: {
                    ...MutatedData.product
                }
            });
        }
    }, [isSuccess])


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
                price: 0,
                images: [],
                nr_of_items: 0,
                categories: [],
                ocasions: [],
                product_content: [],
                stock_availability: {
                    stock: 0,
                    state: StockState.NOT_IN_STOCK
                },
                sale: {
                    active: false,
                    sale_price: 0
                }
            }
        }
    });
    
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
                    images: data?.product.images,
                    nr_of_items: data?.product.nr_of_items || 0,
                    categories: data?.product.categories,
                    ocasions: data?.product.ocasions,
                    product_content: data?.product.product_content,
                    stock_availability: {
                        stock: data?.product.stock_availability.stock,
                        state: data?.product.stock_availability.state
                    },
                    sale: data?.product.sale || {
                        active: false,
                        sale_price: 0
                    }
                }
            });
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
                    <AdminProductImages product={data?.product} />
                </form>
            </Form>
        </>
    );
}
