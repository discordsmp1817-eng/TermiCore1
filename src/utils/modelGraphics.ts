import { ProductCategory, ProductSku } from '../data/termicoreData';
import { getModelDrawingDimensions } from './modelSpecifications';

export type CircuitVariant =
  | 'single'
  | 'double'
  | 'earth'
  | 'disconnect'
  | 'multi'
  | 'splitter';

export interface CadGeometrySpec {
  upperSpanMm: number;
  lengthMm: number;
  heightMm: number;
  widthMm: number;
  pitchLabel: string;
  tiers: 1 | 2;
  isDinRail: boolean;
  isBarrier: boolean;
  isPcb: boolean;
}

export function getCircuitVariant(
  sku: ProductSku,
  category: ProductCategory
): CircuitVariant {
  const conn = sku.connectionType.toLowerCase();
  const name = sku.name.toLowerCase();

  if (conn.includes('earth') || conn.includes('ground') || sku.model.includes('PE')) {
    return 'earth';
  }
  if (
    conn.includes('disconnect') ||
    conn.includes('fuse') ||
    conn.includes('test') ||
    name.includes('disconnect') ||
    name.includes('ct/pt')
  ) {
    return 'disconnect';
  }
  if (conn.includes('double') || conn.includes('dual') || name.includes('bi-level')) {
    return 'double';
  }
  if (category.id === 'nut-connection') {
    return 'splitter';
  }
  if (conn.includes('multi') || name.includes('3-conductor') || name.includes('4-conductor')) {
    return 'multi';
  }
  return 'single';
}

export function getCircuitVariantLabel(variant: CircuitVariant): string {
  switch (variant) {
    case 'double':
      return 'Dual-Level Independent Circuits (2 × Feed-Through)';
    case 'earth':
      return 'Protective Earth (PE) Grounded Circuit';
    case 'disconnect':
      return 'Test / Knife-Disconnect Circuit';
    case 'splitter':
      return '1-to-Many Potential Distribution Bus';
    case 'multi':
      return 'Multi-Point Common Busbar Circuit';
    default:
      return 'Single-Level Feed-Through Circuit';
  }
}

