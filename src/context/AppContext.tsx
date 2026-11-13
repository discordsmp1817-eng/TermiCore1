import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RoutePath } from '../data/termicoreData';

export interface RfqItem {
  id: string;
  model: string;
  title: string;
  category: string;
  specSummary: string;
  quantity: number;
}

export type LegalModalType = 'privacy' | 'terms' | 'sitemap' | null;

interface AppContextValue {
  route: RoutePath;
  navigate: (to: RoutePath) => void;
  rfqItems: RfqItem[];
  addToRfq: (item: Omit<RfqItem, 'quantity'> & { quantity?: number }) => void;
  updateRfqQuantity: (id: string, quantity: number) => void;
  removeFromRfq: (id: string) => void;
  clearRfq: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  legalModal: LegalModalType;
  setLegalModal: (modal: LegalModalType) => void;
}

const VALID_ROUTES: RoutePath[] = [
  '/',
  '/products',
  '/accessories',
  '/spring-cage-connection',
  '/screw-connection',
  '/screw-support',
  '/bolt-connection',
  '/nut-connection',
  '/quality',
  '/about',
  '/contact',
  '/quote',
];

function normalizePath(rawPath: string): RoutePath {
  const cleaned = rawPath.replace(/\/+$/, '').replace(/\.html$/i, '') || '/';
  if (cleaned === '/index') return '/';
  if (VALID_ROUTES.includes(cleaned as RoutePath)) {
    return cleaned as RoutePath;
  }
  return '/';
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<RoutePath>(() => normalizePath(window.location.pathname));
  const [rfqItems, setRfqItems] = useState<RfqItem[]>(() => {
    try {
      const saved = localStorage.getItem('termicore_rfq_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  useEffect(() => {
    try {
      localStorage.setItem('termicore_rfq_items', JSON.stringify(rfqItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [rfqItems]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: RoutePath) => {
    const normalized = normalizePath(to);
    if (window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setRoute(normalized);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const addToRfq = useCallback((item: Omit<RfqItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = item.quantity && item.quantity > 0 ? item.quantity : 100;
    setRfqItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qtyToAdd } : i
        );
      }
      return [...prev, { ...item, quantity: qtyToAdd }];
    });
    setIsDrawerOpen(true);
  }, []);

  const updateRfqQuantity = useCallback((id: string, quantity: number) => {
    setRfqItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  }, []);

  const removeFromRfq = useCallback((id: string) => {
    setRfqItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearRfq = useCallback(() => {
    setRfqItems([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        rfqItems,
        addToRfq,
        updateRfqQuantity,
        removeFromRfq,
        clearRfq,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        legalModal,
        setLegalModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
