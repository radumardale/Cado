'use client'

import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { ChevronDown, LoaderCircle, Plus, X } from 'lucide-react';
import { type z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/app/_trpc/client';
import { BlogTags } from '@/lib/enums/BlogTags';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import BlogImageUpload from '../BlogImageUpload';
import { SectionImagesInterface } from '@/models/blog/types/SectionImagesInterface';
import { toast } from 'sonner';
import { addBlogRequestSchema } from '@/lib/validation/blog/addBlogRequest';
import { useRouter } from '@/i18n/navigation';

export default function NewAdminBlogForm() {
    const {isSuccess, mutate, data: MutatedData, isPending} = trpc.blog.createBlog.useMutation();
    const { mutate: UpdateMutate, isSuccess: UpdateIsSuccess } = trpc.image.uploadBlogImages.useMutation();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [sectionsImages, setSectionImages] = useState<SectionImagesInterface[]>([]);

    const [isMounted, setIsMounted] = useState(false);
    const blogTagsT = useTranslations("blog_tags");
    const router = useRouter();
  
    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        if (UpdateIsSuccess && MutatedData?.blog?._id) {
            router.push({pathname: "/admin/blog/[id]", params: {id: MutatedData?.blog?._id}})
        }
    }, [UpdateIsSuccess, MutatedData?.blog?._id, router]);

const form = useForm<z.infer<typeof addBlogRequestSchema>>({
    resolver: zodResolver(addBlogRequestSchema),
    defaultValues: {
        data: {
            title: {
                ro: '',
                ru: '',
                en: '',
            },
            isImageNew: false,
            tag: BlogTags.NEWS,
            sections: [{
                subtitle: { ro: '', ru: '', en: '' },
                content: { ro: '', ru: '', en: '' }
            }],
            sectionsImagesCount: 0,
            imagesChanged: false,
        }
    } 
});

useEffect(() => {
    if (form.getValues("data.sectionsImagesCount") !== sectionsImages.filter(obj => !obj.image.startsWith("https")).length) {
        form.setValue('data.sectionsImagesCount', sectionsImages.filter(obj => !obj.image.startsWith("https")).length, {shouldDirty: true});
    }
}, [sectionsImages])

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "data.sections"
    });

    const { isDirty } = useFormState({ control: form.control });

    useEffect(() => {
        // Define an async function for sequential uploads
        const uploadImagesInOrder = async () => {
            if (isSuccess && MutatedData) {
                const newImageKeys: SectionImagesInterface[] = [];
                let newMainImageKey = null;
                
                // Upload images sequentially to maintain order
                let j = 0;

                if (form.getValues("data.isImageNew") && selectedImage !== null) {
                    try {
                        const dataUrl = MutatedData.imagesLinks[j];
                        j++;

                        // Convert base64 to Buffer
                        const base64Data = selectedImage.replace(/^data:image\/\w+;base64,/, "");
                        const buf = Buffer.from(base64Data, 'base64');

                        // Upload to S3
                        const response = await fetch(dataUrl, {
                            method: 'PUT',
                            body: buf
                        });

                        // Extract key from URL
                        const extractedKey = dataUrl.split('.com/')[1]?.split('?')[0];
        
                        if (response.ok && extractedKey) {
                            newMainImageKey = extractedKey;
                        } else {
                            console.error(`Failed to upload main image: ${response.statusText}`);
                        }
                    } catch (error) {
                        console.error(`Error uploading main image:`, error);
                    }
                }

                for (let i = 0; i < sectionsImages.length; i++) {
                    if (sectionsImages[i].image.startsWith("https")) {
                        const extractedKey = sectionsImages[i].image.split('.net/')[1]?.split('?')[0];
                        newImageKeys.push({
                            image: extractedKey,
                            index: sectionsImages[i].index
                        });
                        continue;
                    }

                    try {
                        const imageData = sectionsImages[i].image;
                        
                        if (!imageData) {
                            continue;
                        }

                        const dataUrl = MutatedData.imagesLinks[j];
                        j++;
                        
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
                            newImageKeys.push({
                                image: extractedKey,
                                index: sectionsImages[i].index
                            });
                        } else {
                            console.error(`Failed to upload image ${i+1}: ${response.statusText}`);
                        }
                    } catch (error) {
                        console.error(`Error uploading image ${i+1}:`, error);
                    }
                }

                if (newImageKeys.length > 0 || newMainImageKey) {
                    // If we have the product ID, update the images
                    if (MutatedData.blog?._id) {
                        UpdateMutate({
                            id: MutatedData.blog._id,
                            filenames: newImageKeys,
                            newMainImageKey
                        });
                    }
                }
            }
        };
    
        // Call the async function if we have successful mutation
        if (isSuccess && MutatedData) {
            if (form.getValues("data.imagesChanged") || form.getValues("data.isImageNew")) {
                uploadImagesInOrder();
            } else {
                toast.success("Produsul a fost actualizat cu succes!");
            }
            
             // Reset form with updated product data
             form.reset({
                data: {
                    ...MutatedData.blog,
                    isImageNew: false,
                    sectionsImagesCount: 0,
                    imagesChanged: false
                }
            }, {
                keepDirty: false,
                keepDefaultValues: false
            });
        }
    }, [isSuccess, MutatedData, form]);


  const onSubmit = (values: z.infer<typeof addBlogRequestSchema>) => {
    mutate(values);
  };