export function getCadGeometrySpec(
  sku: ProductSku,
  category: ProductCategory
): CadGeometrySpec {
  const dims = getModelDrawingDimensions(sku, category);
  const isPcb = category.id === 'pcb-terminal-blocks' || category.id === 'pcb-connectors';
  const isBarrier = category.id === 'barrier-terminal-blocks';
  const isDinRail = !isPcb && !isBarrier;
  const upperSpanMm = Number((dims.lengthMm * 0.96).toFixed(1));

  return {
    upperSpanMm,
    lengthMm: dims.lengthMm,
    heightMm: dims.heightMm,
    widthMm: dims.widthMm,
    pitchLabel: dims.pitchLabel,
    tiers: dims.tiers,
    isDinRail,
    isBarrier,
    isPcb,
  };
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function buildModelCadSvgMarkup(
  sku: ProductSku,
  category: ProductCategory
): string {
  const g = getCadGeometrySpec(sku, category);
  const modelText = escapeXml(sku.model);

  const topPlanMarkup = g.isPcb
    ? `
      <rect x="175" y="34" width="210" height="30" rx="2" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.6"/>
      <line x1="205" y1="34" x2="205" y2="64" stroke="#64748B" stroke-width="1"/>
      <line x1="355" y1="34" x2="355" y2="64" stroke="#64748B" stroke-width="1"/>
      <circle cx="242" cy="49" r="7.5" fill="none" stroke="#1E293B" stroke-width="1.4"/>
      <path d="M238 49 H246 M242 45 V53" stroke="#1E293B" stroke-width="1.2"/>
      <circle cx="280" cy="49" r="7.5" fill="none" stroke="#1E293B" stroke-width="1.4"/>
      <path d="M276 49 H284 M280 45 V53" stroke="#1E293B" stroke-width="1.2"/>
      <circle cx="318" cy="49" r="7.5" fill="none" stroke="#1E293B" stroke-width="1.4"/>
      <path d="M314 49 H322 M318 45 V53" stroke="#1E293B" stroke-width="1.2"/>
    `
    : `
      <rect x="155" y="34" width="250" height="28" rx="2" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.6"/>
      <line x1="176" y1="34" x2="176" y2="62" stroke="#64748B" stroke-width="1"/>
      <line x1="188" y1="34" x2="188" y2="62" stroke="#64748B" stroke-width="1"/>
      <line x1="372" y1="34" x2="372" y2="62" stroke="#64748B" stroke-width="1"/>
      <line x1="384" y1="34" x2="384" y2="62" stroke="#64748B" stroke-width="1"/>
      <circle cx="235" cy="48" r="8" fill="none" stroke="#1E293B" stroke-width="1.4"/>
      <path d="M230 48 H240 M235 43 V53" stroke="#1E293B" stroke-width="1.2"/>
      <rect x="261" y="40" width="16" height="16" fill="none" stroke="#1E293B" stroke-width="1.2"/>
      <rect x="283" y="40" width="16" height="16" fill="none" stroke="#1E293B" stroke-width="1.2"/>
      <circle cx="325" cy="48" r="8" fill="none" stroke="#1E293B" stroke-width="1.4"/>
      <path d="M320 48 H330 M325 43 V53" stroke="#1E293B" stroke-width="1.2"/>
    `;

  const bodyProfileMarkup = g.isDinRail
    ? g.tiers === 2
      ? `
        <!-- Dual-Level DIN Rail Cutaway Profile -->
        <path d="M172 132 L214 132 L222 146 L236 146 L242 126 L318 126 L324 146 L338 146 L346 132 L388 132 L404 166 L404 282 L386 282 L386 296 L360 296 L354 274 L306 274 L298 286 L262 286 L254 274 L204 274 L192 302 L166 302 L166 288 L178 278 L156 266 L156 166 Z"
              fill="#F8FAFC" stroke="#1E293B" stroke-width="1.8" stroke-linejoin="round"/>
        <!-- Upper level chambers -->
        <rect x="200" y="156" width="44" height="32" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
        <rect x="316" y="156" width="44" height="32" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
        <line x1="244" y1="172" x2="316" y2="172" stroke="#0F766E" stroke-width="2" stroke-dasharray="4 3"/>
        <!-- Lower level chambers -->
        <rect x="176" y="208" width="52" height="36" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
        <rect x="332" y="208" width="52" height="36" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
        <line x1="228" y1="226" x2="332" y2="226" stroke="#0F766E" stroke-width="2" stroke-dasharray="4 3"/>
        <circle cx="280" cy="254" r="6" fill="none" stroke="#475569" stroke-width="1.2"/>
      `
      : `
        <!-- Single-Level DIN Rail Cutaway Profile -->
        <path d="M188 144 L240 144 L248 164 L264 164 L270 144 L290 144 L296 164 L312 164 L320 144 L372 144 L388 182 L404 198 L404 282 L386 282 L386 296 L362 296 L354 272 L308 272 L300 286 L260 286 L252 272 L202 272 L188 304 L164 304 L164 290 L176 280 L156 268 L156 198 L172 182 Z"
              fill="#F8FAFC" stroke="#1E293B" stroke-width="1.8" stroke-linejoin="round"/>
        <!-- Internal clamp & busbar ribs -->
        <rect x="208" y="182" width="46" height="44" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
        <rect x="306" y="182" width="46" height="44" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
        <rect x="254" y="196" width="52" height="22" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
        <line x1="226" y1="210" x2="334" y2="210" stroke="#0F766E" stroke-width="2" stroke-dasharray="4 3"/>
        <circle cx="280" cy="248" r="6" fill="none" stroke="#475569" stroke-width="1.2"/>
        <circle cx="212" cy="248" r="4" fill="none" stroke="#475569" stroke-width="1.1"/>
        <circle cx="348" cy="248" r="4" fill="none" stroke="#475569" stroke-width="1.1"/>
      `
    : g.isBarrier
    ? `
      <!-- Barrier Terminal Block Side Cross-Section -->
      <path d="M156 160 L404 160 L404 286 L156 286 Z" fill="#F8FAFC" stroke="#1E293B" stroke-width="1.8"/>
      <line x1="196" y1="160" x2="196" y2="286" stroke="#1E293B" stroke-width="1.4"/>
      <line x1="280" y1="160" x2="280" y2="286" stroke="#1E293B" stroke-width="1.4"/>
      <line x1="364" y1="160" x2="364" y2="286" stroke="#1E293B" stroke-width="1.4"/>
      <rect x="210" y="188" width="56" height="54" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
      <rect x="294" y="188" width="56" height="54" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
      <circle cx="238" cy="215" r="10" fill="none" stroke="#0F766E" stroke-width="1.5"/>
      <circle cx="322" cy="215" r="10" fill="none" stroke="#0F766E" stroke-width="1.5"/>
      <rect x="142" y="264" width="14" height="22" fill="#E2E8F0" stroke="#1E293B" stroke-width="1.3"/>
      <rect x="404" y="264" width="14" height="22" fill="#E2E8F0" stroke="#1E293B" stroke-width="1.3"/>
    `
    : `
      <!-- PCB Terminal / Header Profile -->
      <path d="M168 154 L392 154 L392 268 L168 268 Z" fill="#F8FAFC" stroke="#1E293B" stroke-width="1.8" stroke-linejoin="round"/>
      <polygon points="168,186 218,204 218,236 168,246" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
      <rect x="234" y="186" width="124" height="44" fill="#FFFFFF" stroke="#475569" stroke-width="1.2"/>
      <line x1="218" y1="216" x2="358" y2="216" stroke="#0F766E" stroke-width="2" stroke-dasharray="4 3"/>
      <!-- Wave / THR Solder Pins -->
      <rect x="218" y="268" width="8" height="36" fill="#94A3B8" stroke="#1E293B" stroke-width="1.2"/>
      <rect x="334" y="268" width="8" height="36" fill="#94A3B8" stroke="#1E293B" stroke-width="1.2"/>
    `;

  const topDimY = 104;
  const bottomDimY = 328;
  const rightDimX = 446;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360" width="560" height="360">
    <defs>
      <marker id="cadArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6 Z" fill="#1E293B"/>
      </marker>
      <marker id="cadArrowRev" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
        <path d="M8,0 L0,3 L8,6 Z" fill="#1E293B"/>
      </marker>
    </defs>
    <rect width="560" height="360" fill="#FFFFFF"/>

    <!-- Top Plan View -->
    ${topPlanMarkup}

    <!-- Left Width / Pitch Dimension -->
    <line x1="112" y1="34" x2="152" y2="34" stroke="#64748B" stroke-width="1"/>
    <line x1="112" y1="62" x2="152" y2="62" stroke="#64748B" stroke-width="1"/>
    <line x1="126" y1="12" x2="126" y2="33" stroke="#1E293B" stroke-width="1.2" marker-end="url(#cadArrow)"/>
    <line x1="126" y1="84" x2="126" y2="63" stroke="#1E293B" stroke-width="1.2" marker-end="url(#cadArrow)"/>
    <text x="114" y="48" text-anchor="middle" transform="rotate(-90 114 48)" fill="#1E293B" font-family="ui-monospace, SFMono-Regular, monospace" font-size="14" font-weight="600">${g.widthMm}</text>

    <!-- Upper Housing Span Dimension -->
    <line x1="156" y1="96" x2="156" y2="164" stroke="#64748B" stroke-width="1"/>
    <line x1="404" y1="96" x2="404" y2="164" stroke="#64748B" stroke-width="1"/>
    <line x1="158" y1="${topDimY}" x2="402" y2="${topDimY}" stroke="#1E293B" stroke-width="1.2" marker-start="url(#cadArrowRev)" marker-end="url(#cadArrow)"/>
    <text x="280" y="96" text-anchor="middle" fill="#1E293B" font-family="ui-monospace, SFMono-Regular, monospace" font-size="14" font-weight="600">${g.upperSpanMm}</text>

    <!-- Main Cross Section Profile -->
    ${bodyProfileMarkup}

    <!-- Right Overall Height Dimension -->
    <line x1="380" y1="144" x2="458" y2="144" stroke="#64748B" stroke-width="1"/>
    <line x1="392" y1="296" x2="458" y2="296" stroke="#64748B" stroke-width="1"/>
    <line x1="${rightDimX}" y1="146" x2="${rightDimX}" y2="294" stroke="#1E293B" stroke-width="1.2" marker-start="url(#cadArrowRev)" marker-end="url(#cadArrow)"/>
    <text x="${rightDimX + 16}" y="224" text-anchor="middle" transform="rotate(-90 ${rightDimX + 16} 224)" fill="#1E293B" font-family="ui-monospace, SFMono-Regular, monospace" font-size="14" font-weight="600">${g.heightMm}</text>

    <!-- Bottom Overall Length Dimension -->
    <line x1="156" y1="274" x2="156" y2="338" stroke="#64748B" stroke-width="1"/>
    <line x1="404" y1="286" x2="404" y2="338" stroke="#64748B" stroke-width="1"/>
    <line x1="158" y1="${bottomDimY}" x2="402" y2="${bottomDimY}" stroke="#1E293B" stroke-width="1.2" marker-start="url(#cadArrowRev)" marker-end="url(#cadArrow)"/>
    <text x="280" y="320" text-anchor="middle" fill="#1E293B" font-family="ui-monospace, SFMono-Regular, monospace" font-size="14" font-weight="600">(${g.lengthMm})</text>

    <!-- Subtle Corner Unit Reference -->
    <text x="22" y="344" fill="#64748B" font-family="ui-monospace, SFMono-Regular, monospace" font-size="11">${modelText} · Dimensions in mm</text>
  </svg>`;
}

export function buildModelCircuitSvgMarkup(
  sku: ProductSku,
  category: ProductCategory
): string {
  const variant = getCircuitVariant(sku, category);
  const label = escapeXml(getCircuitVariantLabel(variant));
  const modelText = escapeXml(sku.model);

  let diagramMarkup = '';

  if (variant === 'double') {
    diagramMarkup = `
      <!-- Upper Level Circuit -->
      <line x1="168" y1="138" x2="392" y2="138" stroke="#1E293B" stroke-width="2"/>
      <circle cx="152" cy="138" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="408" cy="138" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="250" cy="138" r="6.5" fill="#0F172A"/>
      <circle cx="310" cy="138" r="6.5" fill="#0F172A"/>
      <text x="114" y="143" text-anchor="end" fill="#475569" font-family="ui-monospace, monospace" font-size="12" font-weight="600">L1</text>

      <!-- Lower Level Circuit -->
      <line x1="168" y1="212" x2="392" y2="212" stroke="#1E293B" stroke-width="2"/>
      <circle cx="152" cy="212" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="408" cy="212" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="250" cy="212" r="6.5" fill="#0F172A"/>
      <circle cx="310" cy="212" r="6.5" fill="#0F172A"/>
      <text x="114" y="217" text-anchor="end" fill="#475569" font-family="ui-monospace, monospace" font-size="12" font-weight="600">L2</text>
    `;
  } else if (variant === 'earth') {
    diagramMarkup = `
      <line x1="168" y1="168" x2="392" y2="168" stroke="#1E293B" stroke-width="2"/>
      <circle cx="152" cy="168" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="408" cy="168" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="250" cy="168" r="6.5" fill="#0F172A"/>
      <circle cx="310" cy="168" r="6.5" fill="#0F172A"/>
      <!-- PE Ground Stem to DIN Rail -->
      <line x1="280" y1="168" x2="280" y2="226" stroke="#0F766E" stroke-width="2"/>
      <line x1="260" y1="226" x2="300" y2="226" stroke="#0F766E" stroke-width="2.2"/>
      <line x1="268" y1="234" x2="292" y2="234" stroke="#0F766E" stroke-width="2"/>
      <line x1="275" y1="242" x2="285" y2="242" stroke="#0F766E" stroke-width="1.8"/>
    `;
  } else if (variant === 'disconnect') {
    diagramMarkup = `
      <line x1="168" y1="176" x2="252" y2="176" stroke="#1E293B" stroke-width="2"/>
      <line x1="308" y1="176" x2="392" y2="176" stroke="#1E293B" stroke-width="2"/>
      <!-- Disconnect Knife Blade -->
      <line x1="252" y1="176" x2="304" y2="144" stroke="#0F766E" stroke-width="2.5"/>
      <circle cx="152" cy="176" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="408" cy="176" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="252" cy="176" r="6.5" fill="#0F172A"/>
      <circle cx="308" cy="176" r="6.5" fill="#0F172A"/>
    `;
  } else if (variant === 'splitter') {
    diagramMarkup = `
      <!-- 1-Input Left to Common Busbar -->
      <line x1="168" y1="176" x2="258" y2="176" stroke="#1E293B" stroke-width="2.4"/>
      <circle cx="152" cy="176" r="16" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="258" cy="176" r="7" fill="#0F172A"/>
      <!-- Branch Outputs Right -->
      <line x1="258" y1="132" x2="258" y2="220" stroke="#1E293B" stroke-width="2"/>
      <line x1="258" y1="132" x2="392" y2="132" stroke="#1E293B" stroke-width="1.8"/>
      <line x1="258" y1="176" x2="392" y2="176" stroke="#1E293B" stroke-width="1.8"/>
      <line x1="258" y1="220" x2="392" y2="220" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="408" cy="132" r="14" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="408" cy="176" r="14" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="408" cy="220" r="14" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
    `;
  } else if (variant === 'multi') {
    diagramMarkup = `
      <!-- Twin Input / Twin Output Busbar -->
      <line x1="168" y1="146" x2="224" y2="176" stroke="#1E293B" stroke-width="1.8"/>
      <line x1="168" y1="206" x2="224" y2="176" stroke="#1E293B" stroke-width="1.8"/>
      <line x1="224" y1="176" x2="336" y2="176" stroke="#1E293B" stroke-width="2.2"/>
      <line x1="336" y1="176" x2="392" y2="146" stroke="#1E293B" stroke-width="1.8"/>
      <line x1="336" y1="176" x2="392" y2="206" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="152" cy="146" r="14" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="152" cy="206" r="14" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="256" cy="176" r="6.5" fill="#0F172A"/>
      <circle cx="304" cy="176" r="6.5" fill="#0F172A"/>
      <circle cx="408" cy="146" r="14" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="408" cy="206" r="14" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
    `;
  } else {
    diagramMarkup = `
      <!-- Standard Feed-Through Schematic: Outer Terminals + Inner Bridge Nodes -->
      <line x1="168" y1="176" x2="392" y2="176" stroke="#1E293B" stroke-width="2"/>
      <circle cx="152" cy="176" r="18" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="408" cy="176" r="18" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8"/>
      <circle cx="252" cy="176" r="7.5" fill="#0F172A"/>
      <circle cx="308" cy="176" r="7.5" fill="#0F172A"/>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360" width="560" height="360">
    <rect width="560" height="360" fill="#FFFFFF"/>
    ${diagramMarkup}
    <text x="280" y="308" text-anchor="middle" fill="#475569" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="600">${label}</text>
    <text x="280" y="330" text-anchor="middle" fill="#64748B" font-family="ui-monospace, SFMono-Regular, monospace" font-size="11">${modelText} · Schematic Diagram</text>
  </svg>`;
}
