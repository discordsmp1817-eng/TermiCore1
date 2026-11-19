import {
  ACCESSORIES,
  AccessoryItem,
  IMAGES,
  PRODUCT_CATEGORIES,
  ProductCategory,
  ProductSku,
  RoutePath,
} from '../data/termicoreData';

export interface SpecRow {
  label: string;
  value: string;
}

export interface ModelSpecSection {
  id: string;
  title: string;
  rows: SpecRow[];
}

export interface ModelDrawingDimensions {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  pitchLabel: string;
  stripOrTorque: string;
  mountingLabel: string;
  tiers: 1 | 2;
  isPcbOrBarrier: boolean;
}

export function toModelSlug(model: string): string {
  return model
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '-');
}

export function getModelRoute(model: string): RoutePath {
  return `/model/${toModelSlug(model)}`;
}

export function findModelByRoute(
  route: string
): { sku: ProductSku; category: ProductCategory } | null {
  if (!route.startsWith('/model/')) return null;
  const slug = route.slice('/model/'.length).trim().toLowerCase();
  if (!slug) return null;

  for (const category of PRODUCT_CATEGORIES) {
    const sku = category.skus.find((item) => toModelSlug(item.model) === slug);
    if (sku) {
      return { sku, category };
    }
  }
  return null;
}

function parseWireBounds(wireRangeIec: string): {
  minStr: string;
  maxStr: string;
  minNum: number;
  maxNum: number;
  isHeaderPin: boolean;
  isDistribution: boolean;
} {
  if (wireRangeIec.toLowerCase().includes('header pin')) {
    return {
      minStr: 'Pin Interface',
      maxStr: wireRangeIec,
      minNum: 0.8,
      maxNum: 1.0,
      isHeaderPin: true,
      isDistribution: false,
    };
  }
  if (wireRangeIec.toLowerCase().includes('in:')) {
    const nums = wireRangeIec.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [16, 6];
    return {
      minStr: `${nums[nums.length - 1] ?? 6}`,
      maxStr: `${nums[0] ?? 16}`,
      minNum: nums[nums.length - 1] ?? 6,
      maxNum: nums[0] ?? 16,
      isHeaderPin: false,
      isDistribution: true,
    };
  }
  const nums = wireRangeIec.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const minNum = nums[0] ?? 0.2;
  const maxNum = nums[1] ?? minNum;
  return {
    minStr: String(minNum),
    maxStr: String(maxNum),
    minNum,
    maxNum,
    isHeaderPin: false,
    isDistribution: false,
  };
}

function parseAwgBounds(wireRangeUl?: string): { minAwg: string; maxAwg: string } {
  if (!wireRangeUl) return { minAwg: '24', maxAwg: '12' };
  const matches = wireRangeUl.match(/(\d+(?:\/0)?)/g);
  if (!matches || matches.length < 2) {
    return { minAwg: wireRangeUl, maxAwg: wireRangeUl };
  }
  return { minAwg: matches[0], maxAwg: matches[1] };
}

