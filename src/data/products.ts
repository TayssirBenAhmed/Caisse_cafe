import { Product } from '../types';

export const products: Product[] = [
  // CAFÉ & THÉ
  {
    id: '1',
    name: 'Café Expresso',
    price: 3.500,
    category: 'chaud',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200',
    vatRate: 7
  },
  {
    id: '2', 
    name: 'Café Crème',
    price: 4.000,
    category: 'chaud',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200',
    vatRate: 7
  },
  {
    id: '3',
    name: 'Thé à la Menthe',
    price: 5.000,
    category: 'chaud', 
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200',
    vatRate: 7
  },
  {
    id: '4',
    name: 'Cappuccino',
    price: 6.000,
    category: 'chaud',
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=200',
    vatRate: 7
  },

  // BOISSONS FROIDES
  {
    id: '5',
    name: 'Jus d\'Orange',
    price: 5.000,
    category: 'froid',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200',
    vatRate: 7
  },
  {
    id: '6',
    name: 'Eau Minérale',
    price: 2.000,
    category: 'froid',
    image: 'https://images.unsplash.com/photo-1548839149-851a5d7bfd4a?w=200',
    vatRate: 7
  },
  {
    id: '7',
    name: 'Soda Citron',
    price: 4.000,
    category: 'froid',
    image: 'https://images.unsplash.com/photo-1624555130581-1d9cca8ad059?w=200',
    vatRate: 18
  },

  // PATISSERIES
  {
    id: '8',
    name: 'Croissant',
    price: 3.000,
    category: 'patisserie',
    image: 'https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=200',
    vatRate: 7
  },
  {
    id: '9',
    name: 'Pain au Chocolat',
    price: 3.500,
    category: 'patisserie',
    image: 'https://images.unsplash.com/photo-1586995535456-47457b6d7e55?w=200',
    vatRate: 7
  },
  {
    id: '10',
    name: 'Éclair au Chocolat',
    price: 6.000,
    category: 'patisserie',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200',
    vatRate: 7
  },
  {
    id: '11',
    name: 'Mille-feuille',
    price: 7.000,
    category: 'patisserie',
    image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=200',
    vatRate: 7
  },
  {
    id: '12',
    name: 'Tarte aux Pommes',
    price: 8.000,
    category: 'patisserie',
    image: 'https://images.unsplash.com/photo-1561626423-a51b45aef0a4?w=200',
    vatRate: 7
  }
];

export const categories = [
  { id: 'chaud', name: '☕ Boissons Chaudes', icon: '☕' },
  { id: 'froid', name: '🥤 Boissons Froides', icon: '🥤' },
  { id: 'patisserie', name: '🥐 Pâtisseries', icon: '🥐' }
];

export const servers = [
  'سامي (Sami)',
  'أحمد (Ahmed)', 
  'محمد (Mohamed)',
  'خالد (Khaled)',
  'يوسف (Youssef)',
  'علي (Ali)'
];