import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import pool from '../../../../lib/db';

// --- HÀM HELPER LƯU FILE (Nếu bạn chưa tách file utils) ---
async function saveFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo tên file unique
    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;

    // Lưu vào public/uploads
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
}

// --- METHOD PUT: CẬP NHẬT SẢN PHẨM ---
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // 1. Lấy ID từ URL (Ví dụ: /api/products/123 -> id = 123)
        const id = params.id;

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID sản phẩm' }, { status: 400 });
        }

        // 2. Đọc FormData gửi lên
        const formData = await request.formData();

        // 3. Lấy dữ liệu Text (Chỉ lấy các trường cho phép sửa)
        const name = formData.get('name') as string;
        // Chuyển category về dạng số (vì DB lưu INT)
        const categoryId = Number(formData.get('category'));
        const description = formData.get('description') as string;

        // Validate cơ bản
        if (!name || !categoryId) {
            return NextResponse.json({ error: 'Tên và danh mục không được để trống' }, { status: 400 });
        }

        // 4. Cập nhật bảng Products
        // Chỉ update: name, categoryId, description
        await pool.query(
            'UPDATE Products SET name = ?, categoryId = ?, description = ? WHERE id = ?',
            [name, categoryId, description || null, id]
        );

        // 5. Xử lý Ảnh mới (Nếu người dùng có upload thêm)
        const newImages = formData.getAll('images') as File[];

        if (newImages && newImages.length > 0) {
            const imageValues: any[] = [];
            const sqlPlaceholders: string[] = [];

            for (const image of newImages) {
                if (image instanceof File) {
                    // Lưu file vào ổ cứng
                    const imageUrl = await saveFile(image);

                    // Logic: Ảnh thêm sau thì KHÔNG phải là ảnh chính (isMain = false)
                    // Thứ tự insert: productId, imageUrl, isMain
                    imageValues.push(id, imageUrl, false);
                    sqlPlaceholders.push('(?, ?, ?)');
                }
            }

            // Thực hiện Insert vào bảng ProductImages
            if (imageValues.length > 0) {
                const sql = `INSERT INTO ProductImages (productId, imageUrl, isMain) VALUES ${sqlPlaceholders.join(', ')}`;
                await pool.query(sql, imageValues);
            }
        }

        return NextResponse.json({ message: 'Cập nhật sản phẩm thành công' });

    } catch (error: any) {
        console.error('PUT Error:', error);
        return NextResponse.json({ error: 'Lỗi server khi cập nhật', details: error.message }, { status: 500 });
    }
}

// --- METHOD DELETE: XÓA SẢN PHẨM ---
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });

        // Xóa sản phẩm (Các bảng con như ProductImages, ProductSizes sẽ tự xóa nếu bạn đã cài ON DELETE CASCADE trong MySQL)
        await pool.query('DELETE FROM Products WHERE id = ?', [id]);

        return NextResponse.json({ message: 'Xóa thành công' });
    } catch (error: any) {
        console.error('DELETE Error:', error);
        return NextResponse.json({ error: 'Lỗi server khi xóa' }, { status: 500 });
    }
}