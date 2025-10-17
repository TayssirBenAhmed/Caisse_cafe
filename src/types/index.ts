export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  vatRate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Table {
  id: string;
  number: number;
  status: 'libre' | 'occupée' | 'réservée';
  clients: string[];
  server?: string;
  currentOrder?: Order;
  createdAt: Date;
}

export interface Order {
  id: string;
  tableNumber: number;
  clientNames: string[];
  items: CartItem[];
  total: number;
  vatBreakdown: { rate: number; amount: number }[];
  status: 'pending' | 'preparing' | 'ready' | 'paid';
  server: string;
  createdAt: Date;
  paidAt?: Date;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  tableNumber?: number;
  totalSpent?: number;
  visits?: number;
}