const handleMainImageAdded = (imageBase64: string) => {
    setSelectedImage(imageBase64);
    form.setValue("data.isImageNew", true, {shouldDirty: true});
};

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="col-start-4 col-span-6 mt-16 grid grid-cols-6 gap-x-6 h-fit mb-16">
            {/* Title */}
                <FormField
                    control={form.control}
                    name="data.title.ro"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-full mb-4">
                            <FormLabel className="font-semibold font-manrope leading-5">Titlu</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Titlu produs*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.title.ru"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-full mb-4">
                            <FormLabel className="font-semibold font-manrope leading-5">Название</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Название продукта*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data.title.en"
                    render={({ field }) => (
                        <FormItem className="text-black col-span-full mb-12">
                            <FormLabel className="font-semibold font-manrope leading-5">Title</FormLabel>
                            <FormMessage className='top-7' />
                            <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                <Input className=" text-base h-12 w-full px-6 rounded-3xl" placeholder="Product title*" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            
        <>
                {
                    !selectedImage ?
                    <BlogImageUpload big onImageAdded={handleMainImageAdded} />
                    : 
                    <div className='mb-4 relative group col-span-full'>
                        <div className='absolute left-0 top-0 w-full h-full bg-pureblack rounded-2xl opacity-0 group-hover:opacity-25 transition duration-300'></div>
                        <X 
                            strokeWidth={1.5} 
                            className='text-white size-6 absolute right-4 top-4 opacity-0 cursor-pointer group-hover:opacity-100' 
                            onClick={() => {
                                setSelectedImage(null);
                                form.setValue("data.isImageNew", true, {shouldDirty: true});
                            }}
                        />
                        <Image unoptimized src={selectedImage} alt='image' className='aspect-[3/2] rounded-2xl object-cover' width={703} height={464}/>
                    </div>
                }
        </>
            
            <div className='col-span-3 flex items-center gap-6 -col-start-4'>
                <p>Tip noutate:</p>
                <FormField
                    control={form.control}
                    name="data.tag"
                    render={({ field }) => (
                        <FormItem className='flex-1'> 
                            <FormMessage />
                                <Select onValueChange={field.onChange} value={isMounted ? field.value : BlogTags.NEWS}>
                                    <FormControl>
                                        <SelectTrigger className="text-base cursor-pointer flex h-12 max-h-none items-center px-6 gap-2 border border-gray rounded-3xl text-black w-full">
                                            <SelectValue placeholder="Alege disponibilitate stoc" />
                                            <ChevronDown className='size-5' strokeWidth={1.5}/>
                                        </SelectTrigger>
                                    </FormControl>  
                                    <SelectContent className="border-gray">
                                        <SelectGroup>
                                            <SelectItem className="text-base cursor-pointer" value={BlogTags.NEWS}>{blogTagsT(BlogTags.NEWS)}</SelectItem>
                                            <SelectItem className="text-base cursor-pointer" value={BlogTags.EXPERIENCES}>{blogTagsT(BlogTags.EXPERIENCES)}</SelectItem>
                                            <SelectItem className="text-base cursor-pointer" value={BlogTags.RECOMMENDATIONS}>{blogTagsT(BlogTags.RECOMMENDATIONS)}</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                        </FormItem>
                    )}
                />
            </div>
            
            <div className='col-span-full pt-4 border-t border-lightgray mt-12'>
                {fields.map((_, index) => {
                    const handleSectionImageAdded = (imageBase64: string) => {
                        
                        setSectionImages([...sectionsImages, { image: imageBase64, index }])
                        form.setValue("data.imagesChanged", true, {shouldDirty: true});
                    };
                    const sectionImage = sectionsImages.find(section => section.index === index);

                    return (
                        <div className='pb-12 border-b border-lightgray mb-4 relative' key={index}>
                            <button 
                                className='text-red absolute right-0 top-0 text-xs cursor-pointer z-30'
                                onClick={(e) => {
                                    e.preventDefault();
                                    remove(index);
                                }}
                                >Șterge paragraf</button>
                            <FormField
                                control={form.control}
                                name={`data.sections.${index}.subtitle.ro`}
                                render={({ field }) => (
                                    <FormItem className="text-black mb-4">
                                        <FormLabel className="font-semibold font-manrope leading-5">Titlu Paragraf</FormLabel>
                                        <FormMessage className='top-7' />
                                        <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                            <Input className="text-base h-12 w-full px-6 rounded-3xl" placeholder="Titlu paragraf*" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`data.sections.${index}.content.ro`}
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel className="font-semibold font-manrope leading-5">Paragraf</FormLabel>
                                        <FormControl>
                                            <Textarea data-lenis-prevent className="scroll-bar-custom placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black pt-4 col-span-full" placeholder="Paragraf*" {...field}/>
                                        </FormControl>
                                        <FormMessage className='top-7' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`data.sections.${index}.subtitle.ru`}
                                render={({ field }) => (
                                    <FormItem className="text-black mb-4">
                                        <FormLabel className="font-semibold font-manrope leading-5">Название параграфа</FormLabel>
                                        <FormMessage className='top-7' />
                                        <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                            <Input className="text-base h-12 w-full px-6 rounded-3xl" placeholder="Название параграфа*" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`data.sections.${index}.content.ru`}
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel className="font-semibold font-manrope leading-5">Параграф</FormLabel>
                                        <FormControl>
                                            <Textarea data-lenis-prevent className="scroll-bar-custom placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black pt-4 col-span-full" placeholder="Параграф*" {...field}/>
                                        </FormControl>
                                        <FormMessage className='top-7' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`data.sections.${index}.subtitle.en`}
                                render={({ field }) => (
                                    <FormItem className="text-black mb-4">
                                        <FormLabel className="font-semibold font-manrope leading-5">Paragraph Title</FormLabel>
                                        <FormMessage className='top-7' />
                                        <FormControl className="border rounded-3xl border-gray shadow-none p-0 text-black placeholder:text-black focus-visible:outline-none">
                                            <Input className="text-base h-12 w-full px-6 rounded-3xl" placeholder="Paragraph title*" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`data.sections.${index}.content.en`}
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel className="font-semibold font-manrope leading-5">Paragraph</FormLabel>
                                        <FormControl>
                                            <Textarea data-lenis-prevent className="scroll-bar-custom placeholder:text-black h-40 items-center px-6 border border-gray rounded-3xl text-base text-black pt-4 col-span-full" placeholder="Paragraph*" {...field}/>
                                        </FormControl>
                                        <FormMessage className='top-7' />
                                    </FormItem>
                                )}
                            />

                            {
                                !sectionImage ?
                                <BlogImageUpload onImageAdded={handleSectionImageAdded} />
                                :
                                <div className='mb-4 relative group col-span-full'>
                                    <div className='absolute left-0 top-0 w-full h-full bg-pureblack rounded-2xl opacity-0 group-hover:opacity-25 transition duration-300'></div>
                                    <X 
                                        strokeWidth={1.5} 
                                        className='text-white size-6 absolute right-4 top-4 opacity-0 cursor-pointer group-hover:opacity-100' 
                                        onClick={() => {
                                            setSectionImages(sectionsImages.filter(section => section.index !== index));
                                            form.setValue("data.imagesChanged", true, {shouldDirty: true});
                                        }}
                                    />
                                    <Image unoptimized src={sectionImage.image} alt='image' className='aspect-[3/2] rounded-2xl object-cover' width={703} height={464}/>
                                </div>
                            }
                        </div>
                    )
                })}
            </div>

            <button 
                onClick={(e) => {
                    e.preventDefault(); 
                    append({
                        subtitle: { ro: '', ru: '', en: '' },
                        content: { ro: '', ru: '', en: '' }
                    });
                }}
                className='col-span-full h-18 flex gap-2 items-center justify-center bg-[#F0F0F0] rounded-2xl border border-dashed border-gray cursor-pointer hover:opacity-75 transition duration-300 mb-4'
                >
                <Plus strokeWidth={1.5} className='size-6'/>
                <p>Adaugă paragraf</p>
            </button>

            <div className='mt-12 pt-4 border-t border-lightgray col-span-full flex justify-end'>
                <div className='flex gap-6'>
                    <button 
                        className='cursor-pointer h-12' 
                        onClick={(e) => {
                            e.preventDefault(); 
                            
                            form.reset();
                            setSectionImages([]);
                            setSelectedImage(null);
                        }}
                    >
                        <span className='text-gray relative after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray hover:after:w-full after:transition-all after:duration-300'>
                            Anulează
                        </span>
                    </button>
                    <button type="submit" disabled={!isDirty} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-blue-2 text-white rounded-3xl hover:opacity-75 transition duration-300'>Salvează</button>
                </div>
            </div>
        </form>
        </Form>
    </>
  );
}