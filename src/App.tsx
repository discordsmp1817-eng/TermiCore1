/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppProvider, useApp } from './context/AppContext';
import { PRODUCT_CATEGORIES } from './data/termicoreData';
import { findModelByRoute } from './utils/modelSpecifications';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RfqDrawer } from './components/RfqDrawer';
import { INDUSTRIAL_EASE } from './components/MotionPrimitives';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ModelDetailPage } from './pages/ModelDetailPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { QualityPage } from './pages/QualityPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage, QuotePage } from './pages/ContactQuotePages';

const STATIC_ROUTE_TITLES: Record<string, string> = {
  '/': 'TermiCore — Precision Terminal Block Connectors & Industrial Wiring Systems',
  '/products': 'Terminal Block Product Catalog | TermiCore',
  '/accessories': 'DIN Rail Accessories, Jumpers & End Plates | TermiCore',
  '/quality': 'Quality Testing, UL 1059 & IEC 60947-7-1 Compliance | TermiCore',
  '/about': 'About TermiCore | Industrial Connectivity Manufacturer',
  '/contact': 'Contact Engineering & Sales | TermiCore',
  '/quote': 'Request a Factory-Direct Quote | TermiCore',
};

function RouteView() {
  const { route } = useApp();

  useEffect(() => {
    const matchingCategory = PRODUCT_CATEGORIES.find((c) => c.slug === route);
    if (matchingCategory) {
      document.title = `${matchingCategory.title} (${matchingCategory.seriesCode}) | TermiCore`;
      return;
    }
    const matchedModel = findModelByRoute(route);
    if (matchedModel) {
      document.title = `${matchedModel.sku.model} — ${matchedModel.sku.name} | TermiCore`;
      return;
    }
    document.title =
      STATIC_ROUTE_TITLES[route] ||
      'TermiCore — Precision Terminal Block Connectors & Industrial Wiring Systems';
  }, [route]);

  const renderPage = () => {
    const matchingCategory = PRODUCT_CATEGORIES.find((c) => c.slug === route);
    if (matchingCategory) {
      return <CategoryDetailPage category={matchingCategory} />;
    }

    const matchedModel = findModelByRoute(route);
    if (matchedModel) {
      return (
        <ModelDetailPage
          sku={matchedModel.sku}
          category={matchedModel.category}
        />
      );
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.14, ease: INDUSTRIAL_EASE }}
        onAnimationComplete={() => ScrollTrigger.refresh()}
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
        <div className="min-h-screen flex flex-col bg-[#F5F7F9] text-[#101D2B]">
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
