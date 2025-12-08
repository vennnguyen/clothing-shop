import { redirect } from "next/navigation";
import pool from "../../../lib/db";
import AccountTable from "../../../components/admin/accounts/AccountTable";

// lấy tài khoản từ database
async function getAccounts() { 
  try {
    const [rows]: any = await pool.query(`
      SELECT a.id, a.email, a.roleId, a.birthday, a.status, a.createdDate, a.fullName, r.name as roleName
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

// Lấy danh sách vai trò
async function getRoles() {
  try {
    const [rows]: any = await pool.query('SELECT id, name FROM roles ORDER BY id ASC');
    return rows;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
}

export default async function AccountsPage() {
  try {
    // Lấy danh sách
    const accounts = await getAccounts();
    const roles = await getRoles();

    return <AccountTable initialAccounts={accounts} roles={roles} />;
  } catch (error) {
    console.error("Error in AccountsPage:", error);
  }
}