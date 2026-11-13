/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { PRODUCT_CATEGORIES } from './data/termicoreData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RfqDrawer } from './components/RfqDrawer';
import { INDUSTRIAL_EASE } from './components/MotionPrimitives';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { QualityPage } from './pages/QualityPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage, QuotePage } from './pages/ContactQuotePages';

function RouteView() {
  const { route } = useApp();

  const renderPage = () => {
    const matchingCategory = PRODUCT_CATEGORIES.find((c) => c.slug === route);
    if (matchingCategory) {
      return <CategoryDetailPage category={matchingCategory} />;
    }

    switch (route) {
      case '/products':
        return <ProductsPage />;
      case '/accessories':
        return <AccessoriesPage />;
      case '/quality':
        return <QualityPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/quote':
        return <QuotePage />;
      case '/':
      default:
        return <HomePage />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={route}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.16, ease: INDUSTRIAL_EASE }}
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
          <Header />
          <main className="flex-1">
            <RouteView />
          </main>
          <Footer />
          <RfqDrawer />
        </div>
      </AppProvider>
    </MotionConfig>
  );
}
