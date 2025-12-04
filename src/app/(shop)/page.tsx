import Banner from "../../components/ui/Banner";
import Categories from "../../components/ui/Categories";
import ProductCard from "../../components/ui/ProductCard";


export default async function HomePage() {
    // 1. Fetch dữ liệu (Giữ nguyên logic cũ của bạn)
    const productsResult = await fetch("http://localhost:3000/api/products", {
        cache: "no-store",
    });
    const products = await productsResult.json();

    const categoryResult = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store",
    });
    const categories = await categoryResult.json();

    return (
        <div>
            {/* Banner giữ nguyên ở trên cùng */}
            <Banner />

            {/* CONTAINER CHÍNH: Chia cột tại đây */}
            <div className="container mx-auto px-17 py-8 flex flex-col md:flex-row gap-8 ">

                {/* CỘT TRÁI: Danh mục (Chiếm 1/4 chiều rộng trên Desktop) */}
                <aside className="w-full md:w-2/12">
                    <h3 className="font-bold text-xl mb-4 text-gray-800 border-gray-200 border-b">Danh mục</h3>
                    <Categories categories={categories} />
                </aside>

                {/* CỘT PHẢI: Sản phẩm (Chiếm 3/4 chiều rộng trên Desktop) */}
                <main className="w-full md:w-10/12">
                    {/* Grid sản phẩm: Chỉnh lại grid-cols để hiển thị đẹp hơn trong không gian hẹp hơn */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((item: any) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                </main>

            </div>
        </div>
    );
}