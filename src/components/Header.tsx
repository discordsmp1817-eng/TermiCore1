import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, FileSpreadsheet, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  IMAGES,
  PRODUCT_CATEGORIES,
  PRODUCT_NAV_GROUPS,
  RoutePath,
  resolveAssetUrl,
} from '../data/termicoreData';
import { NavigationFilter, useApp } from '../context/AppContext';
import { INDUSTRIAL_EASE, MagneticButton } from './MotionPrimitives';

export function Header() {
  const { route, navigate, rfqItems, openDrawer } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const lastHoverOpenRef = useRef<number>(0);

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
      if (
        headerContainerRef.current &&
        !headerContainerRef.current.contains(e.target as Node)
      ) {
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
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDropdownOpen((prev) => {
      if (!prev) {
        lastHoverOpenRef.current = Date.now();
      }
      return true;
    });
  };

  const handleToggleMenuClick = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDropdownOpen((prev) => {
      if (prev && Date.now() - lastHoverOpenRef.current < 450) {
        return true;
      }
      return !prev;
    });
  };

  const scheduleCloseMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setDropdownOpen(false);
    }, 140);
  };

  const handleNav = (to: RoutePath, filter?: NavigationFilter) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate(to, filter);
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
          ? 'border-b border-[#DCE2E8] bg-white/95 backdrop-blur-md shadow-[0_10px_28px_rgba(16,29,43,0.06)]'
          : 'border-b border-[#DCE2E8]/80 bg-[#F5F7F9]/90 backdrop-blur-sm'
      }`}
    >
      <div
        ref={headerContainerRef}
        className="relative mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6 lg:h-[68px]"
      >
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="group flex items-center gap-3 text-left whitespace-nowrap shrink-0 cursor-pointer rounded"
          aria-label="TermiCore Home"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#DCE2E8] bg-white p-0.5 shadow-2xs transition-transform duration-300 group-hover:scale-105 group-hover:border-[#0F766E]/40">
            <img
              src={resolveAssetUrl(IMAGES.logo)}
              alt="TermiCore logo"
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-[#101D2B]">
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

          <div
            onMouseEnter={openMenu}
            onMouseLeave={scheduleCloseMenu}
            className="flex items-center gap-1 py-2"
          >
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
              onClick={handleToggleMenuClick}
              className="p-1 text-[#475569] hover:text-[#0F766E] transition-colors cursor-pointer rounded"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-[#0F766E]' : ''
                }`}
              />
            </button>
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

        {/* 3-Column Products Mega Menu — Original TermiCore Engineering Layout */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              role="region"
              aria-label="Product Categories Mega Menu"
              onMouseEnter={openMenu}
              onMouseLeave={scheduleCloseMenu}
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.99 }}
              transition={{ duration: 0.16, ease: INDUSTRIAL_EASE }}
              className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(1020px,calc(100vw-2rem))] max-h-[calc(100vh-84px)] overflow-y-auto rounded-xl border border-[#DCE2E8] bg-white p-4 shadow-[0_24px_60px_rgba(16,29,43,0.14)] origin-top z-50 before:content-[''] before:absolute before:-top-3 before:inset-x-0 before:h-3"
            >
              <div className="mb-3 flex items-center justify-between border-b border-[#EEF2F6] pb-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0F766E]">
                    TermiCore Connection Architecture
                  </span>
                  <span className="hidden xl:inline text-xs text-[#657382]">
                    Select a terminal family or jump straight to a series
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleNav('/products')}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#DCE2E8] bg-[#F5F7F9] px-2.5 py-1 text-xs font-semibold text-[#101D2B] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
                >
                  <span>Full 8-Series Catalog</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3.5 items-stretch">
                {PRODUCT_NAV_GROUPS.map((group) => (
                  <div
                    key={group.id}
                    className="group/col flex flex-col rounded-lg border border-[#DCE2E8] bg-[#F8FAFC] p-3 transition-colors hover:border-[#0F766E]/40"
                  >
                    <button
                      type="button"
                      onClick={() => handleNav(group.route)}
                      className="flex flex-col text-left cursor-pointer focus:outline-none"
                    >
                      <div className="w-full h-24 overflow-hidden rounded-md border border-[#DCE2E8] bg-white">
                        <img
                          src={resolveAssetUrl(group.image)}
                          alt={group.imageAlt}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover/col:scale-[1.03]"
                        />
                      </div>

                      <span className="mt-2 font-mono text-[10px] font-semibold tracking-wide text-[#0F766E] truncate">
                        {group.seriesBadge}
                      </span>
                      <span className="mt-0.5 font-display text-sm font-bold leading-snug text-[#101D2B] group-hover/col:text-[#0F766E] transition-colors truncate">
                        {group.title}
                      </span>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#657382] truncate">
                        {group.summary}
                      </p>
                    </button>

                    <ul className="mt-2.5 space-y-0.5 border-t border-[#E2E8F0] pt-2">
                      {group.items.map((item) => (
                        <li key={item.label}>
                          <button
                            type="button"
                            onClick={() => handleNav(item.route, item.filter)}
                            className="group/item flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-xs font-medium text-[#334155] hover:bg-white hover:text-[#0F766E] hover:shadow-2xs transition-all cursor-pointer"
                          >
                            <span className="truncate">{item.label}</span>
                            {item.specTag && (
                              <span className="font-mono text-[10px] text-[#64748B] group-hover/item:text-[#0F766E] shrink-0">
                                {item.specTag}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

              <div className="border-t border-slate-200 pt-3 space-y-4">
                {PRODUCT_NAV_GROUPS.map((group) => (
                  <div key={group.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => handleNav(group.route)}
                      className="w-full px-3 pb-1 text-left text-xs font-bold text-[#0F766E] hover:text-[#0D9488] cursor-pointer"
                    >
                      {group.title}
                    </button>
                    <div className="space-y-0.5">
                      {group.items.map((item) => (
                        <button
                          key={`${group.id}-${item.label}`}
                          type="button"
                          onClick={() => handleNav(item.route, item.filter)}
                          className="w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A] min-h-[40px] cursor-pointer transition-colors"
                        >
                          <span className="truncate">{item.label}</span>
                          {item.specTag && (
                            <span className="font-mono text-[11px] text-[#0F766E] shrink-0">
                              {item.specTag}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
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
