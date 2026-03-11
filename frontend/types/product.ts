export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  categoryId?: number | null;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  category?: Category | null;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  product: Product;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
  profileImage?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}
