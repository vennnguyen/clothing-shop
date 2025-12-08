import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import pool from "../../../lib/db";
import RoleTable from "../../../components/admin/roles/RoleTable";

async function getAccountsWithRoles() {
  try {
    const [rows]: any = await pool.query(`
      SELECT a.id, a.email, a.roleId, r.name as roleName
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

async function getRoles() {
  try {
    const [rows]: any = await pool.query('SELECT id, name FROM roles ORDER BY id ASC');
    return rows;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
}

export default async function RolesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "Admin") {
      redirect("/admin/dashboard");
    }

    const accounts = await getAccountsWithRoles();
    const roles = await getRoles();

    return <RoleTable initialAccounts={accounts} roles={roles} />;
  } catch (error) {
    redirect("/admin/login");
  }
}