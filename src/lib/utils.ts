import { clsx, type ClassValue } from "clsx"
import { cubicBezier } from "motion/react";
import { twMerge } from "tailwind-merge"
import { BlogTags } from "./enums/BlogTags";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Categories } from "./enums/Categories";
import { ProductInterface } from "@/models/product/types/productInterface";
import { CartInterface } from "./types/CartInterface";
import { toast } from "@/components/ui/productToast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);

export const getTagColor = (tag: BlogTags) => {
  switch (tag) {
      case BlogTags.NEWS:
          return "--blue1";
      case BlogTags.EXPERIENCES:
          return "--blue2";
      case BlogTags.RECOMMENDATIONS:
          return "--blue3";
  }
}

export const checkboxUpdateUrlParams = (urlParamName: string, searchParams: URLSearchParams, router: AppRouterInstance, newValues: string[]) => {
  // Create a new URLSearchParams object from the current params
  const params = new URLSearchParams(searchParams.toString());
  
  // Remove existing params with this name
  params.delete(urlParamName);
  
  // Add each selected value as a separate parameter
  newValues.forEach(value => {
      params.append(urlParamName, value);
  });
  
  // Update the URL without refreshing the page
  const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
  router.push(newUrl, {scroll: false});
};

export const updateCategoriesParams = (newCategories: Categories[], searchParams: URLSearchParams, router: AppRouterInstance) => {
  // Create a new URLSearchParams object from the current params
  const params = new URLSearchParams(searchParams.toString());
  
  // Remove existing category params
  params.delete('category');
  
  // Add each selected category as a separate parameter
  newCategories.forEach(category => {
      params.append('category', category);
  });
  
  // Update the URL without refreshing the page
  const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
  router.push(newUrl, {scroll: false});
}

export const resetUrlParams = (router: AppRouterInstance, keepParams: string[] = ['sort_by']) => {
  // Create a new URLSearchParams object from the current params
  const currentParams = new URLSearchParams(window.location.search);
  const newParams = new URLSearchParams();
  
  // Keep specified parameters if they exist in the current URL
  keepParams.forEach(param => {
    if (currentParams.has(param)) {
      currentParams.getAll(param).forEach(value => {
        newParams.append(param, value);
      });
    }
  });
  
  // Update the URL without refreshing the page
  const newUrl = window.location.pathname + (newParams.toString() ? `?${newParams.toString()}` : '');
  router.push(newUrl, { scroll: false });
};

export const addToCart = (product: ProductInterface, quantity: number = 1, value: CartInterface[], setValue: (v: CartInterface[]) => void, locale: string) => {
  // Check if the product already exists in the current cart state
  const existingProductIndex = value.findIndex((item) => item.product.custom_id === product.custom_id);
  
  // Create a new cart array to avoid direct mutation
  let newCart: CartInterface[];
  
  if (existingProductIndex !== -1) {
    // If product exists, increment quantity by the specified amount
    newCart = value.map((item, index) => 
      index === existingProductIndex 
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    // If product doesn't exist, add it with specified quantity
    newCart = [
      ...value,
      {
        product: product,
        quantity: quantity
      }
    ];
  }
  
  // Update cart using setValue from useLocalStorage
  setValue(newCart);
  toast({
    title: product.title[locale],
    image: product.images[0],
    price: product.price
  });
};
