import { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Minus,
  Plus,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCategory, ProductSku, resolveAssetUrl } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import {
  buildModelSpecificationSections,
  getAccessoriesForModel,
  getModelDrawingDimensions,
  getModelRoute,
} from '../utils/modelSpecifications';
import {
  buildModelCadSvgMarkup,
  buildModelCircuitSvgMarkup,
} from '../utils/modelGraphics';
import { downloadModelPdfDatasheet } from '../utils/pdfDatasheet';
import { INDUSTRIAL_EASE, RevealBlock } from '../components/MotionPrimitives';

interface ModelDetailPageProps {
  sku: ProductSku;
  category: ProductCategory;
}

type DatasheetTab = 'specifications' | 'drawings' | 'accessories';

const DATASHEET_TABS: { id: DatasheetTab; label: string }[] = [
  { id: 'specifications', label: 'Specifications' },
  { id: 'drawings', label: 'Drawings' },
  { id: 'accessories', label: 'Accessories' },
];

export function ModelDetailPage({ sku, category }: ModelDetailPageProps) {
  const { navigate, addToRfq, rfqItems } = useApp();
  const [activeTab, setActiveTab] = useState<DatasheetTab>('specifications');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const sections = useMemo(
    () => buildModelSpecificationSections(sku, category),
    [sku, category]
  );

  const dims = useMemo(
    () => getModelDrawingDimensions(sku, category),
    [sku, category]
  );

  const compatibleAccessories = useMemo(
    () => getAccessoriesForModel(sku, category),
    [sku, category]
  );

  const essentialAccessories = useMemo(
    () => compatibleAccessories.filter((acc) => acc.necessity === 'Essential'),
    [compatibleAccessories]
  );

  const siblingModels = useMemo(
    () => category.skus.filter((s) => s.model !== sku.model).slice(0, 4),
    [category.skus, sku.model]
  );

  const cadDrawingDataUri = useMemo(
    () =>
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        buildModelCadSvgMarkup(sku, category)
      )}`,
    [sku, category]
  );

  const circuitDiagramDataUri = useMemo(
    () =>
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        buildModelCircuitSvgMarkup(sku, category)
      )}`,
    [sku, category]
  );

  const heroImage = sku.image || category.image;

  const mediaSlides = useMemo(
    () => [
      {
        id: 'photo',
        label: 'Product Photo',
        alt: `${sku.name} (${sku.model})`,
        src: heroImage,
        isProductPhoto: true,
      },
      {
        id: 'cad',
        label: 'CAD Drawing',
        alt: `${sku.model} Dimensional CAD Cross-Section Drawing`,
        src: cadDrawingDataUri,
        isProductPhoto: false,
      },
      {
        id: 'circuit',
        label: 'Circuit Diagram',
        alt: `${sku.model} Electrical Circuit Schematic`,
        src: circuitDiagramDataUri,
        isProductPhoto: false,
      },
    ],
    [sku.name, sku.model, heroImage, cadDrawingDataUri, circuitDiagramDataUri]
  );

  // Reset tab, media slide & open all sections by default when navigating to a different model
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    for (const sec of sections) {
      initial[sec.id] = true;
    }
    setExpandedSections(initial);
    setActiveTab('specifications');
    setActiveSlideIndex(0);
  }, [sku.model, sections]);

  const inRfq = rfqItems.some((item) => item.id === sku.model);
  const currentSlide = mediaSlides[activeSlideIndex] || mediaSlides[0];

  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      await downloadModelPdfDatasheet(sku, category, resolveAssetUrl(heroImage));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const jumpToSection = (sectionId: string) => {
    setActiveTab('specifications');
    setExpandedSections((prev) => ({ ...prev, [sectionId]: true }));
    requestAnimationFrame(() => {
      window.setTimeout(() => {
        const el = document.getElementById(`spec-sec-${sectionId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    });
  };

  return (
    <div>
      {/* Top Breadcrumb & Product Overview Hero */}
      <section className="bg-[#F5F7F9] bg-engineering-grid border-b border-[#DCE2E8] py-10 lg:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(category.slug)}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0F766E] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Back to {category.title}</span>
            </button>

            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="hover:text-[#0F766E] transition-colors cursor-pointer"
              >
                Products
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                onClick={() => navigate(category.slug)}
                className="hover:text-[#0F766E] transition-colors cursor-pointer"
              >
                {category.title}
              </button>
              <span aria-hidden="true">/</span>
              <span className="font-mono font-semibold text-[#0F766E]">{sku.model}</span>
            </nav>
          </div>

          <RevealBlock className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch rounded-xl border border-[#DCE2E8] bg-white p-6 sm:p-8 shadow-[0_12px_36px_rgba(16,29,43,0.05)]">
            <div className="lg:col-span-5 flex flex-col justify-between rounded-lg border border-[#EEF2F6] bg-[#FAFBFD] p-4">
              <div className="relative overflow-hidden rounded-md bg-white border border-[#DCE2E8] aspect-[4/3] flex items-center justify-center">
                {currentSlide.isProductPhoto ? (
                  <EngineeringImage
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    fallbackTitle={sku.model}
                    priority
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <img
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    className="h-full w-full object-contain p-2"
                  />
                )}

                <button
                  type="button"
                  aria-label="Previous product view"
                  onClick={() =>
                    setActiveSlideIndex(
                      (prev) => (prev - 1 + mediaSlides.length) % mediaSlides.length
                    )
                  }
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#CBD5E1] bg-white/95 text-[#334155] shadow-sm hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  aria-label="Next product view"
                  onClick={() =>
                    setActiveSlideIndex((prev) => (prev + 1) % mediaSlides.length)
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#CBD5E1] bg-white/95 text-[#334155] shadow-sm hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5" role="group" aria-label="Select product visual">
                  {mediaSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                        idx === activeSlideIndex
                          ? 'bg-[#0F766E] text-white'
                          : 'border border-[#DCE2E8] bg-white text-[#475569] hover:border-[#0F766E] hover:text-[#0F766E]'
                      }`}
                    >
                      {slide.label}
                    </button>
                  ))}
                </div>
                <span className="font-mono text-[11px] font-semibold text-[#64748B]">
                  {activeSlideIndex + 1} / {mediaSlides.length}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B] border-t border-[#DCE2E8] pt-3">
                <span className="font-mono font-semibold text-[#0F766E]">
                  {category.seriesCode} · {sku.connectionType}
                </span>
                <span className="font-medium text-[#334155]">
                  {sku.approvals.join(' · ')}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs font-semibold text-[#0F766E]">
                  Part No. {sku.model} · {category.classification}
                </div>
                <h1 className="mt-2.5 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#101D2B] text-balance">
                  {sku.name}
                </h1>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#475569]">
                  Precision {sku.connectionType.toLowerCase()} terminal module engineered in the TermiCore {category.seriesCode} series for {sku.wireRangeIec} conductors, rated up to {sku.currentRating} / {sku.voltageRating} with {sku.mounting} mounting.
                </p>

                <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5 rounded-lg border border-[#DCE2E8] bg-[#F8FAFC] p-4 text-xs">
                  <div>
                    <dt className="text-[#64748B]">Wire Size (IEC)</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#101D2B] tabular-nums">
                      {sku.wireRangeIec}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#64748B]">Rated Current</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#101D2B] tabular-nums">
                      {sku.currentRating}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#64748B]">Rated Voltage</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#101D2B] tabular-nums">
                      {sku.voltageRating}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#64748B]">Width / Pitch</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#0F766E] tabular-nums">
                      {dims.pitchLabel}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    addToRfq({
                      id: sku.model,
                      model: sku.model,
                      title: sku.name,
                      category: category.title,
                      specSummary: `${sku.wireRangeIec} · ${sku.currentRating} · ${sku.voltageRating}`,
                    })
                  }
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer min-h-[44px] ${
                    inRfq
                      ? 'border border-[#0F766E]/45 bg-[#0F766E]/10 text-[#0F766E] hover:bg-[#0F766E]/15'
                      : 'bg-[#0F766E] text-white hover:bg-[#0D9488]'
                  }`}
                >
                  {inRfq ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added {sku.model} to RFQ</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Add {sku.model} to RFQ</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#0F766E]/40 bg-white px-5 py-2.5 text-sm font-semibold text-[#0F766E] hover:bg-[#0F766E]/5 hover:border-[#0F766E] disabled:opacity-60 transition-colors cursor-pointer min-h-[44px]"
                >
                  <Download className="h-4 w-4" />
                  <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/quote')}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#CBD5E1] bg-[#F5F7F9] px-5 py-2.5 text-sm font-semibold text-[#101D2B] hover:border-[#0F766E] hover:bg-white hover:text-[#0F766E] transition-colors cursor-pointer min-h-[44px]"
                >
                  <FileText className="h-4 w-4 text-[#0F766E]" />
                  <span>Request STEP CAD / Sample</span>
                </button>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* Main Multi-Tab Engineering Datasheet & Approvals Body */}
      <section className="bg-[#EEF2F6] border-b border-[#DCE2E8] py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="rounded-xl border border-[#DCE2E8] bg-white p-5 sm:p-8 lg:p-10 shadow-[0_14px_40px_rgba(16,29,43,0.05)]">
            {/* 3-Column Tab Switcher */}
            <div
              role="tablist"
              aria-label="Product technical datasheet sections"
              className="grid grid-cols-3 rounded-lg border border-[#DCE2E8] bg-[#F5F7F9] overflow-hidden"
            >
              {DATASHEET_TABS.map((tab, idx) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2 sm:px-4 py-3.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                      idx > 0 ? 'border-l border-[#DCE2E8]' : ''
                    } ${
                      isActive
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-[#F8FAFC] text-[#334155] hover:bg-white hover:text-[#0F766E]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* 3-Column Quick-Jump Anchor Index */}
            {activeTab === 'specifications' && (
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0.5 rounded-lg border border-[#EEF2F6] bg-[#FAFBFD] px-5 py-4">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => jumpToSection(sec.id)}
                    className="group flex items-center gap-2.5 border-b border-[#DCE2E8]/70 py-2.5 text-left text-xs sm:text-[13px] font-medium text-[#101D2B] hover:text-[#0F766E] transition-colors cursor-pointer"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#0F766E] shrink-0 transition-transform group-hover:scale-125"
                    />
                    <span>{sec.title}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Tab Panel Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'specifications' && (
                <motion.div
                  key="specifications"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
                  className="mt-8 space-y-8"
                >
                  {sections.map((sec) => {
                    const isOpen = expandedSections[sec.id] ?? true;
                    return (
                      <div
                        key={sec.id}
                        id={`spec-sec-${sec.id}`}
                        className="scroll-mt-24"
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => toggleSection(sec.id)}
                          className="w-full flex items-center justify-between gap-4 border-b-2 border-[#0F766E] pb-2.5 pt-1 text-left cursor-pointer group"
                        >
                          <h2 className="font-display text-base sm:text-lg font-bold text-[#101D2B] group-hover:text-[#0F766E] transition-colors">
                            {sec.title}
                          </h2>
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded text-[#0F766E] group-hover:bg-[#0F766E]/10 transition-colors">
                            {isOpen ? (
                              <Minus className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="overflow-hidden border-x border-b border-[#DCE2E8]">
                            <table className="w-full border-collapse text-left text-xs sm:text-sm">
                              <tbody className="divide-y divide-[#DCE2E8]">
                                {sec.rows.map((row) => (
                                  <tr
                                    key={row.label}
                                    className="odd:bg-white even:bg-[#FAFBFD] hover:bg-[#F1F5F9]/60 transition-colors"
                                  >
                                    <th
                                      scope="row"
                                      className="w-1/2 px-4 py-3 font-medium text-[#334155] border-r border-[#DCE2E8] align-middle"
                                    >
                                      {row.label}
                                    </th>
                                    <td className="w-1/2 px-4 py-3 text-center font-sans font-semibold text-xs sm:text-sm text-[#0F172A] tabular-nums align-middle">
                                      {row.value}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'drawings' && (
                <motion.div
                  key="drawings"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
                  className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12"
                >
                  <div className="lg:col-span-7 rounded-lg border border-[#DCE2E8] bg-[#FAFBFD] p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="font-mono text-[11px] font-semibold text-[#0F766E]">
                          Orthographic Dimensional Envelope
                        </p>
                        <h2 className="font-display text-lg font-bold text-[#101D2B]">
                          {sku.model} Outline Schematic (mm)
                        </h2>
                      </div>
                      <span className="rounded border border-[#DCE2E8] bg-white px-2.5 py-1 font-mono text-xs font-semibold text-[#334155]">
                        ISO 2768-m
                      </span>
                    </div>

                    {/* Technical CAD Dimensional Drawing & Circuit Diagram */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-md border border-[#DCE2E8] bg-white p-3">
                        <p className="mb-2 text-xs font-semibold text-[#334155]">
                          Dimensional Cutaway &amp; Plan View
                        </p>
                        <img
                          src={cadDrawingDataUri}
                          alt={`${sku.model} CAD dimensional cutaway drawing`}
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="rounded-md border border-[#DCE2E8] bg-white p-3">
                        <p className="mb-2 text-xs font-semibold text-[#334155]">
                          Circuit Schematic Diagram
                        </p>
                        <img
                          src={circuitDiagramDataUri}
                          alt={`${sku.model} electrical circuit diagram`}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <h3 className="font-display text-lg font-bold text-[#101D2B]">
                      Mechanical Footprint Summary
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-[#DCE2E8]">
                      <table className="w-full border-collapse text-left text-xs sm:text-sm">
                        <tbody className="divide-y divide-[#DCE2E8]">
                          <tr className="bg-white">
                            <th className="px-4 py-3 font-medium text-[#334155] border-r border-[#DCE2E8]">
                              Body Length (L)
                            </th>
                            <td className="px-4 py-3 font-sans font-semibold text-[#0F172A] tabular-nums">
                              {dims.lengthMm} mm
                            </td>
                          </tr>
                          <tr className="bg-[#FAFBFD]">
                            <th className="px-4 py-3 font-medium text-[#334155] border-r border-[#DCE2E8]">
                              Module Width / Pitch (W)
                            </th>
                            <td className="px-4 py-3 font-sans font-semibold text-[#0F172A] tabular-nums">
                              {dims.pitchLabel}
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <th className="px-4 py-3 font-medium text-[#334155] border-r border-[#DCE2E8]">
                              Overall Height (H)
                            </th>
                            <td className="px-4 py-3 font-sans font-semibold text-[#0F172A] tabular-nums">
                              {dims.heightMm} mm
                            </td>
                          </tr>
                          <tr className="bg-[#FAFBFD]">
                            <th className="px-4 py-3 font-medium text-[#334155] border-r border-[#DCE2E8]">
                              Mounting Interface
                            </th>
                            <td className="px-4 py-3 font-sans font-semibold text-[#0F172A]">
                              {dims.mountingLabel}
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <th className="px-4 py-3 font-medium text-[#334155] border-r border-[#DCE2E8]">
                              Torque / Strip Spec
                            </th>
                            <td className="px-4 py-3 font-sans font-semibold text-[#0F172A]">
                              {dims.stripOrTorque}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('/quote')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Request 3D STEP / DXF CAD Package</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'accessories' && (
                <motion.div
                  key="accessories"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
                  className="mt-8 space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE2E8] pb-5">
                    <div>
                      <div className="font-mono text-xs font-semibold text-[#0F766E]">
                        {compatibleAccessories.length} Matched Accessories · Required &amp; Optional Assembly BOM
                      </div>
                      <h2 className="mt-1 font-display text-lg sm:text-xl font-bold text-[#101D2B]">
                        All Required &amp; Compatible Accessories for {sku.model}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                        Complete hardware, end covers, jumpers, markers, and termination components sized for {sku.model} ({dims.pitchLabel} · {sku.wireRangeIec}).
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {essentialAccessories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            essentialAccessories.forEach((acc) => {
                              if (!rfqItems.some((item) => item.id === acc.partNumber)) {
                                addToRfq({
                                  id: acc.partNumber,
                                  model: acc.partNumber,
                                  title: acc.title,
                                  category: acc.category,
                                  specSummary: acc.specs.map((s) => `${s.label}: ${s.value}`).join(' · '),
                                });
                              }
                            });
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add All Essential ({essentialAccessories.length}) to RFQ</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => navigate('/accessories')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-[#101D2B] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
                      >
                        <span>Full Accessories Catalog</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {compatibleAccessories.map((acc) => {
                      const accInRfq = rfqItems.some((item) => item.id === acc.partNumber);
                      const necessityBadge =
                        acc.necessity === 'Essential'
                          ? 'bg-[#0F766E]/10 text-[#0F766E] border-[#0F766E]/30'
                          : acc.necessity === 'Recommended'
                          ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
                          : 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]';
                      return (
                        <div
                          key={acc.id}
                          className="flex flex-col justify-between rounded-lg border border-[#DCE2E8] bg-[#FAFBFD] p-5"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-mono font-bold text-[#0F766E]">
                                {acc.partNumber}
                              </span>
                              <span className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${necessityBadge}`}>
                                {acc.necessity}
                              </span>
                            </div>
                            <div className="mt-1 text-[11px] font-medium text-[#475569]">
                              {acc.matchedFor}
                            </div>
                            <div className="mt-3 overflow-hidden rounded-md border border-[#DCE2E8] bg-white aspect-[4/3]">
                              <EngineeringImage
                                src={acc.image}
                                alt={acc.imageAlt}
                                fallbackTitle={acc.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <h3 className="mt-3.5 font-display text-base font-bold text-[#101D2B]">
                              {acc.title}
                            </h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                              {acc.description}
                            </p>
                            <dl className="mt-3 grid grid-cols-2 gap-2 rounded border border-[#DCE2E8] bg-white p-2.5 text-[11px]">
                              {acc.specs.slice(0, 4).map((sp) => (
                                <div key={sp.label}>
                                  <dt className="text-[#64748B]">{sp.label}</dt>
                                  <dd className="font-sans font-semibold text-[#0F172A]">
                                    {sp.value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              addToRfq({
                                id: acc.partNumber,
                                model: acc.partNumber,
                                title: acc.title,
                                category: acc.category,
                                specSummary: acc.specs.map((s) => `${s.label}: ${s.value}`).join(' · '),
                              })
                            }
                            className={`mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer min-h-[38px] ${
                              accInRfq
                                ? 'border border-[#0F766E]/40 bg-[#0F766E]/10 text-[#0F766E]'
                                : 'bg-[#0F766E] text-white hover:bg-[#0D9488]'
                            }`}
                          >
                            {accInRfq ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Added {acc.partNumber} to RFQ</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add {acc.partNumber} to RFQ</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Sibling Models in Same Series */}
      {siblingModels.length > 0 && (
        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-xs font-semibold text-[#0F766E]">
                  More in {category.seriesCode} Series
                </p>
                <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-[#101D2B]">
                  Related Models
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate(category.slug)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:text-[#0D9488] cursor-pointer"
              >
                <span>All {category.skus.length} {category.seriesCode} Models</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {siblingModels.map((sib) => (
                <button
                  key={sib.model}
                  type="button"
                  onClick={() => navigate(getModelRoute(sib.model))}
                  className="group flex flex-col justify-between rounded-lg border border-[#DCE2E8] bg-[#F8FAFC] p-4 text-left hover:border-[#0F766E] hover:bg-white transition-colors cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-bold text-[#0F766E]">
                        {sib.model}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#64748B] group-hover:text-[#0F766E] transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className="mt-3 overflow-hidden rounded-md border border-[#DCE2E8] bg-white aspect-[4/3]">
                      <EngineeringImage
                        src={sib.image || category.image}
                        alt={`${sib.name} (${sib.model})`}
                        fallbackTitle={sib.model}
                        className="h-full w-full object-contain p-1.5"
                      />
                    </div>
                    <div className="mt-3 font-display text-sm font-bold text-[#101D2B] line-clamp-2">
                      {sib.name}
                    </div>
                  </div>
                  <div className="mt-2 font-mono text-[11px] text-[#475569]">
                    {sib.wireRangeIec} · {sib.currentRating} · {sib.voltageRating}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
