import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { StockState } from '@/lib/enums/StockState'
import { UpdateFormValues } from '@/lib/validation/product/updateProductRequest'
import { ProductInterface } from '@/models/product/types/productInterface'
import { ChevronDown, Pin, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useFormContext, useFormState } from 'react-hook-form'
import ProductImageUpload from './ProductImageUpload'
import { trpc } from '@/app/_trpc/client'
import { useRouter } from '@/i18n/navigation'

interface AdminProductImagesProps {
    product: ProductInterface | null | undefined,
    imagesData: string[],
    initialImagesData: string[],
    setImagesData: (v: string[]) => void
}

export default function AdminProductImages({ product, imagesData, initialImagesData, setImagesData }: AdminProductImagesProps) {
    const { mutate, isSuccess, isPending } = trpc.products.deleteProduct.useMutation();
    const locale = useLocale();
    const router = useRouter();
    const form = useFormContext<UpdateFormValues>();
    const [isMounted, setIsMounted] = useState(false);
    const { isDirty } = useFormState({ control: form.control });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const stockState = form.watch("data.stock_availability.state");
    const isSaleActive = form.watch("data.sale.active");

    useEffect(() => {
        if (!isPending && isSuccess) router.push("/admin/products")
    }, [isSuccess, isPending])

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        if (stockState === StockState.IN_STOCK) {
            form.resetField("data.stock_availability.stock");
        } else {
            form.setValue("data.stock_availability.stock", 0, {
                shouldDirty: true
            });
        }
    }, [stockState])

    useEffect(() => {
        if (form.getValues("data.imagesNumber") !== imagesData.filter(image => !image.startsWith("https")).length) {
            form.setValue('data.imagesNumber', imagesData.filter(image => !image.startsWith("https")).length, {shouldDirty: true});
        }
    }, [imagesData])

    const handleImageAdded = (imageBase64: string) => {
        const currentImages = imagesData;
        setImagesData([...currentImages, imageBase64]);
        form.setValue("data.imagesChanged", true, {shouldDirty: true});
    };

  return (
    <>
        {
            isDeleteDialogOpen && 
            <div className='fixed top-0 left-0 w-full h-full bg-black/75 z-50 flex justify-center items-center' onMouseDown={() => {setIsDeleteDialogOpen(false)}}>
                <div className='p-8 rounded-3xl bg-white' onMouseDown={(e) => {e.stopPropagation()}}>
                    <p className='text-lg'>Ești sigur că vrei să ștergi produsul?</p>
                    <div className='flex gap-6 ml-36 mt-12'>
                        <button className='cursor-pointer h-12' onClick={(e) => {e.preventDefault(); setIsDeleteDialogOpen(false);}}>
                            <span className='relative after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-black hover:after:w-full after:transition-all after:duration-300'>Anulează</span>
                        </button>
                        <button onClick={(e) => {e.preventDefault(); mutate({id: product?._id})}} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-red text-white rounded-3xl hover:opacity-75 transition duration-300'>Da, șterge</button>
                    </div>
                </div>
            </div>
        }
        <div data-lenis-prevent className='col-span-4 col-start-9 flex-1 overflow-y-auto mt-16 pb-8 grid grid-cols-4 gap-x-6'>
            <div className='col-span-full grid grid-cols-4 gap-x-6 h-fit'>
                <div className='col-span-full grid grid-cols-4 gap-x-6 h-fit'>
                    <p className='font-manrope text-2xl font-semibold leading-7 mb-6 col-span-full'>Imagini pentru produs</p>
                    <div className='col-span-4 grid grid-cols-4 gap-4'>
                        {
                            imagesData.length > 0 &&
                            <ProductImageUpload 
                                onImageAdded={handleImageAdded}
                            />
                        }
                        {
                            imagesData.length > 1 && 
                            <>
                                {
                                    imagesData.map((image, index) => {
                                        return (
                                            <div key={index} className='col-span-1 relative group'>
                                                <div className='absolute left-0 top-0 w-full h-full bg-pureblack rounded-lg opacity-0 group-hover:opacity-25 transition duration-300'></div>
                                                <Pin
                                                    fill={index === 0 ? "white" : "none"}
                                                    strokeWidth={1.5} 
                                                    className={`text-white size-4 absolute left-1 top-1 opacity-0 group-hover:opacity-100 ${index === 0 ? "" : "cursor-pointer"}`}
                                                    onClick={() => {
                                                        const currentImages = imagesData
                                                        const updatedImages = [image, ...currentImages.filter((_, i) => i !== index)];
                                                        setImagesData(updatedImages);
                                                        form.setValue("data.imagesChanged", true, {shouldDirty: true});
                                                    }}
                                                    />
                                                <X 
                                                    strokeWidth={1.5} 
                                                    className='text-white size-4 absolute right-1 top-0.75 opacity-0 cursor-pointer group-hover:opacity-100' 
                                                    onClick={() => {
                                                        const currentImages = imagesData;
                                                        setImagesData(currentImages.filter((_, i) => i !== index));
                                                        form.setValue("data.imagesChanged", true, {shouldDirty: true});
                                                    }}
                                                    />
                                                <Image unoptimized src={image} alt={product ? product.title[locale] : "new image"} width={339} height={339} className='w-full rounded-lg aspect-square object-cover'/>
                                            </div>
                                        )
                                    })
                                }
                            </>
                        }
                    </div>
                </div>
                <div className='col-span-full mt-8 h-fit grid grid-cols-4 gap-x-6 gap-y-4'>
                    <FormField
                        control={form.control}
                        name="data.stock_availability.state"
                        render={({ field }) => (
                            <FormItem className='col-span-3'> 
                                <FormMessage />
                                    <FormLabel className="font-semibold font-manrope leading-5">Disponibilitatea în stoc</FormLabel>
                                    <Select onValueChange={field.onChange} value={isMounted ? field.value : StockState.IN_STOCK}>
                                        <FormControl>
                                            <SelectTrigger className="text-base cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-black w-full">
                                                <SelectValue placeholder="Alege disponibilitate stoc" />
                                                <ChevronDown className='size-5' strokeWidth={1.5}/>
                                            </SelectTrigger>
                                        </FormControl>  
                                        <SelectContent className="border-gray">
                                            <SelectGroup>
                                                <SelectItem className="text-base cursor-pointer" value={StockState.IN_STOCK}>În stoc</SelectItem>
                                                <SelectItem className="text-base cursor-pointer" value={StockState.ON_COMMAND}>La comandă</SelectItem>
                                                <SelectItem className="text-base cursor-pointer" value={StockState.NOT_IN_STOCK}>Stoc epuizat</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="data.stock_availability.stock"
                        render={({ field }) => (
                            <FormItem className="text-black col-span-1">
                                <FormLabel className="font-semibold font-manrope leading-5 whitespace-nowrap">№ stoc</FormLabel>
                                <FormMessage />
                                <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                    <Input 
                                        disabled={stockState !== StockState.IN_STOCK} 
                                        type='number' 
                                        className=" text-base h-12 w-full px-4 text-center rounded-3xl" 
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        value={field.value.toString() || 0}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="col-span-3 flex gap-6">
                        <FormField
                            control={form.control}
                            name="data.price"
                            render={({ field }) => (
                                <FormItem className="text-black col-span-1">
                                    <FormLabel className="font-semibold font-manrope leading-5 whitespace-nowrap">{isSaleActive ? "Preț vechi" : "Preț"}</FormLabel>
                                    <FormMessage />
                                    <div className='flex gap-2 items-center'>
                                        <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                            <Input 
                                            type='number' 
                                            className=" text-base h-12 w-full px-2 text-center rounded-3xl" 
                                            {...field} 
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            value={field.value.toString() || 0}/>
                                        </FormControl>
                                        <span className='font-manrope font-semibold'>MDL</span>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="data.sale.sale_price"
                            render={({ field }) => (
                                <FormItem className={`${isSaleActive ? "" : "invisible pointer-events-none"} text-black col-span-1`}>
                                    <FormLabel className="font-semibold font-manrope leading-5 whitespace-nowrap">Preț nou</FormLabel>
                                    <FormMessage />
                                    <div className='flex gap-2 items-center'>
                                        <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                            <Input 
                                            type='number' 
                                            className=" text-base h-12 w-full px-2 text-center rounded-3xl" 
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            value={field.value.toString() || 0}/>
                                        </FormControl>
                                        <span className='font-manrope font-semibold'>MDL</span>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="data.sale.active"
                        render={({ field }) => (
                            <>
                                <FormItem className="text-black col-span-1">
                                    <FormLabel className="font-semibold font-manrope leading-5 whitespace-nowrap">Reducere</FormLabel>
                                    <FormMessage />
                                    <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                    <Switch
                                        className='cursor-pointer max-w-full h-12 flex border-gray [&>span]:border [&>span]:border-gray [&>span]:w-auto [&>span]:aspect-square [&>span]:h-10'
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    </FormControl>
                                </FormItem>
                            </>
                        )}
                    />
                </div>
            </div>
            
            <div className='flex justify-between gap-6 flex-1 items-end mt-6 col-span-full'>
                <button onClick={(e) => {e.preventDefault(); setIsDeleteDialogOpen(true)}} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-red text-white rounded-3xl hover:opacity-75 transition duration-300'>Șterge produs</button>

                <div className='flex gap-6'>
                    <button 
                        className='cursor-pointer h-12' 
                        onClick={(e) => {
                            e.preventDefault(); 
                            setImagesData(initialImagesData);
                            
                            const currentValues = form.getValues();
                            form.reset({
                                ...currentValues,
                                data: {
                                    ...currentValues.data,
                                    imagesNumber: initialImagesData.filter(img => !img.startsWith("https")).length,
                                    imagesChanged: false
                                }
                            });
                        }}
                    >
                        <span className='text-gray relative after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray hover:after:w-full after:transition-all after:duration-300'>
                            Anulează
                        </span>
                    </button>
                    <button disabled={!isDirty} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-blue-2 text-white rounded-3xl hover:opacity-75 transition duration-300'>Salvează</button>
                </div>
            </div>
        </div>
    </>
  )
}
