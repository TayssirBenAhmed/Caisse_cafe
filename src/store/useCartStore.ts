import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Order, Table, Client } from '../types';

interface CartStore {
  cart: CartItem[];
  currentTable: number | null;
  currentServer: string;
  selectedCustomer: string | null;

  tables: Table[];
  orders: Order[];
  clients: Client[];

  setCurrentTable: (tableNumber: number | null) => void;
  addTable: (tableNumber: number) => void;
  updateTableStatus: (tableNumber: number, status: Table['status']) => void;
  assignServerToTable: (tableNumber: number, server: string) => void;
  addClientsToTable: (tableNumber: number, clientNames: string[]) => void;

  setSelectedCustomer: (customer: string | null) => void;
  addClient: (client: Client) => void;

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  createOrder: (tableNumber: number, clientNames?: string[]) => Order;
  markOrderAsPaid: (orderId: string) => void;
  getOrdersByStatus: (status: Order['status']) => Order[];
  getTableByNumber: (tableNumber: number) => Table | undefined;
  getCurrentTableOrders: () => Order[];

  getCartTotal: () => number;
  getVatBreakdown: () => { rate: number; amount: number }[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      currentTable: null,
      currentServer: 'سامي (Sami)',
      selectedCustomer: null,
      tables: [
        { id: 'TABLE-1', number: 1, status: 'libre', clients: [], createdAt: new Date() },
        { id: 'TABLE-2', number: 2, status: 'libre', clients: [], createdAt: new Date() },
        { id: 'TABLE-3', number: 3, status: 'libre', clients: [], createdAt: new Date() },
        { id: 'TABLE-4', number: 4, status: 'libre', clients: [], createdAt: new Date() },
        { id: 'TABLE-5', number: 5, status: 'libre', clients: [], createdAt: new Date() },
        { id: 'TABLE-6', number: 6, status: 'libre', clients: [], createdAt: new Date() },
        { id: 'TABLE-7', number: 7, status: 'libre', clients: [], createdAt: new Date() },
        { id: 'TABLE-8', number: 8, status: 'libre', clients: [], createdAt: new Date() },
        { id: 'TABLE-9', number: 9, status: 'libre', clients: [], createdAt: new Date() },
        { id: 'TABLE-10', number: 10, status: 'libre', clients: [], createdAt: new Date() },
      ],
      orders: [],
      clients: [],

      setCurrentTable: (tableNumber) => set({ currentTable: tableNumber }),

      addTable: (tableNumber) =>
        set((state) => {
          const existingTable = state.tables.find(t => t.number === tableNumber);
          if (existingTable) return state;

          const newTable: Table = {
            id: `TABLE-${tableNumber}`,
            number: tableNumber,
            status: 'libre',
            clients: [],
            createdAt: new Date(),
          };

          return { tables: [...state.tables, newTable] };
        }),

      updateTableStatus: (tableNumber, status) =>
        set((state) => ({
          tables: state.tables.map(table =>
            table.number === tableNumber ? { ...table, status } : table
          ),
        })),

      assignServerToTable: (tableNumber, server) =>
        set((state) => ({
          tables: state.tables.map(table =>
            table.number === tableNumber ? { ...table, server } : table
          ),
        })),

      addClientsToTable: (tableNumber, clientNames) =>
        set((state) => ({
          tables: state.tables.map(table =>
            table.number === tableNumber
              ? { ...table, clients: [...table.clients, ...clientNames] }
              : table
          ),
        })),

      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

      addClient: (client) => set((state) => ({
        clients: [...state.clients, client],
      })),

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find(item => item.product.id === product.id);

          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { product, quantity: 1 }],
          };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter(item => item.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: quantity === 0
            ? state.cart.filter(item => item.product.id !== productId)
            : state.cart.map(item =>
                item.product.id === productId ? { ...item, quantity } : item
              ),
        })),

      clearCart: () => set({ cart: [] }),

      createOrder: (tableNumber, clientNames = []) => {
        const state = get();
        const order: Order = {
          id: `ORD-${Date.now()}`,
          tableNumber: tableNumber,
          clientNames: state.selectedCustomer ? [state.selectedCustomer, ...clientNames] : clientNames,
          items: [...state.cart],
          total: state.getCartTotal(),
          vatBreakdown: state.getVatBreakdown(),
          status: 'pending',
          server: state.currentServer,
          createdAt: new Date(),
        };

        set({
          orders: [...state.orders, order],
          tables: state.tables.map(table =>
            table.number === tableNumber
              ? { ...table, status: 'occupée', currentOrder: order }
              : table
          ),
          cart: [],
          currentTable: null,
          selectedCustomer: null,
        });

        return order;
      },

      markOrderAsPaid: (orderId: string) =>
        set((state) => {
          const updatedOrders = state.orders.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  status: 'paid' as const,
                  paidAt: new Date(),
                }
              : order
          );

          const paidOrder = updatedOrders.find(o => o.id === orderId);
          let updatedTables = state.tables;

          if (paidOrder) {
            updatedTables = state.tables.map(table => {
              if (table.number === paidOrder.tableNumber) {
                return {
                  ...table,
                  status: 'libre',
                  currentOrder: undefined,
                  clients: [],
                };
              }
              return table;
            });
          }

          return {
            orders: updatedOrders,
            tables: updatedTables,
          };
        }),

      getOrdersByStatus: (status) => {
        return get().orders.filter(order => order.status === status);
      },
      // Dans votre store useCartStore.ts
resetAllData: () => {
  set({
    // Réinitialiser toutes les données
    cart: [],
    orders: [],
    tables: [
      { id: 'TABLE-1', number: 1, status: 'libre', clients: [], createdAt: new Date() },
      { id: 'TABLE-2', number: 2, status: 'libre', clients: [], createdAt: new Date() },
      // ... autres tables par défaut
    ],
    clients: [],
    currentTable: null,
    selectedCustomer: null,
    currentServer: 'سامي (Sami)'
  });
},

      getTableByNumber: (tableNumber) => {
        return get().tables.find(table => table.number === tableNumber);
      },

      getCurrentTableOrders: () => {
        const state = get();
        return state.orders.filter(order => order.tableNumber === state.currentTable);
      },

      getCartTotal: () => {
        const state = get();
        return state.cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getVatBreakdown: () => {
        const state = get();
        const vatRates = [0, 6, 12, 21];

        return vatRates.map(rate => {
          const itemsForRate = state.cart.filter(item => item.product.vatRate === rate);
          const amount = itemsForRate.reduce(
            (total, item) => total + (item.product.price * item.quantity * rate) / 100,
            0
          );
          return { rate, amount: parseFloat(amount.toFixed(3)) };
        });
      },
    }),
    {
      name: 'cafe-caisse-storage',
      partialize: (state) => ({
        cart: state.cart,
        tables: state.tables,
        orders: state.orders,
        clients: state.clients,
        currentTable: state.currentTable,
        currentServer: state.currentServer,
        selectedCustomer: state.selectedCustomer,
      }),
    }
  )
);
