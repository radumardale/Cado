'use client'

import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { updateBlogRequestSchema } from '@/lib/validation/blog/updateBlogRequest';
import { type z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/app/_trpc/client';
import { BlogTags } from '@/lib/enums/BlogTags';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useFieldArray } from 'react-hook-form';

interface AdminBlogFormProps {
  id: string;
}

export default function AdminBlogForm({ id }: AdminBlogFormProps) {
    const { data } = trpc.blog.getBlogById.useQuery({id: id});
    const [selectedImage, setSelectedImage] = useState<string | null>(data?.blog?.image || null);
    // const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  
  useEffect(() => {
    setIsMounted(true);
  }, [])
  
//   const { mutate: createBlog, isLoading: isCreating } = trpc.blog.addBlog.useMutation({
//     onSuccess: () => {
//       toast.success('Blog post created successfully');
//       router.push('/admin/blogs');
//       router.refresh();
//     },
//     onError: (error: { message: string }) => {
//       toast.error(error.message || 'Failed to create blog post');
//     }
//   });
  
//   const { mutate: updateBlog, isLoading: isUpdating } = trpc.blog.updateBlog.useMutation({
//     onSuccess: () => {
//       toast.success('Blog post updated successfully');
//       router.push('/admin/blogs');
//       router.refresh();
//     },
//     onError: (error) => {
//       toast.error(error.message || 'Failed to update blog post');
//     }
//   });

  // Initialize form with appropriate default values based on mode
  const form = useForm<z.infer<typeof updateBlogRequestSchema>>({
    resolver: zodResolver(updateBlogRequestSchema),
    defaultValues: {
        id: data?.blog?._id,
        data: {
              title: {
              ro: data?.blog?.title.ro || '',
              ru: data?.blog?.title.ru || '',
              en: data?.blog?.title.en || '',
              },
              image: !data?.blog?.image,
              tag: data?.blog?.tag || BlogTags.NEWS,
              sections: data?.blog?.sections || []
          }
      } 
  });

    const { fields, append } = useFieldArray({
        control: form.control,
        name: "data.sections"
    });

    const { isDirty } = useFormState({ control: form.control });


  const onSubmit = (values: z.infer<typeof updateBlogRequestSchema>) => {
    console.log(values)
    // Update image from state
    // values.image = selectedImage || '';
    
    // // Call appropriate mutation based on mode
    // if (mode === 'create') {
    //   // When creating, remove id field from values
    //   const { id, ...createData } = values;
    //   createBlog(createData as any);
    // } else {
    //   // Ensure ID is set correctly for update
    //   if (blog) {
    //     values.id = blog._id;
    //   }
    //   updateBlog(values);
    // }
  };

//   const handleImageSelected = (imageBase64: string) => {
//     setSelectedImage(imageBase64);
//     form.setValue('data.image', true, {shouldDirty: true});
//   };

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
                        <button 
                            onClick={(e) => {
                                e.preventDefault(); 
                                // mutate({id: product?._id})
                            }} 
                            className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-red text-white rounded-3xl hover:opacity-75 transition duration-300'
                            >
                                Da, șterge
                            </button>
                    </div>
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
                    <div>

                    </div>
                    : 
                    <div className='mb-4 relative group col-span-full'>
                        <div className='absolute left-0 top-0 w-full h-full bg-pureblack rounded-2xl opacity-0 group-hover:opacity-25 transition duration-300'></div>
                        <X 
                            strokeWidth={1.5} 
                            className='text-white size-6 absolute right-4 top-4 opacity-0 cursor-pointer group-hover:opacity-100' 
                            onClick={() => {
                                setSelectedImage(null);
                                form.setValue("data.image", true, {shouldDirty: true});
                            }}
                        />
                        <Image src={selectedImage} alt='image' className='aspect-[3/2] rounded-2xl object-cover' width={703} height={464}/>
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
                                            <SelectItem className="text-base cursor-pointer" value={BlogTags.NEWS}>Noutăți</SelectItem>
                                            <SelectItem className="text-base cursor-pointer" value={BlogTags.EXPERIENCES}>La comandă</SelectItem>
                                            <SelectItem className="text-base cursor-pointer" value={BlogTags.RECOMMENDATIONS}>Stoc epuizat</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                        </FormItem>
                    )}
                />
            </div>
            
            <div className='col-span-full pt-4 border-t border-lightgray mt-12'>
                {fields.map((_, index) => (
                    <div className='pb-12 border-b border-lightgray mb-4' key={index}>
                        <FormField
                            control={form.control}
                            name={`data.sections.${index}.subtitle.ro`}
                            render={({ field }) => (
                                <FormItem className="text-black mb-4">
                                    <FormLabel className="font-semibold font-manrope leading-5">Titlu Paragraf</FormLabel>
                                    <FormMessage />
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
                                    <FormMessage />
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
                                    <FormMessage />
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
                    </div>
                ))}
            </div>

            <button 
                onClick={(e) => {
                    e.preventDefault(); 
                    append({
                        subtitle: { ro: '', ru: '', en: '' },
                        content: { ro: '', ru: '', en: '' }
                    })
                ;
                }} 
                className='col-span-full h-18 flex gap-2 items-center justify-center bg-[#F0F0F0] rounded-2xl border border-dashed border-gray cursor-pointer hover:opacity-75 transition duration-300 mb-4'
                >
                <Plus strokeWidth={1.5} className='size-6'/>
                <p>Adaugă noutate</p>
            </button>

            <div className='mt-12 pt-4 border-t border-lightgray col-span-full flex justify-between'>
                <button onClick={(e) => {e.preventDefault(); setIsDeleteDialogOpen(true)}} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-red text-white rounded-3xl hover:opacity-75 transition duration-300'>Șterge produs</button>

                <div className='flex gap-6'>
                    <button 
                        className='cursor-pointer h-12' 
                        onClick={(e) => {
                            e.preventDefault(); 
                            // setImagesData(initialImagesData);
                            
                            form.reset();
                            form.setValue("data.image", false);
                        }}
                    >
                        <span className='text-gray relative after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gray hover:after:w-full after:transition-all after:duration-300'>
                            Anulează
                        </span>
                    </button>
                    <button disabled={!isDirty} className='disabled:opacity-75 disabled:cursor-default cursor-pointer h-12 px-6 flex justify-center items-center bg-blue-2 text-white rounded-3xl hover:opacity-75 transition duration-300'>Salvează</button>
                </div>
            </div>
        </form>
        </Form>
    </>
  );
}