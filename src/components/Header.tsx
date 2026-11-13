import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, FileSpreadsheet } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRODUCT_CATEGORIES, RoutePath } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { INDUSTRIAL_EASE } from './MotionPrimitives';

export function Header() {
  const { route, navigate, rfqItems, openDrawer } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleNav = (to: RoutePath) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate(to);
  };

  const isProductRoute =
    route === '/products' ||
    PRODUCT_CATEGORIES.some((cat) => cat.slug === route);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6 lg:h-16">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer rounded"
          aria-label="TermiCore Home"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect x="2" y="3" width="20" height="18" rx="3" stroke="#0F172A" strokeWidth="2" />
            <path d="M7 9H17M7 15H17" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="9" r="1.5" fill="#0F172A" />
            <circle cx="12" cy="15" r="1.5" fill="#0F172A" />
          </svg>
          <span className="font-display text-lg font-bold tracking-tight text-slate-950">
            TermiCore
          </span>
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => handleNav('/')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-950 cursor-pointer ${
              route === '/'
                ? 'text-slate-950 font-semibold underline decoration-[#0284C7] decoration-2 underline-offset-8'
                : ''
            }`}
          >
            Home
          </button>

          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNav('/products')}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-950 cursor-pointer ${
                  isProductRoute
                    ? 'text-slate-950 font-semibold underline decoration-[#0284C7] decoration-2 underline-offset-8'
                    : ''
                }`}
              >
                Products
              </button>
              <button
                type="button"
                aria-expanded={dropdownOpen}
                aria-label="Toggle product series menu"
                onClick={() => setDropdownOpen((o) => !o)}
                className="p-1 text-slate-500 hover:text-slate-950 transition-colors cursor-pointer rounded"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: INDUSTRIAL_EASE }}
                  className="absolute left-0 top-full mt-3 w-80 rounded-lg border border-slate-200 bg-white p-2 shadow-lg origin-top-left"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Connection Technologies
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNav('/products')}
                      className="text-xs font-semibold text-[#0284C7] hover:text-[#1D4ED8] cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  <ul className="space-y-0.5">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => handleNav(cat.slug)}
                          className={`w-full flex items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                            route === cat.slug
                              ? 'bg-slate-100 text-slate-950 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                          }`}
                        >
                          <span className="truncate">{cat.title}</span>
                          <span className="font-mono text-[11px] text-slate-500 shrink-0">
                            {cat.seriesCode}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => handleNav('/accessories')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-950 cursor-pointer ${
              route === '/accessories'
                ? 'text-slate-950 font-semibold underline decoration-[#0284C7] decoration-2 underline-offset-8'
                : ''
            }`}
          >
            Accessories
          </button>

          <button
            type="button"
            onClick={() => handleNav('/quality')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-950 cursor-pointer ${
              route === '/quality'
                ? 'text-slate-950 font-semibold underline decoration-[#0284C7] decoration-2 underline-offset-8'
                : ''
            }`}
          >
            Quality
          </button>

          <button
            type="button"
            onClick={() => handleNav('/about')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-950 cursor-pointer ${
              route === '/about'
                ? 'text-slate-950 font-semibold underline decoration-[#0284C7] decoration-2 underline-offset-8'
                : ''
            }`}
          >
            About Us
          </button>

          <button
            type="button"
            onClick={() => handleNav('/contact')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-slate-950 cursor-pointer ${
              route === '/contact'
                ? 'text-slate-950 font-semibold underline decoration-[#0284C7] decoration-2 underline-offset-8'
                : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          {rfqItems.length > 0 ? (
            <button
              type="button"
              onClick={openDrawer}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>RFQ List ({rfqItems.length})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNav('/quote')}
              className="inline-flex items-center justify-center rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              Get a Quote
            </button>
          )}

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex lg:hidden items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[44px] min-w-[44px]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
            className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-lg max-h-[82vh] overflow-y-auto"
          >
            <nav aria-label="Mobile Navigation" className="space-y-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleNav('/')}
                  className={`w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium min-h-[44px] cursor-pointer ${
                    route === '/' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/products')}
                  className={`w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium min-h-[44px] cursor-pointer ${
                    route === '/products' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  All Products
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/accessories')}
                  className={`w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium min-h-[44px] cursor-pointer ${
                    route === '/accessories' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Accessories
                </button>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="px-3 pb-1.5 text-xs font-semibold text-slate-500">
                  Connection Technologies
                </div>
                <div className="space-y-1">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleNav(cat.slug)}
                      className={`w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm min-h-[44px] cursor-pointer ${
                        route === cat.slug
                          ? 'bg-slate-100 text-slate-950 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{cat.title}</span>
                      <span className="font-mono text-xs text-slate-500">{cat.seriesCode}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1">
                <button
                  type="button"
                  onClick={() => handleNav('/quality')}
                  className="w-full text-left rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[44px] cursor-pointer"
                >
                  Quality &amp; Approvals
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/about')}
                  className="w-full text-left rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[44px] cursor-pointer"
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/contact')}
                  className="w-full text-left rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[44px] cursor-pointer"
                >
                  Contact
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/quote')}
                  className="w-full text-center rounded-lg bg-[#1D4ED8] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF] min-h-[44px] cursor-pointer mt-2"
                >
                  Request Factory-Direct Quote
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