function parseNumeric(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const m = raw.match(/\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : fallback;
}

export function getModelDrawingDimensions(
  sku: ProductSku,
  category: ProductCategory
): ModelDrawingDimensions {
  const widthMm = parseNumeric(sku.widthOrPitch, 6.2);
  const isDouble =
    sku.connectionType.toLowerCase().includes('double') ||
    sku.connectionType.toLowerCase().includes('dual');
  const isPcbOrBarrier =
    category.id === 'pcb-terminal-blocks' ||
    category.id === 'pcb-connectors' ||
    category.id === 'barrier-terminal-blocks';
  const currentNum = parseNumeric(sku.currentRating, 24);

  let lengthMm = 48.5;
  let heightMm = 41.2;

  if (category.id === 'pcb-terminal-blocks' || category.id === 'pcb-connectors') {
    lengthMm = Number((12.5 + Math.min(currentNum, 232) * 0.14).toFixed(1));
    heightMm = Number((13.2 + Math.min(widthMm, 15) * 1.45).toFixed(1));
  } else if (category.id === 'barrier-terminal-blocks') {
    lengthMm = Number((26.0 + widthMm * 0.8).toFixed(1));
    heightMm = isDouble ? 29.4 : 18.8;
  } else if (category.id === 'bolt-connection' || category.id === 'nut-connection') {
    lengthMm = Number((74.0 + Math.min(widthMm, 45) * 0.95).toFixed(1));
    heightMm = Number((56.0 + Math.min(widthMm, 45) * 0.65).toFixed(1));
  } else {
    lengthMm = Number((42.0 + Math.min(widthMm, 16) * 2.1 + (isDouble ? 18.5 : 0)).toFixed(1));
    heightMm = Number((38.5 + Math.min(widthMm, 16) * 1.35 + (isDouble ? 15.0 : 0)).toFixed(1));
  }

  return {
    lengthMm,
    widthMm,
    heightMm,
    pitchLabel: sku.widthOrPitch || `${widthMm} mm`,
    stripOrTorque: sku.torqueOrStrip || 'See mechanical data',
    mountingLabel: sku.mounting,
    tiers: isDouble ? 2 : 1,
    isPcbOrBarrier,
  };
}

export function buildModelSpecificationSections(
  sku: ProductSku,
  category: ProductCategory
): ModelSpecSection[] {
  const wire = parseWireBounds(sku.wireRangeIec);
  const awg = parseAwgBounds(sku.wireRangeUl);
  const dims = getModelDrawingDimensions(sku, category);
  const voltageNum = parseNumeric(sku.voltageRating, 600);
  const currentNum = parseNumeric(sku.currentRating, 24);
  const impulseKv = voltageNum >= 800 ? '8 kV' : voltageNum >= 400 ? '6 kV' : '4 kV';
  const isThrLcp = sku.mounting.toLowerCase().includes('thr') || sku.mounting.toLowerCase().includes('260');
  const isSpringFamily =
    category.id === 'spring-cage' ||
    sku.connectionType.toLowerCase().includes('spring') ||
    sku.connectionType.toLowerCase().includes('push-in') ||
    sku.connectionType.toLowerCase().includes('lever');
  const isEarth = sku.connectionType.toLowerCase().includes('earth') || sku.connectionType.toLowerCase().includes('ground');
  const isDinRail =
    category.id !== 'pcb-terminal-blocks' &&
    category.id !== 'pcb-connectors' &&
    category.id !== 'barrier-terminal-blocks';

  const housingColor =
    isEarth
      ? 'Green-Yellow (RAL 6018 / 1018)'
      : category.id === 'pcb-terminal-blocks' || category.id === 'pcb-connectors'
      ? isThrLcp
        ? 'Matte Black (High-Temp LCP)'
        : 'Signal Green (RAL 6032)'
      : category.id === 'barrier-terminal-blocks'
      ? 'Industrial Black (UL 94 V-0)'
      : 'Industrial Grey (RAL 7035)';

  const ulGroupVoltage = voltageNum >= 600 ? '600 V' : `${voltageNum} V`;
  const ulGroupCurrent =
    currentNum >= 25
      ? `${Math.max(15, Math.round(currentNum * 0.85))} A`
      : `${currentNum} A`;
  const ulGroupDCurrent = currentNum >= 50 ? '5 A' : currentNum >= 20 ? '5 A' : `${Math.min(currentNum, 10)} A`;

  const screwMatch = sku.torqueOrStrip?.match(/M\d+(?:\.\d+)?/i)?.[0];
  const torqueMatch = sku.torqueOrStrip?.match(/\d+(?:\.\d+)?\s*Nm/i)?.[0];
  const stripMatch = sku.torqueOrStrip?.match(/\d+\s*[–-]\s*\d+\s*mm/i)?.[0];

  const ferruleMin = wire.isHeaderPin
    ? 'N/A (Pin Header)'
    : `${Math.max(0.25, wire.minNum)} mm²`;
  const ferruleMax = wire.isHeaderPin
    ? 'N/A (Pin Header)'
    : `${wire.maxNum} mm²`;
  const dualWireMax = wire.isHeaderPin
    ? 'Single Pin Interface'
    : `${Number((wire.maxNum * 0.6).toFixed(2))} mm²`;

  const generalRows: SpecRow[] = [
    { label: 'Model / Catalog Designation', value: sku.model },
    { label: 'Engineering Description', value: sku.name },
    { label: 'Product Series & Family', value: `${category.seriesCode} · ${category.title}` },
    { label: 'Block Function / Architecture', value: sku.connectionType },
    { label: 'Standard Housing Color', value: housingColor },
    {
      label: 'Termination Principle',
      value: isSpringFamily
        ? 'Stainless steel constant-force spring clamp'
        : category.id === 'bolt-connection'
        ? 'High-torque threaded busbar stud & nut'
        : category.id === 'nut-connection'
        ? '1-Nut copper monoblock distribution split'
        : 'Vibration-resistant rising clamp / captive screw',
    },
    { label: 'Mounting & Locking Method', value: sku.mounting },
    { label: 'Body Length (L)', value: `${dims.lengthMm} mm` },
    { label: 'Module Width / Pitch (W)', value: dims.pitchLabel },
    { label: 'Overall Height (H)', value: `${dims.heightMm} mm` },
    {
      label: 'Level / Pole Architecture',
      value: dims.tiers === 2 ? 'Dual-level stacked circuit' : 'Single-level feed-through',
    },
    {
      label: 'Connection Points per Pole',
      value: sku.connectionType.toLowerCase().includes('multi')
        ? '3 or 4 conductor entries'
        : dims.tiers === 2
        ? '4 (2 upper + 2 lower)'
        : '2 (1 input / 1 output)',
    },
  ];

  const materialRows: SpecRow[] = [
    {
      label: 'Insulating Housing Material',
      value: isThrLcp ? 'High-Temperature LCP (260°C Reflow)' : 'Polyamide PA 6.6 (Halogen-Free)',
    },
    { label: 'Comparative Tracking Index (CTI)', value: 'Group I (CTI ≥ 600 V)' },
    { label: 'Flammability Rating (UL 94)', value: 'V-0 Self-Extinguishing' },
    { label: 'Volume Insulation Resistance', value: '≥ 500 MΩ at 500 V DC' },
    {
      label: 'Current Busbar / Contact Alloy',
      value: 'Electrolytic ETP Copper, Electro-Tin Plated',
    },
    {
      label: 'Clamping Hardware Alloy',
      value: isSpringFamily
        ? 'Corrosion-Resistant CrNi Stainless Steel'
        : 'Zinc-Passivated Hardened Steel / Brass',
    },
  ];

  const iecRows: SpecRow[] = [
    { label: 'Rated Operational Voltage (IEC)', value: sku.voltageRating },
    { label: 'Rated Operational Current (IEC)', value: sku.currentRating },
    { label: 'Overvoltage Category / Pollution Degree', value: 'III / 3' },
    { label: 'Rated Impulse Withstand Voltage (Uimp)', value: impulseKv },
    {
      label: 'Solid Conductor Cross Section (Min / Max)',
      value: wire.isHeaderPin ? wire.maxStr : `${wire.minStr} mm² – ${wire.maxStr} mm²`,
    },
    {
      label: 'Stranded Conductor Cross Section (Min / Max)',
      value: wire.isHeaderPin ? 'Mating Plug Required' : `${wire.minStr} mm² – ${wire.maxStr} mm²`,
    },
    {
      label: 'Flexible w/ Uninsulated Ferrule (Min / Max)',
      value: wire.isHeaderPin ? 'N/A' : `${ferruleMin} – ${ferruleMax}`,
    },
    {
      label: 'Flexible w/ Plastic Collar Ferrule (Min / Max)',
      value: wire.isHeaderPin ? 'N/A' : `${ferruleMin} – ${ferruleMax}`,
    },
    {
      label: '2 Conductors Same Cross Section (Solid / Twin Ferrule)',
      value: wire.isHeaderPin ? 'N/A' : `${wire.minStr} mm² – ${dualWireMax}`,
    },
    {
      label: 'Actuation Screw / Clamp Mechanism',
      value:
        screwMatch ||
        (isSpringFamily
          ? 'Spring Cage Release Slot (Tool-Assisted / Push-In)'
          : 'Captive Metric Rising Clamp'),
    },
    {
      label: 'Recommended Driver / Tooling',
      value: isSpringFamily
        ? '2.5 × 0.4 mm insulated blade / finger lever'
        : currentNum >= 65
        ? 'Hex socket / M6–M10 torque driver'
        : 'Slotted 0.6 × 3.5 mm or PH1/PZ1',
    },
    {
      label: 'Tightening Torque / Stripping Spec',
      value: torqueMatch
        ? `${torqueMatch} · Strip ${stripMatch || '9 – 11 mm'}`
        : sku.torqueOrStrip || 'Strip 10 – 12 mm',
    },
    { label: 'Compatible Rail / PCB Interface', value: sku.mounting },
    {
      label: 'Open-Side End Cover Plate',
      value: isDinRail ? 'Recommended (TermiCore EP Series)' : 'Integrated closed housing',
    },
    {
      label: 'Protective Earth / PE Rail Contact',
      value: isEarth ? 'Yes — Integrated copper PE snap foot' : 'No (Insulated circuit)',
    },
  ];

  const ulRows: SpecRow[] = [
    { label: 'Rated Voltage (UL / cUL Use Group B)', value: ulGroupVoltage },
    { label: 'Rated Current (UL / cUL Use Group B)', value: ulGroupCurrent },
    { label: 'Rated Voltage (UL / cUL Use Group C)', value: ulGroupVoltage },
    { label: 'Rated Current (UL / cUL Use Group C)', value: ulGroupCurrent },
    { label: 'Rated Voltage (UL / cUL Use Group D)', value: '600 V' },
    { label: 'Rated Current (UL / cUL Use Group D)', value: ulGroupDCurrent },
    {
      label: 'Solid Wire Range (UL / cUL)',
      value: wire.isHeaderPin ? wire.maxStr : `${awg.minAwg} – ${awg.maxAwg} AWG`,
    },
    {
      label: 'Stranded Wire Range (UL / cUL)',
      value: wire.isHeaderPin ? 'Mating Plug Required' : `${awg.minAwg} – ${awg.maxAwg} AWG`,
    },
  ];

  const envRows: SpecRow[] = [
    { label: 'Back-of-Hand Touch Safety (VDE 0106-100)', value: 'Yes — Recessed live parts' },
    { label: 'Finger-Safe Protection Degree', value: 'IP20 (Terminated & end-plated)' },
    { label: 'Minimum Operating Temperature', value: '-40 °C (Static & cyclic load)' },
    {
      label: 'Maximum Continuous Operating Temperature',
      value: isThrLcp ? '+130 °C (Peak 260 °C Reflow 10 s)' : '+120 °C (UL RTI rated)',
    },
    { label: 'Environmental Compliance', value: 'RoHS 3 (2015/863) · REACH · Halogen-Free' },
  ];

  const mechanicalRows: SpecRow[] = [
    { label: 'Applicable Standards & Markings', value: sku.approvals.join(' · ') },
    { label: 'Module Width / Pitch (W)', value: dims.pitchLabel },
    { label: 'Body Length × Overall Height (L × H)', value: `${dims.lengthMm} mm × ${dims.heightMm} mm` },
    { label: 'Conductor Strip / Torque Spec', value: dims.stripOrTorque },
    { label: 'Mounting & PCB / Rail Interface', value: dims.mountingLabel },
    {
      label: 'Supply Packaging Format',
      value:
        sku.model.includes('-TR') || sku.mounting.toLowerCase().includes('thr')
          ? 'Tape-on-Reel / Pick-and-Place Tray'
          : 'Industrial Moisture-Sealed Box Pack',
    },
  ];

  return [
    { id: 'general-info', title: 'General Information', rows: generalRows },
    { id: 'material-info', title: 'Material Properties', rows: materialRows },
    { id: 'iec-data', title: 'IEC Connection Data', rows: iecRows },
    { id: 'ul-data', title: 'UL / cUL Connection Data', rows: ulRows },
    { id: 'mechanical-info', title: 'Mechanical & Packaging Data', rows: mechanicalRows },
    { id: 'env-safety', title: 'Environment & Safety', rows: envRows },
  ];
}

export interface ModelAccessoryItem extends AccessoryItem {
  partNumber: string;
  necessity: 'Essential' | 'Recommended' | 'Optional';
  matchedFor: string;
}

export function getAccessoriesForModel(
  sku: ProductSku,
  category: ProductCategory
): ModelAccessoryItem[] {
  const dims = getModelDrawingDimensions(sku, category);
  const safeCode = sku.model.replace(/\s+/g, '-').toUpperCase();
  const widthTag = String(dims.widthMm);
  const isEarth =
    sku.connectionType.toLowerCase().includes('earth') ||
    sku.connectionType.toLowerCase().includes('ground') ||
    sku.model.includes('PE');
  const isDisconnect =
    sku.connectionType.toLowerCase().includes('disconnect') ||
    sku.connectionType.toLowerCase().includes('fuse') ||
    sku.connectionType.toLowerCase().includes('test');

  const baseMap = new Map(ACCESSORIES.map((a) => [a.id, a]));
  const ep = baseMap.get('ep-series')!;
  const pp = baseMap.get('pp-series')!;
  const jumper = baseMap.get('jumper-series')!;
  const marker = baseMap.get('marker-series')!;
  const rail = baseMap.get('din-rails')!;
  const testPlug = baseMap.get('test-plugs')!;
  const lug = baseMap.get('lug-series')!;

  if (category.id === 'pcb-terminal-blocks' || category.id === 'pcb-connectors') {
    const items: ModelAccessoryItem[] = [];

    if (category.id === 'pcb-connectors') {
      items.push({
        id: `${safeCode}-mate`,
        series: `MATING-${safeCode}`,
        partNumber: `TPH-${widthTag}-MATE`,
        title: `Matched Mating Header / Counterpart for ${sku.model}`,
        category: 'Mating Interface',
        necessity: 'Essential',
        matchedFor: `${dims.pitchLabel} pitch · ${sku.currentRating}`,
        description: `Factory-keyed mating ${sku.connectionType.toLowerCase().includes('header') ? 'female wire plug' : 'PCB pin header'} aligned 1:1 to ${sku.model} pitch and locking flanges.`,
        image: sku.image || category.image || IMAGES.pcbConnectors,
        imageAlt: `Matched counterpart connector for ${sku.model}`,
        specs: [
          { label: 'Pitch Match', value: dims.pitchLabel },
          { label: 'Rated Load', value: `${sku.currentRating} / ${sku.voltageRating}` },
          { label: 'Housing', value: 'UL 94 V-0 PA 6.6 / LCP' },
          { label: 'Coding', value: 'Anti-Mismate Keyed' },
        ],
      });
    }

    items.push({
      ...lug,
      id: `${safeCode}-ferrules`,
      partNumber: `TFL-FER-${safeCode}`,
      title: `Wire Ferrules & Pin Crimp Kit (${sku.wireRangeIec})`,
      necessity: 'Essential',
      matchedFor: `Conductor range ${sku.wireRangeIec}`,
      description: `Pre-insulated copper bootlace ferrules sized specifically for clean stranded wire insertion into ${sku.model} clamping chambers.`,
      image: 'images/acc_wire_ferrules_1795090616925.jpg',
      imageAlt: `DIN 46228-4 pre-insulated copper wire ferrules for ${sku.model}`,
      specs: [
        { label: 'Wire Size', value: sku.wireRangeIec },
        { label: 'AWG Range', value: sku.wireRangeUl || '24 - 12 AWG' },
        { label: 'Plating', value: 'Electro-Tin Cu' },
        { label: 'Color Code', value: 'DIN 46228-4' },
      ],
    });

    items.push({
      ...marker,
      id: `${safeCode}-markers`,
      partNumber: `MT-PCB-${widthTag}`,
      title: `${dims.pitchLabel} Pitch Terminal Marking Strips`,
      necessity: 'Recommended',
      matchedFor: `${dims.pitchLabel} center-to-center pitch`,
      description: `Pre-scored polyamide circuit identification labels matched to ${sku.model} pole spacing.`,
      specs: [
        { label: 'Pitch Match', value: dims.pitchLabel },
        { label: 'Print Method', value: 'Thermal / Plotter' },
        { label: 'Material', value: 'Halogen-Free PA' },
        { label: 'Legends', value: 'Blank / 1–100' },
      ],
    });

    items.push({
      ...pp,
      id: `${safeCode}-partition`,
      partNumber: `PP-PCB-${widthTag}`,
      title: `Creepage Partition & Coding Key`,
      necessity: 'Recommended',
      matchedFor: `${sku.voltageRating} isolation barrier`,
      description: `Polarizing coding pins and extended separation walls maintaining ${sku.voltageRating} IEC clearance on high-voltage boards.`,
      image: 'images/acc_barrier_covers_1795090616883.jpg',
      imageAlt: `Creepage partition barrier and coding keys for ${sku.model}`,
      specs: [
        { label: 'Dielectric', value: sku.voltageRating },
        { label: 'Thickness', value: '1.5 mm' },
        { label: 'Material', value: 'PA 6.6 UL 94 V-0' },
        { label: 'Fit Model', value: sku.model },
      ],
    });

    items.push({
      ...testPlug,
      id: `${safeCode}-testplug`,
      partNumber: `TP-2.0-PCB`,
      title: `2.0 mm Shrouded Test Probe`,
      necessity: 'Optional',
      matchedFor: `Live check on ${sku.model} ports`,
      description: `Finger-safe 2.0 mm multimeter test probe for verifying signal continuity on ${sku.model} without disturbing wire clamps.`,
      specs: [
        { label: 'Probe Dia.', value: '2.0 mm' },
        { label: 'CAT Rating', value: '600 V CAT III' },
        { label: 'Current', value: 'Up to 16 A' },
        { label: 'Lead Fit', value: '4 mm Banana' },
      ],
    });

    return items;
  }

  if (category.id === 'barrier-terminal-blocks') {
    return [
      {
        ...lug,
        id: `${safeCode}-lugs`,
        partNumber: `TFL-BAR-${widthTag}`,
        title: `Narrow-Tongue Fork & Ring Lugs for ${sku.model}`,
        necessity: 'Essential',
        matchedFor: `${dims.pitchLabel} barrier well · ${sku.wireRangeIec}`,
        description: `Trimmed-width insulated spade and ring lugs engineered to drop directly into ${sku.model} barrier chambers without trimming.`,
        specs: [
          { label: 'Wire Size', value: sku.wireRangeIec },
          { label: 'Tongue Width', value: `< ${dims.widthMm} mm` },
          { label: 'Plating', value: 'Electro-Tin Cu' },
          { label: 'Fit Model', value: sku.model },
        ],
      },
      {
        ...pp,
        id: `${safeCode}-cover`,
        partNumber: `SC-${safeCode}`,
        title: `Snap-On Protective Barrier Cover & Dividers`,
        necessity: 'Essential',
        matchedFor: `IP20 touch guard · ${sku.voltageRating}`,
        description: `Clear/insulated protective top cover shielding live screw heads on ${sku.model} barrier strips per IP20 panel standards.`,
        image: 'images/acc_barrier_covers_1795090616883.jpg',
        imageAlt: `Clear snap-on IP20 protective barrier cover for ${sku.model}`,
        specs: [
          { label: 'Dielectric', value: sku.voltageRating },
          { label: 'Pitch Match', value: dims.pitchLabel },
          { label: 'Safety', value: 'UL 94 V-0 / IP20' },
          { label: 'Fit Model', value: sku.model },
        ],
      },
      {
        ...jumper,
        id: `${safeCode}-jumper`,
        partNumber: `CJ-BAR-${widthTag}`,
        title: `Barrier Strip Comb Cross Jumpers`,
        necessity: 'Recommended',
        matchedFor: `${dims.pitchLabel} pitch · ${sku.currentRating}`,
        description: `Fork-style plated copper jumper bars for busing adjacent poles together under ${sku.model} barrier screws.`,
        specs: [
          { label: 'Pitch Match', value: dims.pitchLabel },
          { label: 'Rated Current', value: sku.currentRating },
          { label: 'Poles', value: '2 / 3 / 4 / 6 / 10 Way' },
          { label: 'Material', value: 'Tinned Brass' },
        ],
      },
      {
        ...marker,
        id: `${safeCode}-marker`,
        partNumber: `MT-BAR-${widthTag}`,
        title: `${dims.pitchLabel} Printed Barrier Marking Strip`,
        necessity: 'Recommended',
        matchedFor: `Pole spacing ${dims.pitchLabel}`,
        description: `Rigid slip-in marking label card printed sequentially or blank for ${sku.model} circuit numbering.`,
        specs: [
          { label: 'Pitch Match', value: dims.pitchLabel },
          { label: 'Format', value: 'Sequential / Blank' },
          { label: 'Material', value: 'Rigid PVC / PA' },
          { label: 'Fit Model', value: sku.model },
        ],
      },
    ];
  }

  if (category.id === 'bolt-connection' || category.id === 'nut-connection') {
    const studMatch = sku.torqueOrStrip?.match(/M\d+/i)?.[0] || 'M8';
    return [
      {
        ...lug,
        id: `${safeCode}-lugs`,
        partNumber: `TCL-${studMatch}-${widthTag}`,
        title: `Heavy-Duty Copper Ring Lugs (${studMatch} Stud)`,
        necessity: 'Essential',
        matchedFor: `${studMatch} stud · ${sku.wireRangeIec}`,
        description: `Heavy-wall electrolytic copper ring terminals matched to the ${studMatch} bolt diameter and ${sku.wireRangeIec} cable range of ${sku.model}.`,
        specs: [
          { label: 'Stud Fit', value: studMatch },
          { label: 'Cable Size', value: sku.wireRangeIec },
          { label: 'Plating', value: 'Electro-Tin Cu' },
          { label: 'Standard', value: 'DIN 46235 / UL' },
        ],
      },
      {
        ...pp,
        id: `${safeCode}-shroud`,
        partNumber: `PP-${safeCode}`,
        title: `Phase Separation Barrier & Safety Shroud`,
        necessity: 'Essential',
        matchedFor: `${sku.voltageRating} phase clearance`,
        description: `Snap-in high-voltage dividing wall and protective cover isolating high-current studs on ${sku.model} assemblies.`,
        specs: [
          { label: 'Dielectric', value: sku.voltageRating },
          { label: 'Material', value: 'PA 6.6 UL 94 V-0' },
          { label: 'Fit Model', value: sku.model },
          { label: 'Protection', value: 'IP20 Finger-Safe' },
        ],
      },
      {
        ...rail,
        id: `${safeCode}-rail`,
        partNumber: sku.mounting.includes('G 32') ? 'G32-1000-HD' : 'TS35-15-1000',
        title: `Heavy-Wall DIN Mounting Rail (${sku.mounting})`,
        necessity: 'Essential',
        matchedFor: `Mounting interface: ${sku.mounting}`,
        description: `High-rigidity 1.5 mm thick galvanized steel mounting rail rated for torque loads up to ${sku.torqueOrStrip || 'heavy stud clamping'}.`,
        specs: [
          { label: 'Profile', value: sku.mounting },
          { label: 'Thickness', value: '1.5 mm Heavy Gauge' },
          { label: 'Standard', value: 'IEC / EN 60715' },
          { label: 'Length', value: '1000 mm / 2000 mm' },
        ],
      },
      {
        ...marker,
        id: `${safeCode}-marker`,
        partNumber: `MT-${widthTag}-PWR`,
        title: `High-Contrast Phase Marking Tags (L1/L2/L3/PE)`,
        necessity: 'Recommended',
        matchedFor: `Width ${dims.pitchLabel}`,
        description: `Wide-format power identification tags fitting ${sku.model} feeder housings for clear switchgear labeling.`,
        specs: [
          { label: 'Width Fit', value: dims.pitchLabel },
          { label: 'Legends', value: 'L1 / L2 / L3 / N / PE' },
          { label: 'Material', value: 'Halogen-Free PA' },
          { label: 'Print Type', value: 'Thermal / Plotter' },
        ],
      },
      {
        ...jumper,
        id: `${safeCode}-bridge`,
        partNumber: `CJ-${category.seriesCode.split('/')[0].trim()}-${widthTag}`,
        title: `High-Current Copper Busbar Cross Bridge`,
        necessity: 'Optional',
        matchedFor: `${sku.currentRating} common potential bus`,
        description: `Bolt-on tinned copper link bar for paralleling adjacent ${sku.model} feeder blocks.`,
        image: 'images/acc_busbar_bridge_1795090627060.jpg',
        imageAlt: `Heavy-duty copper busbar cross-bridge link bars for ${sku.model}`,
        specs: [
          { label: 'Rating', value: sku.currentRating },
          { label: 'Pitch', value: dims.pitchLabel },
          { label: 'Conductor', value: 'ETP Copper' },
          { label: 'Poles', value: '2 / 3 / 4 Way' },
        ],
      },
    ];
  }

  // Standard & Special DIN-Rail Blocks (TSC, TSC-R, TSS)
  const dinItems: ModelAccessoryItem[] = [
    {
      ...ep,
      id: `${safeCode}-endplate`,
      partNumber: `EP-${safeCode}`,
      title: `Matching End Cover Plate for ${sku.model}`,
      necessity: 'Essential',
      matchedFor: `Exact housing profile (${dims.lengthMm} × ${dims.heightMm} mm)`,
      description: `Snap-on UL 94 V-0 polyamide end plate contoured specifically for ${sku.model} to seal the open terminal side for IP20 finger safety.`,
      specs: [
        { label: 'Fit Model', value: sku.model },
        { label: 'Thickness', value: '1.8 mm' },
        { label: 'Material', value: 'PA 6.6 UL 94 V-0' },
        { label: 'Dimensions', value: `${dims.lengthMm} × ${dims.heightMm} mm` },
      ],
    },
    {
      ...rail,
      id: `${safeCode}-rail`,
      partNumber: sku.mounting.includes('G 32') ? 'G32-1000' : 'TS35-7.5-1000',
      title: `DIN Mounting Rail (${sku.mounting}) & End Stops`,
      necessity: 'Essential',
      matchedFor: `${sku.mounting} carrier rail`,
      description: `EN 60715 zinc-plated mounting rail and screw-lock end brackets anchoring ${sku.model} blocks securely in control panels.`,
      specs: [
        { label: 'Profile', value: sku.mounting },
        { label: 'Finish', value: 'Trivalent Zinc-Plated' },
        { label: 'Standard', value: 'IEC / EN 60715' },
        { label: 'Lengths', value: '1000 mm / 2000 mm' },
      ],
    },
    {
      ...marker,
      id: `${safeCode}-markers`,
      partNumber: `MT-${widthTag}`,
      title: `${dims.pitchLabel} Terminal Marking Tags`,
      necessity: 'Recommended',
      matchedFor: `Exact ${dims.pitchLabel} block width`,
      description: `Snap-in halogen-free white marking strips pitched precisely at ${dims.pitchLabel} to match ${sku.model} top and side marker slots.`,
      specs: [
        { label: 'Pitch Match', value: dims.pitchLabel },
        { label: 'Print Type', value: 'Thermal / Plotter' },
        { label: 'Material', value: 'Halogen-Free PA' },
        { label: 'Format', value: 'Blank & Numbered' },
      ],
    },
  ];

  if (!isEarth) {
    dinItems.push({
      ...jumper,
      id: `${safeCode}-jumper`,
      partNumber: `CJ-${widthTag}-10P`,
      title: `Insulated Cross Jumper (${dims.pitchLabel} Pitch)`,
      necessity: 'Recommended',
      matchedFor: `${dims.pitchLabel} pitch · ${sku.currentRating}`,
      description: `Plug-in / screw-down insulated copper jumper bridge rated at ${sku.currentRating} for common potential distribution across adjacent ${sku.model} blocks.`,
      specs: [
        { label: 'Pitch Match', value: dims.pitchLabel },
        { label: 'Rated Current', value: sku.currentRating },
        { label: 'Poles', value: '2 / 3 / 4 / 10 Way' },
        { label: 'Conductor', value: 'Tinned Copper' },
      ],
    });
  }

  dinItems.push({
    ...testPlug,
    id: `${safeCode}-testplug`,
    partNumber: dims.widthMm >= 8 ? 'TP-4.0' : 'TP-2.0',
    title: `Test Plug & Socket Adapter (${dims.widthMm >= 8 ? '4.0 mm' : '2.0 mm'})`,
    necessity: isDisconnect ? 'Essential' : 'Recommended',
    matchedFor: `${sku.model} integrated test port`,
    description: isDisconnect
      ? `Shrouded metering test probe engineered for live CT/PT commissioning and test-port verification on ${sku.model}.`
      : `Shrouded ${dims.widthMm >= 8 ? '4.0 mm' : '2.0 mm'} test probe adapter inserting cleanly into the bridge/test socket of ${sku.model}.`,
    specs: [
      { label: 'Probe Dia.', value: dims.widthMm >= 8 ? '4.0 mm' : '2.0 mm' },
      { label: 'Voltage', value: '600 V CAT III' },
      { label: 'Current', value: sku.currentRating },
      { label: 'Colors', value: 'Red / Black / Yellow' },
    ],
  });

  dinItems.push({
    ...pp,
    id: `${safeCode}-partition`,
    partNumber: `PP-${category.seriesCode.split('/')[0].trim()}`,
    title: `High-Voltage Partition Plate (${sku.voltageRating})`,
    necessity: 'Optional',
    matchedFor: `${sku.voltageRating} circuit separation`,
    description: `Extended-profile separating plate providing visual group division and enhanced ${sku.voltageRating} creepage/clearance next to ${sku.model}.`,
    specs: [
      { label: 'Dielectric', value: sku.voltageRating },
      { label: 'Thickness', value: '2.0 mm' },
      { label: 'Material', value: 'PA 6.6 UL 94 V-0' },
      { label: 'Fit Series', value: category.seriesCode },
    ],
  });

  return dinItems;
}

export function getCompatibleAccessories(categoryId: string): AccessoryItem[] {
  const byId = new Map(ACCESSORIES.map((item) => [item.id, item]));
  const pick = (...ids: string[]): AccessoryItem[] =>
    ids.map((id) => byId.get(id)).filter((item): item is AccessoryItem => Boolean(item));

  if (categoryId === 'bolt-connection' || categoryId === 'nut-connection') {
    return pick('lug-series', 'pp-series', 'din-rails', 'marker-series', 'jumper-series');
  }
  if (categoryId === 'pcb-terminal-blocks' || categoryId === 'pcb-connectors') {
    return pick('lug-series', 'marker-series', 'pp-series', 'test-plugs');
  }
  if (categoryId === 'barrier-terminal-blocks') {
    return pick('lug-series', 'pp-series', 'jumper-series', 'marker-series');
  }
  if (categoryId === 'spring-cage' || categoryId === 'screw-connection' || categoryId === 'screw-support') {
    return pick('ep-series', 'din-rails', 'jumper-series', 'marker-series', 'test-plugs', 'pp-series');
  }
  return ACCESSORIES;
}

export interface CompatibleModelRef {
  model: string;
  route: RoutePath;
  seriesCode: string;
  categoryId: string;
  categoryTitle: string;
}

export interface CatalogAccessoryItem extends ModelAccessoryItem {
  compatibleModels: CompatibleModelRef[];
  compatibleSeriesIds: string[];
  compatibleSeriesLabels: string[];
}

const NECESSITY_RANK: Record<ModelAccessoryItem['necessity'], number> = {
  Essential: 0,
  Recommended: 1,
  Optional: 2,
};

export function getAllCatalogAccessories(): CatalogAccessoryItem[] {
  const byPart = new Map<
    string,
    CatalogAccessoryItem & {
      _modelSet: Set<string>;
      _seriesIdSet: Set<string>;
      _seriesLabelSet: Set<string>;
    }
  >();

  for (const cat of PRODUCT_CATEGORIES) {
    for (const sku of cat.skus) {
      const modelRoute = getModelRoute(sku.model);
      const skuAccessories = getAccessoriesForModel(sku, cat);

      for (const acc of skuAccessories) {
        const existing = byPart.get(acc.partNumber);
        const modelRef: CompatibleModelRef = {
          model: sku.model,
          route: modelRoute,
          seriesCode: cat.seriesCode,
          categoryId: cat.id,
          categoryTitle: cat.title,
        };

        if (!existing) {
          byPart.set(acc.partNumber, {
            ...acc,
            id: acc.partNumber,
            compatibleModels: [modelRef],
            compatibleSeriesIds: [cat.id],
            compatibleSeriesLabels: [cat.seriesCode],
            _modelSet: new Set([sku.model]),
            _seriesIdSet: new Set([cat.id]),
            _seriesLabelSet: new Set([cat.seriesCode]),
          });
        } else {
          if (NECESSITY_RANK[acc.necessity] < NECESSITY_RANK[existing.necessity]) {
            existing.necessity = acc.necessity;
          }
          if (!existing._modelSet.has(sku.model)) {
            existing._modelSet.add(sku.model);
            existing.compatibleModels.push(modelRef);
          }
          if (!existing._seriesIdSet.has(cat.id)) {
            existing._seriesIdSet.add(cat.id);
            existing.compatibleSeriesIds.push(cat.id);
          }
          if (!existing._seriesLabelSet.has(cat.seriesCode)) {
            existing._seriesLabelSet.add(cat.seriesCode);
            existing.compatibleSeriesLabels.push(cat.seriesCode);
          }
        }
      }
    }
  }

  const normalized = Array.from(byPart.values()).map(
    ({ _modelSet, _seriesIdSet, _seriesLabelSet, ...item }) => {
      if (item.compatibleModels.length > 1) {
        return {
          ...item,
          matchedFor: `Matched to ${item.compatibleModels.length} ${item.compatibleSeriesLabels.join(' / ')} models`,
        };
      }
      return item;
    }
  );

  // Interleave across distinct accessory image families (categories & subtypes) so
  // every catalog page presents diverse hardware components rather than walls of repeated thumbnails.
  const bucketOrder: string[] = [];
  const buckets = new Map<string, CatalogAccessoryItem[]>();

  const sortedBase = [...normalized].sort((a, b) => {
    const rankDiff = NECESSITY_RANK[a.necessity] - NECESSITY_RANK[b.necessity];
    if (rankDiff !== 0) return rankDiff;
    return a.partNumber.localeCompare(b.partNumber);
  });

  for (const item of sortedBase) {
    const key = `${item.category}::${item.image}`;
    if (!buckets.has(key)) {
      buckets.set(key, []);
      bucketOrder.push(key);
    }
    buckets.get(key)!.push(item);
  }

  const interleaved: CatalogAccessoryItem[] = [];
  let added = true;
  let round = 0;
  while (added) {
    added = false;
    for (const key of bucketOrder) {
      const list = buckets.get(key)!;
      if (round < list.length) {
        interleaved.push(list[round]);
        added = true;
      }
    }
    round += 1;
  }

  return interleaved;
}

export interface AccessoryFilterOptions {
  category: string;
  seriesId: string;
  necessity?: string;
  searchQuery: string;
}

export function filterCatalogAccessories(
  items: CatalogAccessoryItem[],
  options: AccessoryFilterOptions
): CatalogAccessoryItem[] {
  const q = options.searchQuery.trim().toLowerCase();
  return items.filter((item) => {
    if (options.category !== 'All' && item.category !== options.category) {
      return false;
    }
    if (
      options.seriesId !== 'All' &&
      !item.compatibleSeriesIds.includes(options.seriesId)
    ) {
      return false;
    }
    if (
      options.necessity &&
      options.necessity !== 'All' &&
      item.necessity !== options.necessity
    ) {
      return false;
    }
    if (!q) return true;

    return (
      item.partNumber.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.series.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.matchedFor.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.compatibleModels.some(
        (m) =>
          m.model.toLowerCase().includes(q) ||
          m.seriesCode.toLowerCase().includes(q) ||
          m.categoryTitle.toLowerCase().includes(q)
      ) ||
      item.specs.some(
        (s) =>
          s.label.toLowerCase().includes(q) ||
          s.value.toLowerCase().includes(q)
      )
    );
  });
}

export const DEFAULT_ACCESSORIES_PAGE_SIZE = 18;

export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export function paginateItems<T>(
  allItems: T[],
  requestedPage: number,
  pageSize: number = DEFAULT_ACCESSORIES_PAGE_SIZE
): PaginatedResult<T> {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const totalItems = allItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, Math.floor(requestedPage)), totalPages);

  if (totalItems === 0) {
    return {
      items: [],
      currentPage: 1,
      pageSize: safePageSize,
      totalItems: 0,
      totalPages: 1,
      startIndex: 0,
      endIndex: 0,
    };
  }

  const offset = (currentPage - 1) * safePageSize;
  const items = allItems.slice(offset, offset + safePageSize);
  return {
    items,
    currentPage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
    startIndex: offset + 1,
    endIndex: offset + items.length,
  };
}

export type PaginationToken = number | 'ellipsis';

export function getPaginationRange(
  currentPage: number,
  totalPages: number
): PaginationToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const tokens: PaginationToken[] = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) {
    tokens.push('ellipsis');
  }
  for (let p = left; p <= right; p += 1) {
    tokens.push(p);
  }
  if (right < totalPages - 1) {
    tokens.push('ellipsis');
  }
  tokens.push(totalPages);

  return tokens;
}


