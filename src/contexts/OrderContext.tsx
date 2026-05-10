import { createContext, useContext, useState, type ReactNode } from 'react';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  status: 'pending' | 'preparing' | 'cooking' | 'plating' | 'ready';
}

export interface Order {
  id: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'cooking' | 'ready' | 'served';
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  createdAt: string;
}

interface OrderContextType {
  currentOrder: Order | null;
  orderHistory: Order[];
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  const placeOrder = (order: Order) => {
    setCurrentOrder(order);
    setOrderHistory(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setCurrentOrder(prev => {
      if (!prev || prev.id !== orderId) return prev;
      return { ...prev, status };
    });
  };

  const updateItemStatus = (orderId: string, itemId: string, status: OrderItem['status']) => {
    setCurrentOrder(prev => {
      if (!prev || prev.id !== orderId) return prev;
      return {
        ...prev,
        items: prev.items.map(i => i.id === itemId ? { ...i, status } : i)
      };
    });
  };

  return (
    <OrderContext.Provider value={{ currentOrder, orderHistory, placeOrder, updateOrderStatus, updateItemStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}
