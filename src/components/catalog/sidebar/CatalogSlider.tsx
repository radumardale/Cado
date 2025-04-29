import React, { useEffect, useState, useCallback } from 'react'
import { DualRangeSlider } from '../../ui/slider'
import { useRouter, useSearchParams } from 'next/navigation';
import { useCatalogStore } from '@/states/CatalogState';

interface CatalogSliderProps {
  price: number[],
  setPrice: (v: number[]) => void,
}

export default function CatalogSlider({setPrice, price}: CatalogSliderProps) {
  const minPrice = useCatalogStore((state) => state.minPrice);
  const maxPrice = useCatalogStore((state) => state.maxPrice);

  const [currPrice, setCurrPrice] = useState([minPrice, maxPrice]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setCurrPrice(price);
  }, [price]);

  // Update URL params when price changes
  const updateUrlParams = useCallback((newPriceRange: number[]) => {
    // Create a new URLSearchParams object from the current params
    const params = new URLSearchParams(searchParams.toString());
    
    // Remove existing price params
    params.delete('min_price');
    params.delete('max_price');
    
    // Add the new price values
    params.append('min_price', newPriceRange[0].toString());
    params.append('max_price', newPriceRange[1].toString());
    
    // Update the URL without refreshing the page
    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    router.push(newUrl, {scroll: false});
  }, [router, searchParams]);

  return (
    <div className='pb-4'>
      <div className='flex justify-between mb-3'>
        <p>Min: <span className='font-semibold'>{currPrice[0]}</span></p>
        <p>Max: <span className='font-semibold'>{currPrice[1]}</span></p>
      </div>
      <DualRangeSlider
        minStepsBetweenThumbs={2}
        value={currPrice}
        onValueChange={(values) => {
          setCurrPrice(values);
        }}
        onValueCommit={(values) => {
          setPrice(values);
          // Update URL when slider value is committed (on mouse up)
          updateUrlParams(values);
        }}
        min={minPrice}
        max={maxPrice}
        step={1}
      />
    </div>
  )
}