import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import pool from "../../../lib/db";
import AccountTable from "../../../components/admin/accounts/AccountTable";

// lấy tài khoản từ database
async function getAccounts() { 
  try {
    const [rows]: any = await pool.query(`
      SELECT a.id, a.email, a.roleId, a.birthday, a.status, a.createdDate, r.name as roleName
      FROM accounts a
      JOIN roles r ON a.roleId = r.id
      ORDER BY a.id DESC
    `);
    return rows;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
}

export default async function AccountsPage() {
  // Kiểm tra authentication
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Chỉ admin mới được truy cập
    if (payload.role !== "Admin") {
      redirect("/admin");
    }

    // Lấy danh sách tài khoản
    const accounts = await getAccounts();

    return <AccountTable initialAccounts={accounts} />;
  } catch (error) {
    // nếu lỗi chuyển về trang login
    redirect("/admin");
  }
}