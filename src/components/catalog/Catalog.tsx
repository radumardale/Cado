'use client'

import { useEffect, useState, useRef } from "react";
import CatalogSidebar from "./sidebar/CatalogSidebar";
import ProductsGrid from "./productsGrid/ProductsGrid";
import { trpc } from "@/app/_trpc/client";
import { Categories } from "@/lib/enums/Categories";
import { Ocasions } from "@/lib/enums/Ocasions";
import { ProductContent } from "@/lib/enums/ProductContent";
import SortBy from "@/lib/enums/SortBy";
import { useSearchParams } from "next/navigation";
import Header from "../header/Header";
import { productsLimit } from "@/lib/constants";

export default function Catalog() {
    // All your existing state and params
    const searchParams = useSearchParams();
    const [category, setCategory] = useState<Categories | null>(searchParams.get("category") as Categories || null);
    const [ocasions, setOcasions] = useState<Ocasions[]>(searchParams.getAll("ocasions") as Ocasions[]);
    const [productContent, setProductContent] = useState<ProductContent[]>(searchParams.getAll("product_content") as ProductContent[]);
    const [price, setPrice] = useState([Number(searchParams.get("min_price")), searchParams.get("max_price") ? Number(searchParams.get("max_price")) : 5000]);
    const [sortBy, setSortBy] = useState<SortBy>(searchParams.get("sort_by") ? searchParams.get("sort_by") as SortBy : SortBy.RECOMMENDED)
    
    // Create a ref for the loading trigger element
    const observerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        // Your existing effect for search params
        const newCategory = searchParams.get("category") as Categories || null;
        const newOcasions = searchParams.getAll("ocasions") as Ocasions[];
        const newProductContent = searchParams.getAll("product_content") as ProductContent[];
        const newMinPrice = Number(searchParams.get("min_price") || price[0]);
        const newMaxPrice = Number(searchParams.get("max_price") || price[1]);
        const newSortBy = searchParams.get("sort_by") as SortBy || sortBy;

        if (category !== newCategory) setCategory(newCategory);
        if (JSON.stringify(ocasions) !== JSON.stringify(newOcasions)) setOcasions(newOcasions);
        if (JSON.stringify(productContent) !== JSON.stringify(newProductContent)) setProductContent(newProductContent);
        if (price[0] !== newMinPrice || price[1] !== newMaxPrice) setPrice([newMinPrice, newMaxPrice]);
        if (sortBy !== newSortBy) setSortBy(newSortBy);
    }, [searchParams])
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = trpc.products.getProducts.useInfiniteQuery({
        limit: productsLimit,
        category: category,
        ocasions: ocasions,
        productContent: productContent,
        price: {
            min: price[0],
            max: price[1]
        },
        sortBy: sortBy
    },
    {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
    
    const allProducts = data?.pages.flatMap(page => page.products) || [];

    // Set up intersection observer for infinite scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // If the element is visible and we have more pages to load
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                // Trigger when element is 90% visible
                threshold: 0.1,
                rootMargin: "0px 0px 200px 0px" // Preload when within 200px of viewport
            }
        );

        // Start observing the sentinel element
        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        // Clean up the observer
        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [observerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <> 
            <Header category={category} breadcrumbs />
            <div className="relative col-span-full grid grid-cols-full gap-x-6 mb-24">
                <CatalogSidebar                 
                    categoriesState={{
                        category,
                        setCategory
                    }}
                    priceState={{
                        price,
                        setPrice,
                    }}
                    ocasionsState={{
                        ocasions,
                        setOcasions
                    }}
                    productContentState={{
                        productContent,
                        setProductContent
                    }}
                />
                <ProductsGrid 
                    sortBy={sortBy}
                    products={allProducts} 
                    loading={status === "pending"}
                    setSortBy={setSortBy}
                    category={category}
                />
                
                <div 
                    ref={observerRef} 
                    className="col-start-4 col-span-12 flex justify-center"
                >
                    {isFetchingNextPage && (
                        <div className="animate-pulse flex justify-center py-4">
                            <div className="h-4 w-4 bg-blue-1 rounded-full mr-1"></div>
                            <div className="h-4 w-4 bg-blue-1 rounded-full mr-1 animate-pulse-delay-200"></div>
                            <div className="h-4 w-4 bg-blue-1 rounded-full animate-pulse-delay-400"></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}