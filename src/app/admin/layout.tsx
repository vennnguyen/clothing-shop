import Sidebar from "../../components/admin/SideBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-5">
                {children}
            </main>
        </div>
    );
}
