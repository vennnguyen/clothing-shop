import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import AccountTable from "../../../components/admin/accounts/AccountTable";


export default async function AccountsPage() {
  // Kiểm tra authentication
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Chỉ admin mới được truy cập
    if (payload.role !== "admin") {
      redirect("/admin");
    }

    // Lấy danh sách tài khoản
    const res = await fetch(`/api/accounts`);
    if (!res.ok) throw new Error("Failed to fetch accounts");
    const accounts = await res.json();

    return <AccountTable initialAccounts={accounts} />;
  } catch (error) {
    redirect("/admin/login");
  }
}