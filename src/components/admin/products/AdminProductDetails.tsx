
import { Minus, Plus } from 'lucide-react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import ProductTagsSearchbar from './ProductTagsSearchbar'
import { ActiveFiltersButton } from '@/components/catalog/sidebar/ActiveFiltersButton'
import { Categories } from '@/lib/enums/Categories'
import { ProductContent } from '@/lib/enums/ProductContent'
import { Ocasions } from '@/lib/enums/Ocasions'
import { useFormContext } from 'react-hook-form'
import { UpdateFormValues } from '@/lib/validation/product/updateProductRequest'
import { useEffect } from 'react'
import { TextEditor } from './TextEditor'

export default function AdminProductDetails() {
    const t = useTranslations();

    const form = useFormContext<UpdateFormValues>()

    const nrOfItemsInGift = form.watch("data.nr_of_items");
    const categories = form.watch("data.categories");
    const productContents = form.watch("data.product_content");
    const ocasions = form.watch("data.ocasions");

    useEffect(() => {
        if (nrOfItemsInGift <= 1) {
            form.setValue("data.set_description", undefined);
        } else {
            form.resetField("data.set_description");
        }
    }, [nrOfItemsInGift])
    const handleAddCategory = (categoryId: Categories) => {
        if (!categories.includes(categoryId)) {
            const updatedCategories = [...categories, categoryId];
            form.setValue("data.categories", updatedCategories, {
                shouldDirty: true, // Mark the field as dirty
            });
        }
    };
    
    const handleAddProductContent = (contentId: ProductContent) => {
        if (!productContents.includes(contentId)) {
            form.setValue("data.product_content", [...productContents, contentId], {
                shouldDirty: true, // Mark the field as dirty
            });
        }
    };
    
    const handleAddOcasion = (ocasionId: Ocasions) => {
        if (!ocasions.includes(ocasionId)) {
            form.setValue("data.ocasions", [...ocasions, ocasionId], {
                shouldDirty: true, // Mark the field as dirty
            });
        }
    };

    const prod_t = useTranslations("Admin.AdminProducts")

  return (
    <>
        <div className='xl:col-start-2 col-span-7 xl:col-span-6 flex justify-between items-center mb-6'>
            <p className='font-manrope text-2xl font-semibold leading-7'>{prod_t("product_details")}</p>
        </div>
            <div className="xl:col-start-2 col-span-7 xl:col-span-6 grid grid-cols-6 gap-x-6 gap-y-4 pb-8">
                <FormField
                    control={form.control}
                    name="data.title.ro"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Titlu produs</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Titlu produs*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.image_description.ro"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Descriere imagine</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Descriere imagine*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.title.ru"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Название продукта</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Название продукта*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.image_description.ru"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Описание изображения</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Описание изображения*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.title.en"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Product title</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Product title*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                  <FormField
                    control={form.control}
                    name="data.image_description.en"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Image description</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Image description*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className='h-[1px] col-span-full bg-lightgray mt-8'></div>
                <FormField
                    control={form.control}
                    name="data.description.ro"
                    render={({ field }) => (
                        <FormItem className="col-span-full">
                            <FormLabel className="font-semibold font-manrope leading-5">Descriere scurtă</FormLabel>
                            <FormControl>
                                {/* <Textarea data-lenis-prevent className="scroll-bar-custom placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black pt-4 col-span-full" placeholder="Descriere scurtă*" {...field}/> */}
                                <TextEditor {...field}/>
                            </FormControl>
                            <FormMessage className='top-7' />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="data.description.ru"
                    render={({ field }) => (
                        <FormItem className="col-span-full">
                            <FormLabel className="font-semibold font-manrope leading-5">Краткое описание</FormLabel>
                            <FormControl>
                                <TextEditor {...field}/>
                            </FormControl>
                            <FormMessage className='top-7' />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="data.description.en"
                    render={({ field }) => (
                        <FormItem className="col-span-full">
                            <FormLabel className="font-semibold font-manrope leading-5">Short description</FormLabel>
                            <FormControl>
                                <TextEditor {...field}/>
                            </FormControl>
                            <FormMessage className='top-7' />
                        </FormItem>
                    )}
                />
                <div className='h-[1px] col-span-full bg-lightgray mt-8 mb-2'></div>

                <div className="col-span-full flex items-center gap-4">
                    <p>{prod_t("number")}:</p>
                    <FormField
                        control={form.control}
                        name="data.nr_of_items"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <div className='w-30 flex items-center justify-between font-manrope font-semibold py-1 px-4 border border-gray rounded-3xl'>
                                    <button 
                                        disabled={field.value <= 1} 
                                        className='cursor-pointer disabled:pointer-events-none disabled:text-gray' 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            form.setValue("data.nr_of_items", Math.max(field.value - 1, 0), {shouldDirty: true});
                                        }}
                                    ><Minus strokeWidth={1.5} className='w-6' /></button>

                                    <span>{field.value}</span>

                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            form.setValue("data.nr_of_items", field.value + 1, {shouldDirty: true});
                                        }} 
                                        className='cursor-pointer disabled:pointer-events-none disabled:text-gray'
                                    ><Plus strokeWidth={1.5} className='w-6' /></button>
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {
                    nrOfItemsInGift > 1 &&
                    <>
                        <FormField
                            control={form.control}
                            name="data.set_description.ro"
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel className="font-semibold font-manrope leading-5">Cadoul include</FormLabel>
                                    <FormControl>
                                        <TextEditor {...field}/>
                                    </FormControl>
                                    <FormMessage className='top-7' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="data.set_description.ru"
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel className="font-semibold font-manrope leading-5">Подарок включает в себя</FormLabel>
                                    <FormControl>
                                        <TextEditor {...field}/>
                                    </FormControl>
                                    <FormMessage className='top-7' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="data.set_description.en"
                            render={({ field }) => (
                                <FormItem className="col-span-full mb-6">
                                    <FormLabel className="font-semibold font-manrope leading-5">The gift includes</FormLabel>
                                    <FormControl>
                                        <TextEditor {...field}/>
                                    </FormControl>
                                    <FormMessage className='top-7' />
                                </FormItem>
                            )}
                        />
                    </>
                }

                <FormField
                    control={form.control}
                    name="data.long_description.ro"
                    render={({ field }) => (
                        <FormItem className="col-span-full mt-2 pt-4 border-t border-lightgray">
                            <FormLabel className="font-semibold font-manrope leading-5">Descriere</FormLabel>
                            <FormControl>
                                <TextEditor {...field}/>
                            </FormControl>
                            <FormMessage className='top-7' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.long_description.ru"
                    render={({ field }) => (
                        <FormItem className="col-span-full">
                            <FormLabel className="font-semibold font-manrope leading-5">Описание</FormLabel>
                            <FormControl>
                                <TextEditor {...field}/>
                            </FormControl>
                            <FormMessage className='top-7' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.long_description.en"
                    render={({ field }) => (
                        <FormItem className="col-span-full">
                            <FormLabel className="font-semibold font-manrope leading-5">Description</FormLabel>
                            <FormControl>
                                <TextEditor {...field}/>
                            </FormControl>
                            <FormMessage className='top-7' />
                        </FormItem>
                    )}
                />
                <div className='h-[1px] col-span-full bg-lightgray mt-8 mb-2'></div>
                <p className='col-span-full font-manrope font-semibold'>{prod_t("features")}</p>
                <FormField
                    control={form.control}
                    name="data.optional_info.weight"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Greutate</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Greutate*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.optional_info.dimensions"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Dimensiuni</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Dimensiuni*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.optional_info.material.ro"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Material</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Material*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.optional_info.color.ro"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Culoare</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Culoare*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.optional_info.material.ru"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Материал</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Материал*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.optional_info.color.ru"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Цвет</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Цвет*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="data.optional_info.material.en"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3">
                            <FormLabel className="font-semibold font-manrope leading-5">Material</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Material*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.optional_info.color.en"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-3 mb-4">
                            <FormLabel className="font-semibold font-manrope leading-5">Color</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Color*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <ProductTagsSearchbar handleAddCategory={handleAddCategory} handleAddOcasion={handleAddOcasion} handleAddProductContent={handleAddProductContent} />
                <div className='col-span-full gap-y-4 grid grid-cols-4 my-4'>
                    {
                        categories.length > 0 && (
                        <div className='col-span-full flex gap-1 flex-wrap'>
                            <p>{prod_t("main_category")}:</p>
                            {
                                categories.map((category: Categories, index: number) => {
                                    return (
                                        <p key={index} className='text-gray'>{t(`Tags.${category}.title`)}<span className={`${index === categories.length - 1 ? "hidden" : ""} text-black`}>,</span> </p>
                                    )
                                })
                            }
                        </div>
                    )}
                    {
                        productContents.length > 0 && (
                        <div className='col-span-full flex gap-1 flex-wrap'>
                            <p>{prod_t("content")}:</p>
                            {
                                productContents.map((productContent: ProductContent, index: number) => {
                                    return (
                                        <p key={index} className='text-gray'>{t(`product_content.${productContent}`)}<span className={`${index === productContents.length - 1 ? "hidden" : ""} text-black`}>,</span> </p>
                                    )
                                })
                            }
                        </div>
                    )}
                    
                    {
                        ocasions.length > 0 && (
                        <div className='col-span-full flex gap-1 flex-wrap'>
                            <p>{prod_t("ocasion")}:</p>
                            {
                                ocasions.map((ocasion: Ocasions, index: number) => {
                                    return (
                                        <p key={index} className='text-gray'>{t(`ocasions.${ocasion}.title`)}<span className={`${index === ocasions.length - 1 ? "hidden" : ""} text-black`}>,</span> </p>
                                    )
                                })
                            }
                        </div>
                    )}
                </div>

                {
                    (categories.length > 0 || productContents.length > 0 || ocasions.length > 0) &&
                    <div className='col-span-6 flex flex-wrap gap-2'>
                        {
                            categories.map((category: Categories, index: number) => {
                                return (
                                    <ActiveFiltersButton 
                                        key={index} 
                                        title={t(`Tags.${category}.title`)} 
                                        onClick={() => {
                                            const updatedCategories = categories.filter((cat: Categories) => cat !== category);
                                            form.setValue("data.categories", updatedCategories, {shouldDirty: true});
                                        }} 
                                    />
                                )
                            })
                        }
                        {
                            productContents.map((productContent: ProductContent, index: number) => {
                                return (
                                    <ActiveFiltersButton 
                                        key={index} 
                                        title={t(`product_content.${productContent}`)} 
                                        onClick={() => {
                                            const updatedProductContents = productContents.filter((content: ProductContent) => content !== productContent);
                                            form.setValue("data.product_content", updatedProductContents, {shouldDirty: true});
                                        }} 
                                    />
                                )
                            })
                        }
                        {
                            ocasions.map((ocasion: Ocasions, index: number) => {
                                return (
                                    <ActiveFiltersButton 
                                        key={index} 
                                        title={t(`ocasions.${ocasion}.title`)} 
                                        onClick={() => {
                                            const updatedOcasions = ocasions.filter((item: Ocasions) => item !== ocasion);
                                            form.setValue("data.ocasions", updatedOcasions, {shouldDirty: true});
                                        }} 
                                    />
                                )
                            })
                        }
                    </div>
                }
            </div>
    </>
  )
}