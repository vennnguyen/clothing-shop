
export interface Account {
  id?: number;
  email?: string | null;
  password?: string | null;
  roleId?: number | null;
  birthday?: string | null;
  status?: number | null;
  createdDate?: string | null;   // ISO date string
}

export interface CardDetail {
  cardId: number;
  productId: number;
  quantity?: number | null;
}

export interface Card {
  id?: number;
  customerId?: number | null;
}

export interface Category {
  id?: number;
  name?: string | null;
}

export interface Customer {
  id?: number;
  email?: string | null;
  password?: string | null;
  createdDate?: string | null;
}

export interface Import {
  id?: number;                 // tương ứng importId
  date?: string | null;        // ISO date string
  total?: number | null;
  supplierId?: number | null;
  status?: string | null;
}

export interface ImportDetail {
  id?: number;                 // tương ứng importDetailId
  importId?: number | null;
  productId?: number | null;
  quantity?: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
}



export interface ImportReciept {
  id?: number;
  createdDate?: string | null;
  supplierId?: number | null;
  accountId?: number | null;
  cost?: number | null;
}

export interface OrderDetail {
  orderId: number;
  productId: number;
  price?: number | null;
  quantity?: number | null;
}
interface OrderItem {
  productId: number;
  price: number;
  quantity: number;
}

export interface Order {
  createdDate?: string;
  shippedDate?: string | null;
  status?: number;
  cost: number;
  items: OrderItem[];
}

export interface Product {
  id: number;
  name: string | null;
  price: number;
  category: number | null;
  sizes: string | null;
  description?: string;
  quantity?: number | null;
  imageUrl: string | null;
  categoryId: number;
  sizeId: number;
}
export interface ProductSizes {
  sizeId: number;
  sizeName: string | number;
  quantity: string | number;
}
export interface Role {
  id: number;
  name?: string | null;
}

export interface Status {
  id: number;
  name?: string | null;
  description?: string | null;
}

export interface Supplier {
  id?: number;
  name?: string | null;
  address?: string | null;
  phone?: string | null;
}
