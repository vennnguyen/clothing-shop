// utils/checkDependencies.ts
import { Pool } from "mysql2/promise"; // Hoặc import pool type của bạn

interface DependencyConfig {
    table: string;      // Tên bảng cần check (VD: 'orderdetails')
    column: string;     // Tên cột khóa ngoại (VD: 'productId')
    type: string;       // Mã lỗi trả về FE (VD: 'HAS_ORDER')
    message: string;    // Thông báo lỗi
}

export async function checkDependencies(
    pool: Pool,
    id: string | number,
    checks: DependencyConfig[]
) {
    for (const check of checks) {
        const [rows]: any = await pool.query(
            `SELECT 1 FROM ${check.table} WHERE ${check.column} = ? LIMIT 1`,
            [id]
        );

        if (rows.length > 0) {
            // Nếu tìm thấy dữ liệu liên quan, trả về object lỗi ngay lập tức
            return {
                type: check.type,
                message: check.message,
                conflict: true // Cờ để biết là có xung đột
            };
        }
    }

    // Nếu chạy hết vòng lặp mà không thấy gì -> An toàn để xóa
    return null;
}