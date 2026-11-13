import { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { ProductCatalogSection } from '../components/ProductCatalogSection';
import { SpecTable } from '../components/SpecTable';

export function ProductsPage() {
  const { navigate } = useApp();
  const [query, setQuery] = useState('');

  const allSkus = useMemo(
    () =>
      PRODUCT_CATEGORIES.flatMap((cat) =>
        cat.skus.map((sku) => ({ ...sku, categoryTitle: cat.title }))
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
      <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
                Product Catalog
              </p>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 text-balance">
                Terminal Block Connector Solutions
              </h1>
              <p className="mt-4 text-base text-slate-600">
                Complete portfolio of DIN-rail and busbar terminal blocks from 0.2 mm² control wiring up to 120 mm² / 300 A heavy power feeders.
              </p>
            </div>

            {/* Cross-Series SKU Search */}
            <div className="w-full lg:w-96">
              <label
                htmlFor="catalog-sku-search"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Quick Part &amp; Rating Lookup
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="catalog-sku-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search TSC 4, 150 A, Disconnect, TNC..."
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {query.trim() && (
            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-bold text-slate-950">
                  Matching Models ({filteredSkus.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
              {filteredSkus.length > 0 ? (
                <SpecTable skus={filteredSkus} categoryTitle="Catalog Search" />
              ) : (
                <p className="text-sm text-slate-600">
                  No terminal block SKUs matched &ldquo;{query}&rdquo;. Try searching by series prefix (`TSC`, `TSC-R`, `TSS`, `TBC`, `TNC`) or rated current (`32 A`, `150 A`).
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <ProductCatalogSection compactHeading />

      <section className="bg-white py-14 border-b border-slate-200">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-lg border border-slate-200 bg-[#0F172A] p-8 text-white">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Need a Custom Solution or Complete Accessory Kit?
            </h2>
            <p className="mt-1.5 text-sm text-slate-300">
              Pair your terminal blocks with TermiCore end plates, partition plates, insulated cross jumpers, and TS 35 DIN rails.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/accessories')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:border-sky-400 cursor-pointer min-h-[44px]"
            >
              <span>Browse Accessories</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/quote')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] cursor-pointer min-h-[44px]"
            >
              <span>Request Quote</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
