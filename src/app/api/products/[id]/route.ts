import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import pool from '../../../../lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });

        // 1. Truy vấn thông tin sản phẩm (Bảng Products)
        const [productRows]: any = await pool.query(
            'SELECT * FROM Products WHERE id = ?',
            [id]
        );

        const product = productRows[0];

        if (!product) {
            return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
        }

        // 2. Truy vấn danh sách ảnh (Bảng ProductImages)
        // Lấy các cột cần thiết: id, imageUrl, isMain
        const [imageRows]: any = await pool.query(
            'SELECT id, imageUrl, isMain FROM productimages WHERE productId = ?',
            [id]
        );

        // 3. Gán danh sách ảnh vào object product
        // Lúc này product sẽ có dạng: { id: 1, name: '...', images: [...] }
        product.images = imageRows;

        // (Tùy chọn) 4. Truy vấn Sizes nếu bạn đã làm bảng ProductSizes

        // const [sizeRows]: any = await pool.query(
        //     'SELECT sizeId, quantity FROM ProductSizes WHERE productId = ?',
        //     [id]
        // );
        // product.sizes = sizeRows;

        return NextResponse.json(product);

    } catch (error) {
        console.error('GET Detail Error:', error);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
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

        // 4. Cập nhật bảng Products
        // Chỉ update: name, categoryId, description
        await pool.query(
            'UPDATE Products SET name = ?, categoryId = ?, description = ? WHERE id = ?',
            [name, categoryId, description || null, id]
        );

        const keptImageIdsString = formData.get('keptImageIds') as string;
        const keptImageIds: number[] = keptImageIdsString ? JSON.parse(keptImageIdsString) : [];

        // Logic: Tìm những ảnh nằm trong DB của sản phẩm này NHƯNG không nằm trong danh sách giữ lại
        let deleteQuery = '';
        let deleteParams: any[] = [id];

        if (keptImageIds.length > 0) {
            // Nếu có ảnh giữ lại -> Xóa các ảnh KHÁC các ID này
            const placeholders = keptImageIds.map(() => '?').join(',');
            deleteQuery = `SELECT id, imageUrl FROM ProductImages WHERE productId = ? AND id NOT IN (${placeholders})`;
            deleteParams.push(...keptImageIds);
        } else {
            // Nếu danh sách giữ lại rỗng (User xóa hết ảnh cũ) -> Lấy tất cả ảnh cũ để xóa
            deleteQuery = `SELECT id, imageUrl FROM ProductImages WHERE productId = ?`;
        }

        //Lấy danh sách file cần xóa từ db
        const [imagesToDelete]: any = await pool.query(deleteQuery, deleteParams);
        // Xóa file vật lý trong thư mục public/uploads
        for (const img of imagesToDelete) {
            try {
                const filePath = path.join(process.cwd(), "public", img.imageUrl);
                await unlink(filePath);
            } catch (error) {
                console.warn(`Không xóa được file ảnh cũ: ${img.imageUrl}`, error);
                // Vẫn tiếp tục chạy để xóa trong DB
            }
        }

        // Xóa ảnh trong database 
        if (imagesToDelete.length > 0) {
            const idsToDelete = imagesToDelete.map((img: any) => img.id);
            const deletePlaceholders = idsToDelete.map(() => '?').join(',');

            await pool.query(`
                    DELETE FROM productimages WHERE id IN (${deletePlaceholders})
                `, idsToDelete)
        }

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