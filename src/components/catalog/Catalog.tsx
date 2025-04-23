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
import PcCatalogSidebar from "./sidebar/PcCatalogSidebar";

export default function Catalog() {
    // All your existing state and params
    const searchParams = useSearchParams();
    const [category, setCategory] = useState<Categories | null>(searchParams.get("category") as Categories || null);
    const [ocasions, setOcasions] = useState<Ocasions[]>(searchParams.getAll("ocasions") as Ocasions[]);
    const [productContent, setProductContent] = useState<ProductContent[]>(searchParams.getAll("product_content") as ProductContent[]);
    const [price, setPrice] = useState([Number(searchParams.get("min_price")), searchParams.get("max_price") ? Number(searchParams.get("max_price")) : 5000]);
    const [sortBy, setSortBy] = useState<SortBy>(searchParams.get("sort_by") ? searchParams.get("sort_by") as SortBy : SortBy.RECOMMENDED);
    const [keywords, setKeywords] = useState(searchParams.get("keywords"));
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Create a ref for the loading trigger element
    const observerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        // Your existing effect for search params
        const newKeywords = searchParams.get("keywords");
        const newCategory = searchParams.get("category") as Categories || null;
        const newOcasions = searchParams.getAll("ocasions") as Ocasions[];
        const newProductContent = searchParams.getAll("product_content") as ProductContent[];
        const newMinPrice = Number(searchParams.get("min_price") || price[0]);
        const newMaxPrice = Number(searchParams.get("max_price") || price[1]);
        const newSortBy = searchParams.get("sort_by") as SortBy || sortBy;

        setKeywords(newKeywords);
        setCategory(newCategory);
        setOcasions(newOcasions);
        setProductContent(newProductContent);
        setPrice([newMinPrice, newMaxPrice]);
        setSortBy(newSortBy);
    }, [searchParams])
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = trpc.products.getProducts.useInfiniteQuery({
        limit: productsLimit,
        title: keywords,
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
    const countProducts = data?.pages.reduce((total, page) => total += page.productsCount, 0) || 0;

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
            <div className="relative col-span-full grid grid-cols-full gap-x-2 lg:gap-x-6 mb-24">
                <CatalogSidebar      
                    keywordsState={{
                        keywords,
                        setKeywords
                    }}
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
                    setSidebarOpen={setSidebarOpen}
                    isSidebarOpen={isSidebarOpen}
                />
                 <PcCatalogSidebar        
                    keywordsState={{
                        keywords,
                        setKeywords
                    }}
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
                    setSidebarOpen={setSidebarOpen}
                    isSidebarOpen={isSidebarOpen}
                    searchText={keywords}
                    countProducts={countProducts}
                />
                
                <div 
                    ref={observerRef} 
                    className="col-span-full lg:col-start-4 lg:col-span-12 flex justify-center"
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