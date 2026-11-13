import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, FileSpreadsheet, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { IMAGES, PRODUCT_CATEGORIES, RoutePath, resolveAssetUrl } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { INDUSTRIAL_EASE, MagneticButton } from './MotionPrimitives';

export function Header() {
  const { route, navigate, rfqItems, openDrawer } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const navItemClass = (active: boolean) =>
    `relative whitespace-nowrap shrink-0 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
      active
        ? 'text-[#0F172A] font-semibold'
        : 'text-[#475569] hover:text-[#0F172A]'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.06)]'
          : 'border-b border-slate-200/70 bg-[#F7F9FB]/85 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6 lg:h-16">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="group flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer rounded"
          aria-label="TermiCore Home"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs transition-transform duration-300 group-hover:scale-105">
            <img
              src={resolveAssetUrl(IMAGES.logo)}
              alt="TermiCore logo"
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-[#0F172A]">
            TermiCore
          </span>
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
          <button
            type="button"
            onClick={() => handleNav('/')}
            className={navItemClass(route === '/')}
          >
            <span>Home</span>
            {route === '/' && (
              <motion.span
                layoutId="headerTealUnderline"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
              />
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNav('/products')}
                className={navItemClass(isProductRoute)}
              >
                <span>Products</span>
                {isProductRoute && (
                  <motion.span
                    layoutId="headerTealUnderline"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
                  />
                )}
              </button>
              <button
                type="button"
                aria-expanded={dropdownOpen}
                aria-label="Toggle product series menu"
                onClick={() => setDropdownOpen((o) => !o)}
                className="p-1 text-[#475569] hover:text-[#0F766E] transition-colors cursor-pointer rounded"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180 text-[#0F766E]' : ''
                  }`}
                />
              </button>
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
                  className="absolute left-0 top-full mt-3 w-84 rounded-lg border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)] origin-top-left"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#64748B]">
                      Connection Technologies
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNav('/products')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:text-[#0D9488] transition-colors cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                  <ul className="space-y-0.5">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => handleNav(cat.slug)}
                          className={`group w-full flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                            route === cat.slug
                              ? 'bg-[#EEF2F6] text-[#0F172A] font-semibold border border-[#0F766E]/25'
                              : 'text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A] border border-transparent'
                          }`}
                        >
                          <span className="truncate">{cat.title}</span>
                          <span className="font-mono text-[11px] text-[#0F766E] shrink-0">
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
            className={navItemClass(route === '/accessories')}
          >
            <span>Accessories</span>
            {route === '/accessories' && (
              <motion.span
                layoutId="headerTealUnderline"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('/quality')}
            className={navItemClass(route === '/quality')}
          >
            <span>Quality</span>
            {route === '/quality' && (
              <motion.span
                layoutId="headerTealUnderline"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('/about')}
            className={navItemClass(route === '/about')}
          >
            <span>About Us</span>
            {route === '/about' && (
              <motion.span
                layoutId="headerTealUnderline"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('/contact')}
            className={navItemClass(route === '/contact')}
          >
            <span>Contact</span>
            {route === '/contact' && (
              <motion.span
                layoutId="headerTealUnderline"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#0F766E]"
              />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          {rfqItems.length > 0 ? (
            <MagneticButton
              type="button"
              onClick={openDrawer}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>RFQ List ({rfqItems.length})</span>
            </MagneticButton>
          ) : (
            <MagneticButton
              type="button"
              onClick={() => handleNav('/quote')}
              className="inline-flex items-center justify-center rounded-lg bg-[#0F766E] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              Get a Quote
            </MagneticButton>
          )}

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex lg:hidden items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-[#0F172A] hover:border-[#0F766E] cursor-pointer min-h-[44px] min-w-[44px] transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: INDUSTRIAL_EASE }}
            className="lg:hidden overflow-hidden border-t border-slate-200 bg-white shadow-xl"
          >
            <nav
              aria-label="Mobile Navigation"
              className="px-4 py-5 space-y-4 max-h-[82vh] overflow-y-auto"
            >
              <div className="space-y-1">
                {[
                  { label: 'Home', path: '/' as RoutePath },
                  { label: 'All Products', path: '/products' as RoutePath },
                  { label: 'Accessories', path: '/accessories' as RoutePath },
                ].map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium min-h-[44px] cursor-pointer transition-colors ${
                      route === item.path
                        ? 'bg-[#EEF2F6] text-[#0F172A] font-semibold border border-[#0F766E]/25'
                        : 'text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="px-3 pb-1.5 text-xs font-semibold text-[#0F766E]">
                  Connection Technologies
                </div>
                <div className="space-y-1">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleNav(cat.slug)}
                      className={`w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm min-h-[44px] cursor-pointer transition-colors ${
                        route === cat.slug
                          ? 'bg-[#EEF2F6] text-[#0F172A] font-semibold border border-[#0F766E]/25'
                          : 'text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A]'
                      }`}
                    >
                      <span className="truncate">{cat.title}</span>
                      <span className="font-mono text-xs text-[#0F766E]">{cat.seriesCode}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-1">
                <button
                  type="button"
                  onClick={() => handleNav('/quality')}
                  className={`w-full text-left rounded-md px-3 py-2.5 text-sm font-medium min-h-[44px] cursor-pointer transition-colors ${
                    route === '/quality'
                      ? 'bg-[#EEF2F6] text-[#0F172A] font-semibold'
                      : 'text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A]'
                  }`}
                >
                  Quality &amp; Approvals
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/about')}
                  className={`w-full text-left rounded-md px-3 py-2.5 text-sm font-medium min-h-[44px] cursor-pointer transition-colors ${
                    route === '/about'
                      ? 'bg-[#EEF2F6] text-[#0F172A] font-semibold'
                      : 'text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A]'
                  }`}
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/contact')}
                  className={`w-full text-left rounded-md px-3 py-2.5 text-sm font-medium min-h-[44px] cursor-pointer transition-colors ${
                    route === '/contact'
                      ? 'bg-[#EEF2F6] text-[#0F172A] font-semibold'
                      : 'text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A]'
                  }`}
                >
                  Contact
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('/quote')}
                  className="w-full text-center rounded-lg bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0D9488] min-h-[44px] cursor-pointer mt-2 transition-colors"
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
