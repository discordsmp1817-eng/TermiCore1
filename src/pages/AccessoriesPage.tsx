import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plus,
  Check,
  ArrowRight,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../data/termicoreData';
import {
  DEFAULT_ACCESSORIES_PAGE_SIZE,
  filterCatalogAccessories,
  getAllCatalogAccessories,
  getPaginationRange,
  paginateItems,
} from '../utils/modelSpecifications';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import {
  GlowCard,
  MagneticButton,
  RevealBlock,
} from '../components/MotionPrimitives';

export function AccessoriesPage() {
  const { addToRfq, rfqItems, navigate, navFilter } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('All');
  const [selectedNecessity, setSelectedNecessity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const catalogSectionRef = useRef<HTMLElement | null>(null);

  const allAccessories = useMemo(() => getAllCatalogAccessories(), []);

  const categories = useMemo(
    () => Array.from(new Set(allAccessories.map((a) => a.category))),
    [allAccessories]
  );

  useEffect(() => {
    if (navFilter?.accessoryCategory && categories.includes(navFilter.accessoryCategory)) {
      setSelectedCategory(navFilter.accessoryCategory);
      setCurrentPage(1);
    } else if (!navFilter) {
      setSelectedCategory('All');
      setCurrentPage(1);
    }
  }, [navFilter, categories]);

  const filtered = useMemo(
    () =>
      filterCatalogAccessories(allAccessories, {
        category: selectedCategory,
        seriesId: selectedSeriesId,
        necessity: selectedNecessity,
        searchQuery,
      }),
    [allAccessories, selectedCategory, selectedSeriesId, selectedNecessity, searchQuery]
  );

  const paginated = useMemo(
    () => paginateItems(filtered, currentPage, DEFAULT_ACCESSORIES_PAGE_SIZE),
    [filtered, currentPage]
  );

  const pageTokens = useMemo(
    () => getPaginationRange(paginated.currentPage, paginated.totalPages),
    [paginated.currentPage, paginated.totalPages]
  );

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleSeriesChange = (value: string) => {
    setSelectedSeriesId(value);
    setCurrentPage(1);
  };

  const handleNecessityChange = (value: string) => {
    setSelectedNecessity(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSeriesId('All');
    setSelectedNecessity('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage === paginated.currentPage) return;
    setCurrentPage(nextPage);
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasActiveFilter =
    selectedCategory !== 'All' ||
    selectedSeriesId !== 'All' ||
    selectedNecessity !== 'All' ||
    searchQuery.trim().length > 0;

  return (
    <div>
      <section className="bg-[#F5F7F9] bg-engineering-grid border-b border-[#DCE2E8] py-14 lg:py-20">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6" blur>
          <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
            Modular Components · {allAccessories.length} Catalog Part Numbers
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101D2B] text-balance">
            Terminal Block Accessories
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#475569]">
            Every end plate, partition wall, cross jumper, mating connector, cable lug, ferrule, marking tag, DIN rail, and test plug engineered for TermiCore DIN rail, PCB, and barrier terminal blocks.
          </p>

          {/* CategoryDetailPage-style Horizontal 3-Select Filter Bar + Grid/Table Switcher */}
          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 md:max-w-[780px]">
              <div className="relative">
                <select
                  aria-label="Filter by accessory category"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full h-10 appearance-none rounded-md border border-[#DCE2E8] bg-white pl-3.5 pr-9 text-xs sm:text-[13px] font-medium text-[#334155] shadow-[0_1px_2px_rgba(16,29,43,0.03)] transition-colors hover:border-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 cursor-pointer"
                >
                  <option value="All">- Category -</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter by compatible terminal block series"
                  value={selectedSeriesId}
                  onChange={(e) => handleSeriesChange(e.target.value)}
                  className="w-full h-10 appearance-none rounded-md border border-[#DCE2E8] bg-white pl-3.5 pr-9 text-xs sm:text-[13px] font-medium text-[#334155] shadow-[0_1px_2px_rgba(16,29,43,0.03)] transition-colors hover:border-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 cursor-pointer"
                >
                  <option value="All">- Terminal Series -</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.seriesCode} — {cat.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter by accessory priority level"
                  value={selectedNecessity}
                  onChange={(e) => handleNecessityChange(e.target.value)}
                  className="w-full h-10 appearance-none rounded-md border border-[#DCE2E8] bg-white pl-3.5 pr-9 text-xs sm:text-[13px] font-medium text-[#334155] shadow-[0_1px_2px_rgba(16,29,43,0.03)] transition-colors hover:border-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 cursor-pointer"
                >
                  <option value="All">- Priority Level -</option>
                  <option value="Essential">Essential</option>
                  <option value="Recommended">Recommended</option>
                  <option value="Optional">Optional</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
              </div>
            </div>

            <div
              role="group"
              aria-label="Accessory catalog display mode"
              className="flex items-center gap-1.5 self-end md:self-auto shrink-0"
            >
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'cards'}
                title="Grid view"
                className={`h-10 w-10 inline-flex items-center justify-center rounded-md border transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'border-[#0F766E] bg-[#0F766E] text-white shadow-2xs hover:bg-[#0D9488]'
                    : 'border-[#DCE2E8] bg-white text-[#0F766E] hover:border-[#0F766E]/45 hover:bg-[#F5F7F9]'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-label="Table view"
                aria-pressed={viewMode === 'table'}
                title="Table view"
                className={`h-10 w-10 inline-flex items-center justify-center rounded-md border transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'border-[#0F766E] bg-[#0F766E] text-white shadow-2xs hover:bg-[#0D9488]'
                    : 'border-[#DCE2E8] bg-white text-[#0F766E] hover:border-[#0F766E]/45 hover:bg-[#F5F7F9]'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </RevealBlock>
      </section>

      <section
        id="accessories-catalog"
        ref={catalogSectionRef}
        className="bg-[#EEF2F6] px-4 sm:px-6 py-14 lg:py-20"
      >
        <div className="mx-auto max-w-[1280px] rounded-xl border border-[#DCE2E8] bg-white p-5 sm:p-8 lg:p-10 shadow-[0_14px_40px_rgba(16,29,43,0.05)]">
          {/* Compact Search & Pagination Summary Bar */}
          <div className="mb-8 rounded-lg border border-slate-200 bg-[#F7F9FB] p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="relative flex-1">
              <label htmlFor="accessory-finder-input" className="sr-only">
                Search accessories by part number, compatible model, or specification
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                id="accessory-finder-input"
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search part number (e.g. EP-TSC-2.5, CJ-5.2-10P) or block model (TSC 2.5, TBC M8)..."
                className="w-full rounded-md border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0F766E] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear accessory search"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 shrink-0 text-xs text-[#475569]">
              <span className="font-medium tabular-nums">
                Showing{' '}
                <strong className="text-[#0F172A]">
                  {paginated.startIndex}–{paginated.endIndex}
                </strong>{' '}
                of <strong className="text-[#0F172A]">{paginated.totalItems}</strong> accessories
                {paginated.totalPages > 1 && (
                  <span className="text-[#64748B]">
                    {' '}
                    · Page {paginated.currentPage} of {paginated.totalPages}
                  </span>
                )}
              </span>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {paginated.items.length > 0 ? (
            <>
              {viewMode === 'cards' ? (
                <div
                  data-testid="accessories-grid"
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {paginated.items.map((item) => {
                    const inRfq = rfqItems.some((rfq) => rfq.id === item.partNumber);
                    const necessityTextColor =
                      item.necessity === 'Essential'
                        ? 'text-[#0F766E]'
                        : item.necessity === 'Recommended'
                        ? 'text-[#0369A1]'
                        : 'text-[#64748B]';
                    const previewModels = item.compatibleModels.slice(0, 3);
                    const extraModelCount = Math.max(0, item.compatibleModels.length - 3);

                    return (
                      <article
                        key={item.partNumber}
                        data-testid="accessory-card"
                        className="group flex flex-col justify-between rounded-lg border border-[#DCE2E8] bg-[#FAFBFD] p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#0F766E]/55 hover:shadow-[0_12px_28px_rgba(16,29,43,0.07)]"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-mono font-bold text-[#0F766E] truncate">
                              {item.partNumber}
                            </span>
                            <span className="flex items-center gap-1.5 shrink-0 font-medium text-[#64748B]">
                              <span className={`font-semibold ${necessityTextColor}`}>
                                {item.necessity}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate max-w-[140px]">{item.category}</span>
                            </span>
                          </div>

                          <div className="mt-1 text-xs font-medium text-[#475569]">
                            {item.matchedFor}
                          </div>

                          <div className="mt-3 overflow-hidden rounded-md border border-[#DCE2E8] bg-white aspect-[4/3]">
                            <EngineeringImage
                              src={item.image}
                              alt={item.imageAlt}
                              fallbackTitle={item.title}
                              className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                            />
                          </div>

                          <h2 className="mt-4 font-display text-lg font-bold text-[#0F172A] leading-snug">
                            {item.title}
                          </h2>
                          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#475569]">
                            {item.description}
                          </p>

                          <dl className="mt-4 grid grid-cols-2 gap-2.5 rounded-md border border-[#DCE2E8] bg-white p-3 text-xs">
                            {item.specs.slice(0, 4).map((sp) => (
                              <div key={sp.label}>
                                <dt className="text-[11px] text-[#64748B]">{sp.label}</dt>
                                <dd className="mt-0.5 font-sans font-semibold text-[#0F172A] tabular-nums">
                                  {sp.value}
                                </dd>
                              </div>
                            ))}
                          </dl>

                          {/* Compatible Product Links */}
                          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#475569]">
                            <span className="font-medium text-[#64748B]">Fits:</span>
                            {previewModels.map((mod, idx) => (
                              <span key={mod.model} className="inline-flex items-center">
                                <button
                                  type="button"
                                  onClick={() => navigate(mod.route)}
                                  className="font-mono font-semibold text-[#0F766E] hover:text-[#0D9488] hover:underline cursor-pointer"
                                >
                                  {mod.model}
                                </button>
                                {idx < previewModels.length - 1 && (
                                  <span className="ml-1 text-[#94A3B8]">,</span>
                                )}
                              </span>
                            ))}
                            {extraModelCount > 0 && (
                              <span className="text-[11px] text-[#64748B] tabular-nums">
                                +{extraModelCount} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              addToRfq({
                                id: item.partNumber,
                                model: item.partNumber,
                                title: item.title,
                                category: item.category,
                                specSummary: item.specs
                                  .map((s) => `${s.label}: ${s.value}`)
                                  .join(' · '),
                              })
                            }
                            className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer min-h-[40px] ${
                              inRfq
                                ? 'bg-[#101D2B] text-white hover:bg-[#1E293B]'
                                : 'bg-[#0F766E] text-white hover:bg-[#0D9488]'
                            }`}
                          >
                            {inRfq ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Added {item.partNumber} to RFQ</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add {item.partNumber} to RFQ</span>
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div
                  data-testid="accessories-table"
                  className="overflow-x-auto rounded-lg border border-[#DCE2E8] bg-white"
                >
                  <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#DCE2E8] bg-[#F7F9FB] text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                        <th className="py-3 px-4">Part Number</th>
                        <th className="py-3 px-4">Accessory Description</th>
                        <th className="py-3 px-4">Category &amp; Priority</th>
                        <th className="py-3 px-4">Key Specs</th>
                        <th className="py-3 px-4">Compatible Models</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF2F6]">
                      {paginated.items.map((item) => {
                        const inRfq = rfqItems.some((rfq) => rfq.id === item.partNumber);
                        const previewModels = item.compatibleModels.slice(0, 2);
                        const extraModelCount = Math.max(0, item.compatibleModels.length - 2);
                        return (
                          <tr
                            key={item.partNumber}
                            data-testid="accessory-row"
                            className="hover:bg-[#FAFBFD] transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-[#0F766E] whitespace-nowrap">
                              {item.partNumber}
                            </td>
                            <td className="py-3.5 px-4 max-w-[260px]">
                              <div className="font-display font-bold text-[#0F172A]">
                                {item.title}
                              </div>
                              <div className="mt-0.5 text-[11px] text-[#64748B]">
                                {item.matchedFor}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="font-medium text-[#0F172A]">{item.category}</div>
                              <div className="mt-0.5 text-[11px] font-semibold text-[#0F766E]">
                                {item.necessity}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#475569]">
                              {item.specs
                                .slice(0, 2)
                                .map((s) => `${s.label}: ${s.value}`)
                                .join(' · ')}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                {previewModels.map((mod, idx) => (
                                  <span key={mod.model} className="inline-flex items-center">
                                    <button
                                      type="button"
                                      onClick={() => navigate(mod.route)}
                                      className="font-mono font-semibold text-[#0F766E] hover:underline cursor-pointer"
                                    >
                                      {mod.model}
                                    </button>
                                    {idx < previewModels.length - 1 && (
                                      <span className="ml-1 text-[#94A3B8]">,</span>
                                    )}
                                  </span>
                                ))}
                                {extraModelCount > 0 && (
                                  <span className="text-[11px] text-[#64748B]">
                                    +{extraModelCount}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() =>
                                  addToRfq({
                                    id: item.partNumber,
                                    model: item.partNumber,
                                    title: item.title,
                                    category: item.category,
                                    specSummary: item.specs
                                      .map((s) => `${s.label}: ${s.value}`)
                                      .join(' · '),
                                  })
                                }
                                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                                  inRfq
                                    ? 'bg-[#101D2B] text-white hover:bg-[#1E293B]'
                                    : 'bg-[#0F766E] text-white hover:bg-[#0D9488]'
                                }`}
                              >
                                {inRfq ? (
                                  <>
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Added</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Add to RFQ</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Bar */}
              {paginated.totalPages > 1 && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#DCE2E8] pt-6">
                  <p className="text-xs font-medium text-[#475569] tabular-nums">
                    Page <strong className="text-[#0F172A]">{paginated.currentPage}</strong> of{' '}
                    <strong className="text-[#0F172A]">{paginated.totalPages}</strong> ·{' '}
                    {DEFAULT_ACCESSORIES_PAGE_SIZE} accessories per page
                  </p>

                  <nav
                    aria-label="Accessories pagination"
                    className="flex flex-wrap items-center justify-center gap-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => handlePageChange(paginated.currentPage - 1)}
                      disabled={paginated.currentPage <= 1}
                      aria-label="Previous page"
                      className="inline-flex h-9 items-center gap-1 rounded-md border border-[#DCE2E8] bg-white px-3 text-xs font-semibold text-[#0F172A] transition-colors hover:border-[#0F766E] hover:text-[#0F766E] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Previous</span>
                    </button>

                    {pageTokens.map((token, idx) =>
                      token === 'ellipsis' ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="inline-flex h-9 min-w-[28px] items-center justify-center text-xs text-[#64748B]"
                          aria-hidden="true"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={token}
                          type="button"
                          onClick={() => handlePageChange(token)}
                          aria-label={`Page ${token}`}
                          aria-current={token === paginated.currentPage ? 'page' : undefined}
                          className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-md border px-2.5 text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                            token === paginated.currentPage
                              ? 'border-[#0F766E] bg-[#0F766E] text-white shadow-2xs'
                              : 'border-[#DCE2E8] bg-white text-[#334155] hover:border-[#0F766E] hover:text-[#0F766E]'
                          }`}
                        >
                          {token}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      onClick={() => handlePageChange(paginated.currentPage + 1)}
                      disabled={paginated.currentPage >= paginated.totalPages}
                      aria-label="Next page"
                      className="inline-flex h-9 items-center gap-1 rounded-md border border-[#DCE2E8] bg-white px-3 text-xs font-semibold text-[#0F172A] transition-colors hover:border-[#0F766E] hover:text-[#0F766E] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                No Accessories Matched Your Filter
              </h2>
              <p className="mt-1.5 text-sm text-[#475569]">
                Clear your search or switch back to all categories to view every TermiCore accessory.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
              >
                <span>Show All Accessories</span>
              </button>
            </div>
          )}

          <RevealBlock className="mt-12">
            <GlowCard variant="dark" className="bg-engineering-grid-dark p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-white">
                    Need Bulk Accessories for Your Panel Build?
                  </h2>
                  <p className="mt-1.5 text-sm text-[#CBD5E1]">
                    Submit your BOM or request matched end plates and cross jumpers alongside your terminal block order.
                  </p>
                </div>
                <MagneticButton
                  type="button"
                  onClick={() => navigate('/quote')}
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0F766E] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                >
                  <span>Request Bulk Quote</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </MagneticButton>
              </div>
            </GlowCard>
          </RevealBlock>
        </div>
      </section>
    </div>
  );
}

