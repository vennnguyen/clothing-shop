
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { Product } from '../../types/interfaces';
import { writeFile } from 'fs/promises';
import path from 'path';


//danh sách sản phẩm
export async function GET() {
  try {
    const [rows] = await pool.query(`
        SELECT 
          p.id,
          p.name,
          p.price,
          p.description,
          cat.id AS categoryId,
          cat.name AS category,
          -- Lấy ảnh chính để hiển thị ngoài bảng (Table)
          (SELECT imageUrl FROM productimages WHERE productId = p.id AND isMain = true LIMIT 1) AS imageUrl,
          
          -- Lấy TOÀN BỘ ảnh gộp thành chuỗi để dùng cho Form Sửa
          -- Format: id::url, id::url
          GROUP_CONCAT(DISTINCT CONCAT(pi.id, '::', pi.imageUrl) SEPARATOR ', ') AS allImagesString,

          -- Size (Giữ nguyên của bạn)
          GROUP_CONCAT(DISTINCT CONCAT(s.sizeName, '(', ps.quantity, ')') ORDER BY s.sizeName SEPARATOR ', ') AS sizes

        FROM products p
        JOIN categories cat ON cat.id = p.categoryId
        JOIN productsizes ps ON ps.productId = p.id
        JOIN sizes s ON s.id = ps.sizeId
        LEFT JOIN productimages pi ON p.id = pi.productId -- Dùng LEFT JOIN an toàn hơn
        GROUP BY p.id
        ORDER BY p.id DESC;
      `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy sản phẩm' }, { status: 500 });
  }
}

async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Tạo tên file độc nhất để tránh trùng
  const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;

  // Đường dẫn lưu file: project/public/uploads
  const uploadDir = path.join(process.cwd(), "public/uploads");
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  // Trả về đường dẫn để lưu vào DB (ví dụ: /uploads/ten-anh.jpg)
  return `/uploads/${fileName}`;
}
// thêm sản phẩm
export async function POST(request: NextRequest) {
  const conn = await pool.getConnection();

  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));
    const quantity = Number(formData.get('quantity'));
    const categoryId = Number(formData.get('category'));
    const description = formData.get('description') as string;
    const size = Number(formData.get('size'));
    const images = formData.getAll('images') as File[];

    await conn.beginTransaction();

    // INSERT product
    const [result] = await conn.query(
      `INSERT INTO products (name, price, description, categoryId) 
       VALUES (?, ?, ?, ?)`,
      [name, price, description, categoryId]
    );

    const newProductId = (result as any).insertId;

    // INSERT size
    await conn.query(
      `INSERT INTO productsizes (productId, sizeId, quantity) VALUES (?, ?, ?)`,
      [newProductId, size, quantity]
    );

    // INSERT images
    if (images && images.length > 0) {
      const imageValues = [];
      const sqlPlaceholders = [];

      // Dùng vòng lặp có index để check ảnh đầu tiên
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        if (image instanceof File) {
          const imageUrl = await saveFile(image);

          // Logic: Nếu là ảnh đầu tiên (i === 0) thì isMain = true, ngược lại false
          const isMain = i === 0;

          // Chuẩn bị dữ liệu insert khớp với bảng ProductImages
          // Thứ tự: productId, imageUrl, isMain
          imageValues.push(newProductId, imageUrl, isMain);
          sqlPlaceholders.push('(?, ?, ?)');
        }
      }

      // Insert nhiều ảnh cùng lúc
      if (imageValues.length > 0) {
        // Lưu ý tên bảng và tên cột đã sửa theo CamelCase bạn cung cấp
        const sql = `INSERT INTO ProductImages (productId, imageUrl, isMain) VALUES ${sqlPlaceholders.join(', ')}`;
        await conn.query(sql, imageValues);
      }
    }

    await conn.commit();

    return NextResponse.json({ message: "Thêm thành công", id: newProductId });

  } catch (error: any) {
    console.error("POST error:", error.message);
    await conn.rollback();
    return NextResponse.json({ error: "Lỗi khi thêm sản phẩm" }, { status: 500 });

  } finally {
    conn.release();
  }
}

//cập nhật sản phẩm
// export async function PUT(request: NextRequest) {
//   try {
//     const data: Product = await request.json();
//     const { id, name, material, categoryId } = data;

//     if (!id) {
//       return NextResponse.json({ error: 'Thiếu ID sản phẩm' }, { status: 400 });
//     }

//     await pool.query(
//       'UPDATE products SET name = ?, material = ?, categoryId = ? WHERE id = ?',
//       [name, material || null, categoryId || null, id]
//     );

//     return NextResponse.json({ message: 'Cập nhật thành công' });
//   } catch (error) {
//     console.error('PUT error:', error);
//     return NextResponse.json({ error: 'Lỗi khi cập nhật' }, { status: 500 });
//   }
// }

// xóa sản phẩm 
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID sản phẩm' }, { status: 400 });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa' }, { status: 500 });
  }
}
