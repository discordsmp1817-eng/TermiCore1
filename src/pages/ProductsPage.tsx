import { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRODUCT_CATEGORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { ProductCatalogSection } from '../components/ProductCatalogSection';
import { SpecTable } from '../components/SpecTable';
import {
  GlowCard,
  INDUSTRIAL_EASE,
  MagneticButton,
  RevealBlock,
} from '../components/MotionPrimitives';

export function ProductsPage() {
  const { navigate } = useApp();
  const [query, setQuery] = useState('');

  const allSkus = useMemo(
    () =>
      PRODUCT_CATEGORIES.flatMap((cat) =>
        cat.skus.map((sku) => ({
          ...sku,
          categoryTitle: cat.title,
          image: sku.image || cat.image,
        }))
      ),
    []
  );

  const filteredSkus = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allSkus.filter(
      (s) =>
        s.model.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.connectionType.toLowerCase().includes(q) ||
        s.wireRangeIec.toLowerCase().includes(q) ||
        s.currentRating.toLowerCase().includes(q) ||
        s.categoryTitle.toLowerCase().includes(q)
    );
  }, [allSkus, query]);

  return (
    <div>
      <section className="bg-[#F5F7F9] bg-engineering-grid border-b border-[#DCE2E8] py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <RevealBlock
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
            blur
          >
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                Product Catalog
              </p>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101D2B] text-balance">
                Terminal Block Connector Solutions
              </h1>
              <p className="mt-4 text-base text-[#475569]">
                Complete portfolio of DIN-rail, PCB terminal blocks, and pluggable PCB connectors from 0.14 mm² board wiring up to 120 mm² / 300 A heavy power feeders.
              </p>
            </div>

            {/* Cross-Series SKU Search */}
            <div className="w-full lg:w-96">
              <label
                htmlFor="catalog-sku-search"
                className="block text-xs font-semibold text-[#101D2B] mb-1.5"
              >
                Quick Part &amp; Rating Lookup
              </label>
              <div className="relative group">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#657382] group-focus-within:text-[#0F766E] transition-colors" />
                <input
                  id="catalog-sku-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search TSC 4, TPC 5.08, TPL, 150 A, Disconnect..."
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white pl-10 pr-4 py-2.5 text-sm text-[#101D2B] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </RevealBlock>

          <AnimatePresence>
            {query.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: INDUSTRIAL_EASE }}
                className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base font-bold text-[#0F172A]">
                    Matching Models ({filteredSkus.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="text-xs font-semibold text-[#0F766E] hover:text-[#0D9488] transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
                {filteredSkus.length > 0 ? (
                  <SpecTable skus={filteredSkus} categoryTitle="Catalog Search" />
                ) : (
                  <p className="text-sm text-[#475569]">
                    No terminal block SKUs matched &ldquo;{query}&rdquo;. Try searching by series prefix (TSC, TSC-R, TSS, TBC, TNC, TPC, TPL) or rated current (32 A, 150 A).
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ProductCatalogSection compactHeading />

      <section className="bg-[#F5F7F9] py-14 lg:py-16 border-b border-[#DCE2E8]">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <GlowCard variant="dark" className="bg-engineering-grid-dark p-8 sm:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-white">
                  Need a Custom Solution or Complete Accessory Kit?
                </h2>
                <p className="mt-1.5 text-sm text-[#CBD5E1]">
                  Pair your terminal blocks with TermiCore end plates, partition plates, insulated cross jumpers, and TS 35 DIN rails.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/accessories')}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#334155] bg-[#162435] px-5 py-2.5 text-sm font-semibold text-white hover:border-[#2DD4BF] hover:text-[#2DD4BF] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Browse Accessories</span>
                </button>
                <MagneticButton
                  type="button"
                  onClick={() => navigate('/quote')}
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0F766E] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </MagneticButton>
              </div>
            </div>
          </GlowCard>
        </RevealBlock>
      </section>
    </div>
  );
}
