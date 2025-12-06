
import AdminMainLayout from "../../components/admin/layouts/AdminMainLayout";
import { getUserFromCookie } from "../../lib/auth";
// Import file vừa tạo ở bước 1

// Đây là Server Component (không có "use client")
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // 1. Lấy user trên Server (Nhớ thêm await)
    const user = await getUserFromCookie();

    // 2. Truyền user và children xuống Client Component để hiển thị
    return (
        <AdminMainLayout user={user}>
            {children}
        </AdminMainLayout>
    );
}