import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { useLocale, useTranslations } from "next-intl";

interface BlogImageUploadProps {
  onImageAdded: (imageBase64: string) => void;
  big?: boolean;
  isLoading?: boolean;
}

const toastMessages = {
  fileTooLarge: {
    ro: "Imaginea trebuie să fie mai mică de 500MB",
    ru: "Изображение должно быть меньше 500MБ",
    en: "The image must be smaller than 500MB"
  },
  notImage: {
    ro: "Vă rugăm să încărcați doar fișiere imagine",
    ru: "Пожалуйста, загружайте только файлы изображений",
    en: "Please upload image files only"
  },
  success: {
    ro: "Imaginea a fost adăugată cu succes",
    ru: "Изображение успешно добавлено",
    en: "Image added successfully"
  },
  error: {
    ro: "A apărut o eroare la procesarea imaginii",
    ru: "Произошла ошибка при обработке изображения",
    en: "An error occurred while processing the image"
  }
};

export default function BlogImageUpload({
  onImageAdded,
  big = false,
  isLoading = false
}: BlogImageUploadProps) {
  const locale = useLocale() as "ro" | "ru" | "en";
  const [isProcessing, setIsProcessing] = useState(false);
  
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  const handleFile = async (file: File) => {
    try {
      setIsProcessing(true);
      
      // Validate file size (limit to 5MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error(toastMessages.fileTooLarge[locale] || toastMessages.fileTooLarge.en);
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(toastMessages.notImage[locale] || toastMessages.notImage.en);
        return;
      }
      
      const base64String = await convertToBase64(file);
      
      // Pass the base64 string to the parent component
      onImageAdded(base64String);
      toast.success(toastMessages.success[locale] || toastMessages.success.en);
      
    } catch (error) {
      console.error('Processing failed:', error);
      toast.error(toastMessages.error[locale] || toastMessages.error.en);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isLoading || isProcessing,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        await handleFile(file);
      }
    }
  });

  const t = useTranslations("Admin.AdminBlog");
  
  return (
    <div 
      {...getRootProps()} 
      className={`col-span-full ${big ? "aspect-[3/2] flex-col" : "h-18 flex"} flex gap-2 items-center justify-center bg-[#F0F0F0] rounded-2xl border border-dashed border-gray cursor-pointer hover:opacity-75 transition duration-300 mb-4 ${isDragActive ? "border-black" : "border-gray"}`}
    >
      <input {...getInputProps()} />
      
      {isProcessing ? (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-t-black border-r-black border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">{t("is_processing")}</p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-t-black border-r-black border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">{t("is_uploading")}</p>
        </div>
      ) : (
        <>
            <Upload strokeWidth={1.5} className={`${big ? "size-10" : "size-6"}`}/>
            <p>{t('select_image')}</p>
        </>
      )}
    </div>
  );
}