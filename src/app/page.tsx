// "use client";

import Link from "next/link";
import Banner from "../components/ui/Banner";
import ProductCard from "../components/ui/ProductCard";

// app/page.tsx
export default async function HomePage() {
    const res = await fetch("http://localhost:3000/api/products", {
        cache: "no-store", // luôn lấy mới
    });

    const products = await res.json();
    console.log(products);
    return (
        <div>
            {/* Banner */}
            <Banner />


            <div className="grid grid-cols-2 md:grid-cols-4 gap-7 px-20">

                {products.map((item) => (
                    <ProductCard key={item.id} product={item} />
                ))}

            </div>
        </div>
    );
}
