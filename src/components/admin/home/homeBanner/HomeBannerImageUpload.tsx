import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface HomeBannerImageUploadProps {
  onImageAdded: (imageBase64: string) => void;
  isLoading?: boolean;
}

export default function HomeBannerImageUpload({
  onImageAdded,
  isLoading = false
}: HomeBannerImageUploadProps) {
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
      
      if (file.size > 500 * 1024 * 1024) {
        toast.error("Imaginea trebuie să fie mai mică de 500MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Vă rugăm să încărcați doar fișiere imagine");
        return;
      }
      
      const base64String = await convertToBase64(file);
      
      // Pass the base64 string to the parent component
      onImageAdded(base64String);
      toast.success("Imaginea a fost adăugată cu succes");
      
    } catch (error) {
      console.error('Processing failed:', error);
      toast.error("A apărut o eroare la procesarea imaginii");
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
  
  return (
    <div 
      {...getRootProps()} 
      className={`col-span-full flex h-full gap-2 items-center justify-center bg-[#F0F0F0] rounded-3xl border border-dashed border-gray cursor-pointer group transition duration-300 mb-4 ${isDragActive ? "border-black" : "border-gray"}`}
    >
      <input {...getInputProps()} />
      
      {isProcessing ? (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-t-black border-r-black border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Se procesează...</p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-t-black border-r-black border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Se încarcă...</p>
        </div>
      ) : (
        <>
            <Upload strokeWidth={1.5} className="group-hover:opacity-75"/>
            <p className="group-hover:opacity-75">Selectează sau trage o imagine aici</p>
        </>
      )}
    </div>
  );
}