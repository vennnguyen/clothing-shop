import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/SideBar";
import 'react-toastify/dist/ReactToastify.css';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-5">
                {children}
                <ToastContainer />
            </main>
        </div>
    );
}
