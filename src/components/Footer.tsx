import { Mail, Phone, MapPin, Linkedin, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CONTACT_INFO, PRODUCT_CATEGORIES, RoutePath } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { INDUSTRIAL_EASE } from './MotionPrimitives';

export function Footer() {
  const { navigate, legalModal, setLegalModal } = useApp();

  const handleLink = (to: RoutePath) => {
    navigate(to);
  };

  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <button
              type="button"
              onClick={() => handleLink('/')}
              className="flex items-center gap-2.5 text-left cursor-pointer rounded"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="20" height="18" rx="3" stroke="#FFFFFF" strokeWidth="2" />
                <path d="M7 9H17M7 15H17" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="9" r="1.5" fill="#FFFFFF" />
                <circle cx="12" cy="15" r="1.5" fill="#FFFFFF" />
              </svg>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                TermiCore
              </span>
            </button>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Delivering precision terminal block connectors for connected electrical and industrial automation solutions worldwide.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleLink('/contact')}
                aria-label="Connect with TermiCore Sales"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 text-slate-300 hover:border-sky-400 hover:text-white transition-colors cursor-pointer"
              >
                <Linkedin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white tracking-wide">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('/')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('/products')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('/accessories')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Accessories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('/quality')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Quality &amp; Approvals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('/about')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink('/contact')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Our Products */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white tracking-wide">
              Our Products
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleLink(cat.slug)}
                    className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white tracking-wide">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-white transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors tabular-nums"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div>&copy; {new Date().getFullYear()} TermiCore. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('sitemap')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Sitemap
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Sitemap Modal */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
            onClick={() => setLegalModal(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="legal-modal-title"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
              className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 id="legal-modal-title" className="font-display text-lg font-bold text-slate-950">
                  {legalModal === 'privacy' && 'Privacy Policy'}
                  {legalModal === 'terms' && 'Terms of Service'}
                  {legalModal === 'sitemap' && 'TermiCore Site Directory'}
                </h3>
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setLegalModal(null)}
                  className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 text-sm text-slate-600 space-y-3 leading-relaxed">
                {legalModal === 'privacy' && (
                  <>
                    <p>
                      TermiCore collects contact and technical specification data solely to process engineering inquiries, sample dispatches, and factory-direct quote requests.
                    </p>
                    <p>
                      For compliance documentation or data inquiries, contact {CONTACT_INFO.email}.
                    </p>
                  </>
                )}

                {legalModal === 'terms' && (
                  <>
                    <p>
                      All electrical ratings, tightening torques, and wire cross-section tolerances published in TermiCore product tables must be verified by qualified panel builders against applicable IEC 60947-7-1 and UL 1059 installation requirements.
                    </p>
                    <p>
                      Product specifications are subject to engineering verification at the time of formal quotation.
                    </p>
                  </>
                )}

                {legalModal === 'sitemap' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { label: 'Home', path: '/' as RoutePath },
                      { label: 'All Products', path: '/products' as RoutePath },
                      { label: 'Accessories', path: '/accessories' as RoutePath },
                      { label: 'Spring Cage (TSC)', path: '/spring-cage-connection' as RoutePath },
                      { label: 'Screw Clamp (TSC-R)', path: '/screw-connection' as RoutePath },
                      { label: 'Spring Support (TSS)', path: '/screw-support' as RoutePath },
                      { label: 'Bolt Stud (TBC/TBH)', path: '/bolt-connection' as RoutePath },
                      { label: '1-Nut IC/OG (TNC/TNO)', path: '/nut-connection' as RoutePath },
                      { label: 'Quality & Standards', path: '/quality' as RoutePath },
                      { label: 'About TermiCore', path: '/about' as RoutePath },
                      { label: 'Contact Engineering', path: '/contact' as RoutePath },
                      { label: 'Request a Quote', path: '/quote' as RoutePath },
                    ].map((item) => (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => {
                          setLegalModal(null);
                          handleLink(item.path);
                        }}
                        className="rounded-md border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:border-[#0284C7] hover:text-slate-950 transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
