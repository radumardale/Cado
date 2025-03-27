'use client'

import { useState } from "react";
import CatalogSidebar from "./sidebar/CatalogSidebar";
import ProductsGrid from "./productsGrid/ProductsGrid";
import { trpc } from "@/app/_trpc/client";
import { Categories } from "@/lib/enums/Categories";
import { Ocasions } from "@/lib/enums/Ocasions";
import { ProductContent } from "@/lib/enums/ProductContent";
import SortBy from "@/lib/enums/SortBy";

export default function Catalog() {
    const [categories, setCategories] = useState<Categories[]>([]) 
    const [ocasions, setOcasions] = useState<Ocasions[]>([]);
    const [productContent, setProductContent] = useState<ProductContent[]>([]);
    const [price, setPrice] = useState([0, 5000]);
    const [sortBy, setSortBy] = useState<SortBy>(SortBy.RECOMMENDED)
    
    const { data, isLoading } = trpc.products.getProducts.useQuery({
        chunk: 0, 
        categories: categories, 
        ocasions: ocasions, 
        productContent: productContent,
        price: {
            min: price[0],
            max: price[1]
        },
        sortBy: sortBy
    });
    
    const products = data?.products || [];

    return (
        <>
            <CatalogSidebar                 
                categoriesState={{
                    categories,
                    setCategories
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
                products={products} 
                loading={isLoading}
                setSortBy={setSortBy}
            />
        </>
    );
}

    // useEffect(() => {
    //     const handleScroll = async () => {
    //         const progress = (window.scrollY + window.innerHeight) / document.body.clientHeight;
    //         if (progress > 0.95) {
    //             const res = trpc.products.getAllProducts.useQuery({chunk: chunksLoaded}).data;
    //             setProducts([...products, res?.products]);
    //             setChunksLoaded(chunksLoaded + 1);

    //             window.removeEventListener("scroll", handleScroll);
    //             setTimeout(() => {
    //                 window.addEventListener("scroll", handleScroll);
    //             }, 3000);
    //         }
    //     };

    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, []);