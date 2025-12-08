import pool from "../../../lib/db";
import CustomerTable from "../../../components/admin/customers/CustomerTable";

// lấy danh sách khách hàng từ database
async function getCustomers() {
  try {
    const [rows]: any = await pool.query(`SELECT * FROM customers`);
    return rows;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

export default async function CustomersPage() {
  try {
    // Lấy danh sách
    const customers = await getCustomers();
    return <CustomerTable initialCustomers={customers} />;
  } catch (error) {
    console.error("Error in CustomersPage:", error);
  } 
}
