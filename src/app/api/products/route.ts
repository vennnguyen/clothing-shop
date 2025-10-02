
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { Product } from '../../types/interfaces';



//danh sách sản phẩm
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy sản phẩm' }, { status: 500 });
  }
}

// thêm sản phẩm
export async function POST(request: NextRequest) {
  try {
    const data: Product = await request.json();

    const { name, material, categoryId } = data;

    const [result] = await pool.query(
      'INSERT INTO products (name, material, categoryId) VALUES (?, ?, ?)',
      [name, material || null, categoryId || null]
    );

    return NextResponse.json({ message: 'Thêm thành công', id: (result as any).insertId });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Lỗi khi thêm sản phẩm' }, { status: 500 });
  }
}

//cập nhật sản phẩm
export async function PUT(request: NextRequest) {
  try {
    const data: Product = await request.json();
    const { id, name, material, categoryId } = data;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID sản phẩm' }, { status: 400 });
    }

    await pool.query(
      'UPDATE products SET name = ?, material = ?, categoryId = ? WHERE id = ?',
      [name, material || null, categoryId || null, id]
    );

    return NextResponse.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Lỗi khi cập nhật' }, { status: 500 });
  }
}

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
