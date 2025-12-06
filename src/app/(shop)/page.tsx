import { PackageX } from "lucide-react";
import Banner from "../../components/ui/Banner";
import Categories from "../../components/ui/Categories";
import ProductCard from "../../components/ui/ProductCard";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function HomePage(props: { searchParams: SearchParams }) {
    // Lấy tham số từ URL
    const searchParams = await props.searchParams;
    const selectedCategoryId = searchParams.categoryId;

    let productApiUrl = "http://localhost:3000/api/products";

    if (selectedCategoryId) {
        // Nếu có categoryId, nối thêm vào query string để API lọc
        productApiUrl += `?categoryId=${selectedCategoryId}`;
    }

    const productsData = fetch(productApiUrl, { cache: "no-store" });
    const categoriesData = fetch("http://localhost:3000/api/categories", { cache: "no-store" });

    const [productsResult, categoriesResult] = await Promise.all([productsData, categoriesData]);
    const products = await productsResult.json();

    const categories = await categoriesResult.json();

    return (
        <div>
            {/* Banner giữ nguyên ở trên cùng */}
            <Banner />

            {/* CONTAINER CHÍNH: Chia cột tại đây */}
            <div className="container mx-auto px-17 py-8 flex flex-col md:flex-row gap-8 ">

                {/* CỘT TRÁI: Danh mục (Chiếm 1/4 chiều rộng trên Desktop) */}
                <aside className="w-full md:w-2/12">
                    <h3 className="font-bold text-xl mb-4 text-gray-800 border-gray-200 border-b">Danh mục</h3>
                    <Categories categories={categories} selectedId={selectedCategoryId as string} />
                </aside>

                {/* CỘT PHẢI: Sản phẩm (Chiếm 3/4 chiều rộng trên Desktop) */}
                <main className="w-full md:w-10/12">
                    {/* Grid sản phẩm: Chỉnh lại grid-cols để hiển thị đẹp hơn trong không gian hẹp hơn */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {products.map((item: any) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-500">
                            <PackageX className="w-16 h-16 text-gray-400" />
                            <p className="text-lg font-semibold">Không có sản phẩm nào</p>
                            {/* <span className="text-sm text-gray-400">Hãy thêm sản phẩm mới!</span> */}
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}