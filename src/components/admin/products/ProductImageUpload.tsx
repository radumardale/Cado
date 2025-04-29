import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface ProductImageUploadProps {
  onImageAdded: (imageBase64: string) => void;
  big?: boolean;
  isLoading?: boolean;
}

export default function ProductImageUpload({
  onImageAdded,
  big = false,
  isLoading = false
}: ProductImageUploadProps) {
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
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Imaginea trebuie să fie mai mică de 10MB");
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
      className={`w-full ${big ? "rounded-2xl" : "rounded-lg"} aspect-[339/422] bg-[#F0F0F0] border border-dashed flex justify-center items-center cursor-pointer hover:border-black transition duration-300 group ${isDragActive ? "border-black" : "border-gray"}`}
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
        <Plus className={`${isDragActive ? "text-black" : "text-gray"} size-6 group-hover:text-black`} strokeWidth={1.5} />
      )}
    </div>
  );
}