export type RoutePath =
  | '/'
  | '/products'
  | '/accessories'
  | '/spring-cage-connection'
  | '/screw-connection'
  | '/screw-support'
  | '/bolt-connection'
  | '/nut-connection'
  | '/quality'
  | '/about'
  | '/contact'
  | '/quote';

export interface ProductSku {
  model: string;
  name: string;
  connectionType: string;
  wireRangeIec: string;
  wireRangeUl?: string;
  currentRating: string;
  voltageRating: string;
  widthOrPitch?: string;
  torqueOrStrip?: string;
  mounting: string;
  approvals: string[];
  notes?: string;
}

export interface ProductCategory {
  id: string;
  slug: RoutePath;
  indexNumber: string;
  title: string;
  shortTitle: string;
  seriesCode: string;
  classification: string;
  tagline: string;
  description: string;
  wireRangeSummary: string;
  currentMaxSummary: string;
  voltageMaxSummary: string;
  railCompatibility: string;
  image: string;
  imageAlt: string;
  principleTitle: string;
  principleSummary: string;
  principlePoints: { title: string; detail: string }[];
  steps?: { step: string; title: string; detail: string }[];
  skus: ProductSku[];
  faqs: { question: string; answer: string }[];
}

export interface AccessoryItem {
  id: string;
  series: string;
  category: string;
  title: string;
  description: string;
  specs: { label: string; value: string }[];
}

export interface ApplicationSector {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  demands: string[];
  recommendedSeries: { label: string; series: string; route: RoutePath }[];
  image: string;
  imageAlt: string;
}

export interface CertificationStandard {
  id: string;
  code: string;
  title: string;
  scope: string;
  description: string;
  verification: string;
}

export const IMAGES = {
  heroDinRail: '/src/assets/images/hero_din_rail_blocks_1794553738491.jpg',
  springCage: '/src/assets/images/prod_spring_cage_1794553739589.jpg',
  screwClamp: '/src/assets/images/prod_screw_clamp_1794553739965.jpg',
  boltPower: '/src/assets/images/prod_bolt_power_1794553740772.jpg',
  nutDistribution: '/src/assets/images/prod_nut_distribution_1794553741438.jpg',
  controlCabinet: '/src/assets/images/app_control_cabinet_1794553742856.jpg',
};

export const HERO_METRICS = [
  { value: '5+', label: 'Connection Techs', unit: 'Modular Systems' },
  { value: '1000V', label: 'Max Rated Voltage', unit: 'IEC 60947-7-1' },
  { value: '300A', label: 'Max Current', unit: 'Heavy Busbar' },
  { value: 'IP20', label: 'Touch-Proof Safety', unit: 'PA 6.6 Housing' },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'spring-cage',
    slug: '/spring-cage-connection',
    indexNumber: '01',
    title: 'Spring Cage Connection',
    shortTitle: 'Spring Cage',
    seriesCode: 'TSC / TSCX',
    classification: 'Vibration-Proof',
    tagline: 'Maintenance-free, gas-tight, and up to 75% faster wire termination.',
    description:
      'Engineered with corrosion-resistant stainless steel clamping springs that apply continuous contact pressure regardless of conductor thermal cycling or mechanical vibration.',
    wireRangeSummary: '0.2 – 16 mm²',
    currentMaxSummary: '76 A',
    voltageMaxSummary: '1000 V',
    railCompatibility: 'DIN 35 / TS 15 Rail',
    image: IMAGES.springCage,
    imageAlt: 'TermiCore TSC / TSCX spring cage DIN rail terminal block assembly',
    principleTitle: 'How Spring Clamp Connection Works',
    principleSummary:
      'The precision-formed chrome-nickel spring steel cage presses the conductor directly against a tin-plated electrolytic copper current bar, creating a gas-tight, vibration-resistant joint without torque drift.',
    principlePoints: [
      {
        title: 'Constant Contact Force',
        detail: 'Self-compensating spring tension prevents loosening during thermal expansion and heavy machine vibration.',
      },
      {
        title: 'Rapid Tool-Assisted Wiring',
        detail: 'Front-entry actuator ports accept standard slotted screwdrivers for fast solid or ferruled stranded termination.',
      },
      {
        title: 'Gas-Tight Copper Interface',
        detail: 'High contact pressure excludes oxygen from the contact zone, keeping contact resistance low over long service intervals.',
      },
    ],
    steps: [
      {
        step: '1',
        title: 'Open Clamp',
        detail: 'Insert a standard screwdriver into the square actuation slot to deflect the stainless spring.',
      },
      {
        step: '2',
        title: 'Insert Conductor',
        detail: 'Feed stripped solid or ferruled stranded wire straight into the round entry funnel.',
      },
      {
        step: '3',
        title: 'Release & Lock',
        detail: 'Withdraw the tool; the spring locks the conductor firmly against the copper busbar.',
      },
    ],
    skus: [
      {
        model: 'TSC 2.5',
        name: 'TSC 2.5 Feed-Through Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '800 V',
        widthOrPitch: '5.0 mm',
        torqueOrStrip: '10 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC 4',
        name: 'TSC 4 Feed-Through Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '32 A',
        voltageRating: '800 V',
        widthOrPitch: '6.0 mm',
        torqueOrStrip: '10 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC 6',
        name: 'TSC 6 High-Power Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.5 - 6.0 mm²',
        wireRangeUl: '20 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '1000 V',
        widthOrPitch: '8.0 mm',
        torqueOrStrip: '12 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC 10',
        name: 'TSC 10 Power Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.5 - 10.0 mm²',
        wireRangeUl: '18 - 6 AWG',
        currentRating: '57 A',
        voltageRating: '1000 V',
        widthOrPitch: '10.0 mm',
        torqueOrStrip: '15 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC 16',
        name: 'TSC 16 Heavy-Duty Block',
        connectionType: 'High Power',
        wireRangeIec: '1.5 - 16.0 mm²',
        wireRangeUl: '14 - 4 AWG',
        currentRating: '76 A',
        voltageRating: '1000 V',
        widthOrPitch: '12.0 mm',
        torqueOrStrip: '16 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC 2.5-1X2',
        name: 'TSC 2.5-1X2 Multi-Conductor',
        connectionType: '3-Conductor',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '800 V',
        widthOrPitch: '5.0 mm',
        torqueOrStrip: '10 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
      },
      {
        model: 'TSC 2.5-2X2',
        name: 'TSC 2.5-2X2 Multi-Conductor',
        connectionType: '4-Conductor',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '800 V',
        widthOrPitch: '5.0 mm',
        torqueOrStrip: '10 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
      },
      {
        model: 'TSCDD',
        name: 'TSCDD Double Level Block',
        connectionType: 'Double Level',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '500 V',
        widthOrPitch: '5.0 mm',
        torqueOrStrip: '10 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
      },
      {
        model: 'TSCG 2.5',
        name: 'TSCG 2.5 Earth (Ground)',
        connectionType: 'Earth (Ground)',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: 'PE Rail Foot',
        voltageRating: '800 V',
        widthOrPitch: '5.0 mm',
        torqueOrStrip: '10 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-2', 'CE'],
      },
      {
        model: 'TSCK 4',
        name: 'TSCK 4 Knife Disconnect',
        connectionType: 'Knife Disconnect',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '16 A',
        voltageRating: '500 V',
        widthOrPitch: '6.0 mm',
        torqueOrStrip: '10 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
      },
      {
        model: 'TSCF 4',
        name: 'TSCF 4 Fuse Terminal (5x20mm)',
        connectionType: 'Fuse (5x20mm)',
        wireRangeIec: '0.2 - 4.0 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '6.3 A Max',
        voltageRating: '500 V',
        widthOrPitch: '8.0 mm',
        torqueOrStrip: '10 mm strip',
        mounting: 'DIN 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-3', 'CE'],
      },
      {
        model: 'TMCT 2.5',
        name: 'TMCT 2.5 Mini Micro Block',
        connectionType: 'Mini Micro',
        wireRangeIec: '0.2 - 2.5 mm²',
        wireRangeUl: '24 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '500 V',
        widthOrPitch: '5.0 mm',
        torqueOrStrip: '9 mm strip',
        mounting: 'TS 15 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
      },
    ],
    faqs: [
      {
        question: 'Can fine-stranded wires be inserted without ferrules?',
        answer:
          'Yes. When the spring cage is opened with a screwdriver, fine-stranded copper conductors from 0.2 mm² to 16 mm² can be inserted directly or fitted with insulated ferrules for maximum wiring neatness.',
      },
      {
        question: 'Are TSC series blocks compatible with standard TS 35 DIN rails?',
        answer:
          'All TSC and TSCX blocks snap onto both TS 35/7.5 and TS 35/15 asymmetrical/symmetrical DIN rails, while TMCT 2.5 mini blocks mount onto compact TS 15 rails.',
      },
      {
        question: 'How do spring cage terminals perform in high-vibration environments?',
        answer:
          'Because clamping pressure is maintained by an elastic stainless-steel spring rather than thread friction, the contact remains gas-tight under continuous shock and vibration.',
      },
    ],
  },
  {
    id: 'screw-connection',
    slug: '/screw-connection',
    indexNumber: '02',
    title: 'Screw Connection',
    shortTitle: 'Screw Clamp',
    seriesCode: 'TSC-R / TSE',
    classification: 'Industry Standard',
    tagline: 'Dependable, high contact force wire termination with Reakdyn anti-loosening.',
    description:
      'Universal clamping yoke terminal blocks offering high pull-out strength, multi-conductor clamping capacity, and Reakdyn self-locking screw geometry across 0.5 mm² to 50 mm².',
    wireRangeSummary: '0.5 – 50 mm²',
    currentMaxSummary: '150 A',
    voltageMaxSummary: '1000 V',
    railCompatibility: 'TS 35 / G 32 Rail',
    image: IMAGES.screwClamp,
    imageAlt: 'TermiCore TSC-R screw clamp DIN rail terminal block with brass yoke',
    principleTitle: 'The Reakdyn Anti-Loosening Screw Clamping Principle',
    principleSummary:
      'As the clamping screw is tightened, the slot in the hardened clamping yoke widens elastically and acts like a spring washer, locking the screw threads against vibration-induced back-out.',
    principlePoints: [
      {
        title: 'Reakdyn Thread Locking',
        detail: 'Controlled elastic deformation of the yoke body eliminates the need for periodic re-torquing in panel service.',
      },
      {
        title: 'High-Conductivity Brass Yoke',
        detail: 'Electrolytic copper current bars paired with zinc-chromated steel screws maximize mechanical torque and thermal stability.',
      },
      {
        title: 'Dual TS 35 & G 32 Footing',
        detail: 'Universal mounting foot geometry snaps cleanly onto both TS 35 top-hat and G 32 C-section DIN rails.',
      },
    ],
    skus: [
      {
        model: 'TSC-R 2.5',
        name: 'TSC-R 2.5 Screw Terminal Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.5 - 2.5 mm²',
        wireRangeUl: '22 - 12 AWG',
        currentRating: '24 A',
        voltageRating: '800 V',
        widthOrPitch: '6.0 mm',
        torqueOrStrip: '0.4 - 0.6 Nm',
        mounting: 'TS 35 / G 32',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC-R 4',
        name: 'TSC-R 4 Universal Screw Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.5 - 4.0 mm²',
        wireRangeUl: '22 - 10 AWG',
        currentRating: '32 A',
        voltageRating: '800 V',
        widthOrPitch: '6.5 mm',
        torqueOrStrip: '0.5 - 0.8 Nm',
        mounting: 'TS 35 / G 32',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC-R 6',
        name: 'TSC-R 6 High-Current Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.5 - 6.0 mm²',
        wireRangeUl: '20 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '800 V',
        widthOrPitch: '8.0 mm',
        torqueOrStrip: '0.8 - 1.2 Nm',
        mounting: 'TS 35 / G 32',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC-R 10',
        name: 'TSC-R 10 Heavy-Duty Power Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '1.5 - 10.0 mm²',
        wireRangeUl: '16 - 6 AWG',
        currentRating: '57 A',
        voltageRating: '1000 V',
        widthOrPitch: '10.0 mm',
        torqueOrStrip: '1.2 - 1.8 Nm',
        mounting: 'TS 35 / G 32',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC-R 16',
        name: 'TSC-R 16 Power Distribution Block',
        connectionType: 'Power Block',
        wireRangeIec: '2.5 - 16.0 mm²',
        wireRangeUl: '14 - 4 AWG',
        currentRating: '76 A',
        voltageRating: '1000 V',
        widthOrPitch: '12.0 mm',
        torqueOrStrip: '1.5 - 2.0 Nm',
        mounting: 'TS 35 / G 32',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC-R 35',
        name: 'TSC-R 35 High-Capacity Block',
        connectionType: 'Power Feeder',
        wireRangeIec: '10.0 - 35.0 mm²',
        wireRangeUl: '8 - 1/0 AWG',
        currentRating: '125 A',
        voltageRating: '1000 V',
        widthOrPitch: '15.0 mm',
        torqueOrStrip: '2.5 - 3.0 Nm',
        mounting: 'TS 35 / G 32',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC-R 50',
        name: 'TSC-R 50 Extra Heavy-Duty Block',
        connectionType: 'Heavy Feeder',
        wireRangeIec: '16.0 - 50.0 mm²',
        wireRangeUl: '6 - 1/0 AWG',
        currentRating: '150 A',
        voltageRating: '1000 V',
        widthOrPitch: '20.0 mm',
        torqueOrStrip: '3.5 - 4.5 Nm',
        mounting: 'TS 35 / G 32',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE', 'RoHS'],
      },
      {
        model: 'TSC-RD 4',
        name: 'TSC-RD 4 Double-Deck Block',
        connectionType: 'Double-Deck',
        wireRangeIec: '0.5 - 4.0 mm²',
        wireRangeUl: '22 - 10 AWG',
        currentRating: '32 A',
        voltageRating: '500 V',
        widthOrPitch: '6.0 mm',
        torqueOrStrip: '0.5 - 0.8 Nm',
        mounting: 'TS 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
      },
      {
        model: 'TSE 4',
        name: 'TSE 4 Earth (Ground) Block',
        connectionType: 'Earth (Ground)',
        wireRangeIec: '0.5 - 4.0 mm²',
        wireRangeUl: '22 - 10 AWG',
        currentRating: 'PE Rail Foot',
        voltageRating: '800 V',
        widthOrPitch: '6.5 mm',
        torqueOrStrip: '0.5 - 0.8 Nm',
        mounting: 'TS 35 Rail',
        approvals: ['UL 1059', 'IEC 60947-7-2', 'CE'],
      },
      {
        model: 'TSC-RSD 6',
        name: 'TSC-RSD 6 Sliding Disconnect',
        connectionType: 'Sliding Disconnect',
        wireRangeIec: '0.5 - 6.0 mm²',
        wireRangeUl: '20 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '500 V',
        widthOrPitch: '8.0 mm',
        torqueOrStrip: '0.8 - 1.2 Nm',
        mounting: 'TS 35 / G 32',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
      },
      {
        model: 'TSC-F 4',
        name: 'TSC-F 4 Fuse Terminal Block',
        connectionType: 'Fuse Terminal',
        wireRangeIec: '0.5 - 4.0 mm²',
        wireRangeUl: '22 - 10 AWG',
        currentRating: '6.3 A Max',
        voltageRating: '500 V',
        widthOrPitch: '8.0 mm',
        torqueOrStrip: '0.5 - 0.8 Nm',
        mounting: 'TS 35 / G 32',
        approvals: ['UL 1059', 'IEC 60947-7-3', 'CE'],
      },
      {
        model: 'TSS 4',
        name: 'TSS 4 Spring-Assisted Screw Block',
        connectionType: 'Spring Support',
        wireRangeIec: '0.5 - 4.0 mm²',
        wireRangeUl: '22 - 10 AWG',
        currentRating: '32 A',
        voltageRating: '800 V',
        widthOrPitch: '6.5 mm',
        torqueOrStrip: '0.5 - 0.8 Nm',
        mounting: 'TS 35 / G 32',
        approvals: ['UL 1059', 'IEC 60947-7-1', 'CE'],
      },
    ],
    faqs: [
      {
        question: 'What is the Reakdyn anti-loosening mechanism?',
        answer:
          'The slotted clamping yoke expands radially when tightened, exerting continuous counter-force on the screw threads to prevent loosening under thermal cycles and shock.',
      },
      {
        question: 'Can two conductors of equal gauge be terminated in one clamping point?',
        answer:
          'Yes, the TSC-R clamping yoke supports two conductors of identical cross-section (up to half the nominal block rating) on each side when fitted with twin ferrules or solid copper.',
      },
    ],
  },
  {
    id: 'screw-support',
    slug: '/screw-support',
    indexNumber: '03',
    title: 'Screw w/ Spring Support',
    shortTitle: 'Spring Support',
    seriesCode: 'TSS / TSKS',
    classification: 'Anti-Vibration',
    tagline: 'Combines standard screw clamp with an internal compression spring.',
    description:
      'Spring-assisted screw clamping systems engineered for critical switchgear, CT/PT metering, and disconnect circuits where high torque meets uninterrupted spring compensation.',
    wireRangeSummary: '0.5 – 16 mm²',
    currentMaxSummary: '57 A',
    voltageMaxSummary: '1000 V',
    railCompatibility: 'TS 35 / TS 32 Rail',
    image: IMAGES.springCage,
    imageAlt: 'TermiCore TSS / TSKS spring-loaded screw terminal block',
    principleTitle: 'The Spring Support Anti-Loosening Principle',
    principleSummary:
      'An internal compression spring sits between the screw clamp and conductor bus, absorbing conductor creep and thermal expansion while preserving full mechanical clamping torque.',
    principlePoints: [
      {
        title: 'Dual Mechanical Redundancy',
        detail: 'Unites positive screw-clamp pull-out resistance with continuous spring-loaded wire follow-up.',
      },
      {
        title: 'CT/PT Test & Disconnect Variants',
        detail: 'Available with knife disconnects (`TSSD`) and sliding test links (`TSSTD`) with integrated test sockets.',
      },
      {
        title: 'ATEX / Hazardous Area Ready',
        detail: 'Selected TSS feed-through models carry ATEX Ex approvals for oil, gas, and process instrumentation.',
      },
    ],
    skus: [
      {
        model: 'TSS 16',
        name: 'TSS 16 Spring Loaded Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '1.5 - 16 mm²',
        wireRangeUl: '16 - 6 AWG',
        currentRating: '57 A',
        voltageRating: '1000 V',
        widthOrPitch: '12.0 mm',
        torqueOrStrip: 'Spring-Assisted Screw',
        mounting: 'TS 35 / TS 32 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS', 'ATEX Ex'],
      },
      {
        model: 'TSS 4',
        name: 'TSS 4 Spring Loaded Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.5 - 6 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '32 A',
        voltageRating: '1000 V',
        widthOrPitch: '6.0 mm',
        torqueOrStrip: 'Spring-Assisted Screw',
        mounting: 'TS 35 / TS 32 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS', 'ATEX Ex'],
      },
      {
        model: 'TSSD 4WS',
        name: 'TSSD 4WS Disconnect Block',
        connectionType: 'Knife Disconnect',
        wireRangeIec: '0.5 - 4 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '20 A',
        voltageRating: '800 V',
        widthOrPitch: '6.0 mm',
        torqueOrStrip: 'Spring-Assisted Screw',
        mounting: 'TS 35 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TSSTD 6S',
        name: 'TSSTD 6S Test Disconnect Block',
        connectionType: 'Sliding Disconnect',
        wireRangeIec: '0.5 - 10 mm²',
        wireRangeUl: '20 - 8 AWG',
        currentRating: '24 A',
        voltageRating: '630 V',
        widthOrPitch: '8.0 mm',
        torqueOrStrip: 'Metering & Testing',
        mounting: 'TS 35 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TSSD 2.5WS',
        name: 'TSSD 2.5WS Spring Disconnect',
        connectionType: 'Knife Disconnect',
        wireRangeIec: '0.5 - 4 mm²',
        wireRangeUl: '24 - 10 AWG',
        currentRating: '24 A',
        voltageRating: '1000 V',
        widthOrPitch: '6.0 mm',
        torqueOrStrip: 'Spring-Assisted Screw',
        mounting: 'TS 35 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TSSD 6',
        name: 'TSSD 6 Test Disconnect Block',
        connectionType: 'Test Disconnect',
        wireRangeIec: '0.5 - 6 mm²',
        wireRangeUl: '24 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '1000 V',
        widthOrPitch: '8.0 mm',
        torqueOrStrip: 'Spring-Assisted Screw',
        mounting: 'TS 35 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TSSD 6FT',
        name: 'TSSD 6FT Feed-Through Block',
        connectionType: 'Feed-Through',
        wireRangeIec: '0.5 - 10 mm²',
        wireRangeUl: '24 - 8 AWG',
        currentRating: '41 A',
        voltageRating: '1000 V',
        widthOrPitch: '8.0 mm',
        torqueOrStrip: 'Spring-Assisted Screw',
        mounting: 'TS 35 / TS 32 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
    ],
    faqs: [
      {
        question: 'Where are TSS and TSSD spring-support terminals typically specified?',
        answer:
          'Utilities, substations, and heavy process control panels specify TSS/TSSD blocks for CT/PT metering loops and trip circuits where vibration immunity and test disconnect capability are mandatory.',
      },
    ],
  },
  {
    id: 'bolt-connection',
    slug: '/bolt-connection',
    indexNumber: '04',
    title: 'Bolt Connection',
    shortTitle: 'Bolt / Stud',
    seriesCode: 'TBC / TBH',
    classification: 'High-Current',
    tagline: 'Robust stud-type and busbar terminals for heavy power distribution.',
    description:
      'High-current stud and ring/fork lug terminal blocks built with threaded brass studs and high-temperature polyamide or melamine housings rated up to 300 A at 1000 V.',
    wireRangeSummary: '35 – 120 mm²',
    currentMaxSummary: '300 A',
    voltageMaxSummary: '1000 V',
    railCompatibility: 'TS 35 / Panel Mount',
    image: IMAGES.boltPower,
    imageAlt: 'TermiCore TBC / TBH high-current bolt stud power terminal block',
    principleTitle: 'The Bolt Connection Principle',
    principleSummary:
      'Crimped ring or fork cable lugs are bolted directly onto solid threaded brass studs with lock washers, ensuring zero conductor strand shear and maximum contact surface area for feeder cables.',
    principlePoints: [
      {
        title: 'Ring & Fork Lug Security',
        detail: 'Captive ring lugs cannot pull out even if vibration occurs under peak feeder fault currents.',
      },
      {
        title: 'High-Temp Housing Options',
        detail: 'Available in UL 94 V-0 polyamide and high-temperature melamine (`TBH`) for elevated switchgear ambient temperatures.',
      },
      {
        title: 'Hinged Touch-Proof Covers',
        detail: 'Protective shrouds shield live brass studs and lugs to maintain IP20 touch safety inside power cabinets.',
      },
    ],
    skus: [
      {
        model: 'TBC 50',
        name: 'TBC 50 Stud Terminal Block',
        connectionType: 'Stud Type',
        wireRangeIec: '50 mm²',
        wireRangeUl: 'Ring / Fork Lug',
        currentRating: '150 A',
        voltageRating: '1000 V',
        widthOrPitch: 'Stud M6 / M8',
        torqueOrStrip: '3 Nm',
        mounting: 'TS 35 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS', 'ATEX Ex'],
      },
      {
        model: 'TBH 110',
        name: 'TBH 110 Power Terminal',
        connectionType: 'Busbar Terminal',
        wireRangeIec: '35 mm²',
        wireRangeUl: 'Ring / Fork Lug',
        currentRating: '110 A',
        voltageRating: '1000 V',
        widthOrPitch: 'Busbar Mount',
        torqueOrStrip: 'Ring / Fork Lug',
        mounting: 'TS 35 / Base',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TBC 70',
        name: 'TBC 70 Stud Terminal Block',
        connectionType: 'Stud Type',
        wireRangeIec: '70 mm²',
        wireRangeUl: 'Ring / Fork Lug',
        currentRating: '200 A',
        voltageRating: '1000 V',
        widthOrPitch: 'Stud M8',
        torqueOrStrip: '4 Nm',
        mounting: 'TS 35 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TBH 170',
        name: 'TBH 170 Power Distribution Block',
        connectionType: 'Power Distribution',
        wireRangeIec: '120 mm²',
        wireRangeUl: 'Melamine Housing',
        currentRating: '170 A',
        voltageRating: '1000 V',
        widthOrPitch: 'High Temp',
        torqueOrStrip: 'Ring / Fork Lug',
        mounting: 'TS 35 / Base',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TBC 120',
        name: 'TBC 120 High-Current Block',
        connectionType: 'Stud Type',
        wireRangeIec: '120 mm²',
        wireRangeUl: 'Ring / Fork Lug',
        currentRating: '269 A',
        voltageRating: '1000 V',
        widthOrPitch: 'Stud M10',
        torqueOrStrip: '6 Nm',
        mounting: 'TS 35 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TBH 250',
        name: 'TBH 250 Busbar Terminal',
        connectionType: 'Busbar Terminal',
        wireRangeIec: '95 mm²',
        wireRangeUl: 'Ring / Fork Lug',
        currentRating: '250 A',
        voltageRating: '1000 V',
        widthOrPitch: 'Busbar Mount',
        torqueOrStrip: 'Ring / Fork Lug',
        mounting: 'TS 35 / Base',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TBC 185',
        name: 'TBC 185 Bolt Power Terminal',
        connectionType: 'Stud Type',
        wireRangeIec: '95 mm²',
        wireRangeUl: 'Ring / Fork Lug',
        currentRating: '250 A',
        voltageRating: '1000 V',
        widthOrPitch: 'Stud M10',
        torqueOrStrip: '6 Nm',
        mounting: 'TS 35 Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TBH 300',
        name: 'TBH 300 Power Distribution Block',
        connectionType: 'Power Distribution',
        wireRangeIec: 'Up to 120 mm²',
        wireRangeUl: 'Ring / Fork Lug',
        currentRating: '300 A',
        voltageRating: '1000 V',
        widthOrPitch: 'Heavy Busbar',
        torqueOrStrip: '6 Nm',
        mounting: 'TS 35 / Base',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
    ],
    faqs: [
      {
        question: 'What is the difference between TBC and TBH series blocks?',
        answer:
          'TBC models use DIN-rail stud construction with polyamide housings, while TBH models feature heavy busbar architectures including high-temperature melamine housing variants for ratings up to 300 A.',
      },
    ],
  },
  {
    id: 'nut-connection',
    slug: '/nut-connection',
    indexNumber: '05',
    title: '1 Nut Connection for IC & OG',
    shortTitle: '1-Nut IC & OG',
    seriesCode: 'TNC / TNO',
    classification: 'Distribution',
    tagline: 'Versatile combination clamp for specific industrial connection needs.',
    description:
      'Compact multi-output power distribution blocks combining a single heavy-duty 1-nut stud incoming (IC) termination with 2, 4, 6, or 8 screw-clamp outgoing (OG) feeders.',
    wireRangeSummary: '50 – 120 mm² IC / 16 mm² OG',
    currentMaxSummary: '150 A',
    voltageMaxSummary: '1000 V',
    railCompatibility: 'Panel / DIN Rail',
    image: IMAGES.nutDistribution,
    imageAlt: 'TermiCore TNC / TNO 1-nut incoming and screw clamp outgoing distribution block',
    principleTitle: '1 Nut Input (IC) + Screw Clamp Outputs (OG)',
    principleSummary:
      'Replaces bulky multi-block jumper assemblies with a single solid copper bus bridge: one heavy lugged incoming cable feeds up to eight individually clamped branch circuits.',
    principlePoints: [
      {
        title: 'Space-Saving Distribution',
        detail: 'Consolidates main incoming power splitting into a single compact footprint from 53 mm to 98 mm wide.',
      },
      {
        title: 'High Incoming Capacity',
        detail: 'Accepts 50 mm² / 114 A incoming feeders on `TNC` models and up to 120 mm² / 150 A on `TNO` heavy-duty units.',
      },
      {
        title: 'Clean Branch Tap-Offs',
        detail: 'Each outgoing screw clamp accommodates up to 16 mm² / 57 A branch conductors without external comb jumpers.',
      },
    ],
    skus: [
      {
        model: 'TNC1X2',
        name: 'TNC1X2 Distribution Block',
        connectionType: '1-In / 2-Out',
        wireRangeIec: 'IC: 50 mm² | OG: 16 mm²',
        wireRangeUl: '1 Nut IC / Screw OG',
        currentRating: '114 A IC / 57 A OG',
        voltageRating: '800 V',
        widthOrPitch: '53 mm',
        torqueOrStrip: 'TNC Standard',
        mounting: 'Panel / DIN Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TNC1X4',
        name: 'TNC1X4 Distribution Block',
        connectionType: '1-In / 4-Out',
        wireRangeIec: 'IC: 50 mm² | OG: 16 mm²',
        wireRangeUl: '1 Nut IC / Screw OG',
        currentRating: '114 A IC / 57 A OG',
        voltageRating: '800 V',
        widthOrPitch: '68 mm',
        torqueOrStrip: 'TNC Standard',
        mounting: 'Panel / DIN Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TNC1X6',
        name: 'TNC1X6 Distribution Block',
        connectionType: '1-In / 6-Out',
        wireRangeIec: 'IC: 50 mm² | OG: 16 mm²',
        wireRangeUl: '1 Nut IC / Screw OG',
        currentRating: '114 A IC / 57 A OG',
        voltageRating: '800 V',
        widthOrPitch: '83 mm',
        torqueOrStrip: 'TNC Standard',
        mounting: 'Panel / DIN Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TNC1X8',
        name: 'TNC1X8 Distribution Block',
        connectionType: '1-In / 8-Out',
        wireRangeIec: 'IC: 50 mm² | OG: 16 mm²',
        wireRangeUl: '1 Nut IC / Screw OG',
        currentRating: '114 A IC / 57 A OG',
        voltageRating: '800 V',
        widthOrPitch: '98 mm',
        torqueOrStrip: 'TNC Standard',
        mounting: 'Panel / DIN Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TNO150-1X2',
        name: 'TNO150-1X2 Heavy-Duty Block',
        connectionType: '1-In / 2-Out',
        wireRangeIec: 'IC: 120 mm² | OG: 16 mm²',
        wireRangeUl: 'TNO Heavy Duty',
        currentRating: '150 A IC / 57 A OG',
        voltageRating: '1000 V',
        widthOrPitch: 'Heavy Frame',
        torqueOrStrip: 'TNO Heavy Duty',
        mounting: 'Panel / DIN Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TNO150-1X4',
        name: 'TNO150-1X4 Heavy-Duty Block',
        connectionType: '1-In / 4-Out',
        wireRangeIec: 'IC: 120 mm² | OG: 16 mm²',
        wireRangeUl: 'TNO Heavy Duty',
        currentRating: '150 A IC / 57 A OG',
        voltageRating: '1000 V',
        widthOrPitch: 'Heavy Frame',
        torqueOrStrip: 'TNO Heavy Duty',
        mounting: 'Panel / DIN Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TNO150-1X6',
        name: 'TNO150-1X6 Heavy-Duty Block',
        connectionType: '1-In / 6-Out',
        wireRangeIec: 'IC: 120 mm² | OG: 16 mm²',
        wireRangeUl: 'TNO Heavy Duty',
        currentRating: '150 A IC / 57 A OG',
        voltageRating: '1000 V',
        widthOrPitch: 'Heavy Frame',
        torqueOrStrip: 'TNO Heavy Duty',
        mounting: 'Panel / DIN Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
      {
        model: 'TNO150-1X8',
        name: 'TNO150-1X8 Heavy-Duty Block',
        connectionType: '1-In / 8-Out',
        wireRangeIec: 'IC: 120 mm² | OG: 16 mm²',
        wireRangeUl: 'TNO Heavy Duty',
        currentRating: '150 A IC / 57 A OG',
        voltageRating: '1000 V',
        widthOrPitch: 'Heavy Frame',
        torqueOrStrip: 'TNO Heavy Duty',
        mounting: 'Panel / DIN Rail',
        approvals: ['UL 1059', 'CE', 'RoHS'],
      },
    ],
    faqs: [
      {
        question: 'What do IC and OG mean on TNC and TNO blocks?',
        answer:
          'IC denotes the single 1-Nut Stud Incoming feeder port (50 mm² or 120 mm²), while OG denotes the multiple Screw Clamp Outgoing branch ports (16 mm², 57 A each).',
      },
    ],
  },
];

export const ACCESSORIES: AccessoryItem[] = [
  {
    id: 'ep-series',
    series: 'EP Series',
    category: 'Insulation',
    title: 'End Plates',
    description: 'Insulated covers to close open sides and provide electrical separation.',
    specs: [
      { label: 'Material', value: 'Polyamide 6.6 (V-0)' },
      { label: 'Function', value: 'Touch Protection' },
    ],
  },
  {
    id: 'pp-series',
    series: 'PP Series',
    category: 'Separation',
    title: 'Partition Plates',
    description: 'Used to increase creepage and clearance distances between circuits.',
    specs: [
      { label: 'Application', value: 'High Voltage' },
      { label: 'Feature', value: 'Snap-in Mount' },
    ],
  },
  {
    id: 'jumper-series',
    series: 'Jumper Series',
    category: 'Bridging',
    title: 'Insulated Cross Jumpers',
    description: 'Push-in bridging jumpers for effortless potential distribution.',
    specs: [
      { label: 'Configurations', value: '2, 3, 4, 10-way' },
      { label: 'Current Rating', value: 'Up to 41 A' },
    ],
  },
  {
    id: 'marker-series',
    series: 'Marker Series',
    category: 'Identification',
    title: 'Marking Tags & Labels',
    description: 'Pre-printed and blank marker strips for clear circuit identification.',
    specs: [
      { label: 'Types', value: 'Blank / Numbered' },
      { label: 'Compatibility', value: 'Laser / Thermal' },
    ],
  },
  {
    id: 'din-rails',
    series: 'TS 35 / G 32',
    category: 'Mounting',
    title: 'DIN Mounting Rails',
    description: 'Standard steel & aluminum slotted mounting rails.',
    specs: [
      { label: 'Types', value: 'TS 35/7.5, TS 35/15' },
      { label: 'Material', value: 'Zinc-plated Steel' },
    ],
  },
  {
    id: 'test-plugs',
    series: 'Test Plugs',
    category: 'Testing',
    title: 'Test Plugs & Sockets',
    description: 'For safe measurement and testing in live circuits.',
    specs: [
      { label: 'Sizes', value: '2.0 mm, 2.3 mm, 4.0 mm' },
      { label: 'Application', value: 'CT/PT Metering' },
    ],
  },
];

export const APPLICATION_SECTORS: ApplicationSector[] = [
  {
    id: 'electrical-panel',
    title: 'Electrical Panel & Switchgear',
    subtitle: 'Control Cabinets & Power Distribution',
    summary:
      'High-density DIN-rail termination for low-voltage switchgear, MCC panels, and building automation cabinets requiring clear circuit marking and IP20 touch-proof safety.',
    demands: [
      'Compact 5 mm–10 mm pitch density on TS 35 and G 32 rails',
      'Clean potential bridging via 2–10 way insulated cross jumpers',
      'Up to 1000 V / 300 A incoming power distribution',
    ],
    recommendedSeries: [
      { label: 'Spring Cage', series: 'TSC / TSCX', route: '/spring-cage-connection' },
      { label: 'Screw Clamp', series: 'TSC-R / TSE', route: '/screw-connection' },
      { label: '1-Nut Distribution', series: 'TNC / TNO', route: '/nut-connection' },
    ],
    image: IMAGES.controlCabinet,
    imageAlt: 'Industrial electrical switchgear control cabinet wired with DIN rail terminal blocks',
  },
  {
    id: 'robotics',
    title: 'Robotics & Factory Automation',
    subtitle: 'High-Vibration Motion & PLC I/O',
    summary:
      'Continuous dynamic acceleration in robotic workcells demands vibration-proof spring clamping and compact double-level terminal blocks for dense sensor/actuator marshalling.',
    demands: [
      'Gas-tight spring clamp tension immune to shock and continuous motion',
      'Up to 75% faster harness termination during machine assembly',
      'Double-level (`TSCDD`) and multi-conductor (`TSC 2.5-2X2`) density',
    ],
    recommendedSeries: [
      { label: 'Spring Cage', series: 'TSC / TSCDD', route: '/spring-cage-connection' },
      { label: 'Spring Support', series: 'TSS / TSSD', route: '/screw-support' },
    ],
    image: IMAGES.springCage,
    imageAlt: 'Vibration-proof spring cage terminal blocks for industrial automation',
  },
  {
    id: 'solar',
    title: 'Solar & Renewable Energy',
    subtitle: '1000V DC Combiner Boxes & Inverters',
    summary:
      'Photovoltaic string combiners, battery energy storage systems, and inverter skids rely on 1000 V rated power feeders and corrosion-resistant brass stud connections.',
    demands: [
      '1000 V IEC rated creepage & clearance with partition plates',
      'Thermal-cycle stability under outdoor cabinet temperature swings',
      'Heavy-duty 50 mm² to 120 mm² feeder and busbar terminations',
    ],
    recommendedSeries: [
      { label: 'Bolt Connection', series: 'TBC / TBH', route: '/bolt-connection' },
      { label: 'Screw Clamp', series: 'TSC-R 35 / 50', route: '/screw-connection' },
    ],
    image: IMAGES.boltPower,
    imageAlt: 'High-current 1000V stud terminal block for renewable power distribution',
  },
  {
    id: 'automotive',
    title: 'Automotive & Process Machinery',
    subtitle: 'Heavy Assembly Lines & Metering Loops',
    summary:
      'Production line control panels and utility substations utilize Reakdyn anti-loosening screw blocks and spring-assisted test disconnect terminals for safe maintenance.',
    demands: [
      'Reakdyn locking yokes eliminate scheduled torque checks',
      'Knife & sliding disconnect blocks (`TSCK`, `TSSD`, `TSSTD`) for loop isolation',
      'Integrated 2.0 mm – 4.0 mm test sockets for live diagnostics',
    ],
    recommendedSeries: [
      { label: 'Screw Support', series: 'TSS / TSSTD', route: '/screw-support' },
      { label: 'Screw Clamp', series: 'TSC-R / TSC-RSD', route: '/screw-connection' },
    ],
    image: IMAGES.screwClamp,
    imageAlt: 'Reakdyn anti-loosening screw clamp terminal block cutaway',
  },
];

export const CERTIFICATIONS: CertificationStandard[] = [
  {
    id: 'iso-9001',
    code: 'ISO 9001:2015',
    title: 'Quality Management System',
    scope: 'Manufacturing & Process Control',
    description:
      'Our manufacturing facilities operate under a strict Quality Management System, ensuring consistent product excellence across stamping, molding, and assembly.',
    verification: 'Batch Traceability',
  },
  {
    id: 'ul-1059',
    code: 'UL 1059',
    title: 'North American Safety Standard',
    scope: 'Terminal Blocks & Wiring',
    description:
      'Recognized by Underwriters Laboratories (UL), guaranteeing electrical spacing, temperature rise, and pull-out performance in North American markets.',
    verification: 'AWG Rated',
  },
  {
    id: 'iec-60947',
    code: 'IEC 60947-7-1',
    title: 'International Switchgear Standard',
    scope: 'Low-Voltage Controlgear',
    description:
      'Compliant with International Electrotechnical Commission standards for copper conductor terminal blocks, protective earth (`7-2`), and fuse blocks (`7-3`).',
    verification: 'Dielectric Tested',
  },
  {
    id: 'ce',
    code: 'CE Marking',
    title: 'European Conformity',
    scope: 'EEA Health & Safety',
    description:
      'Conforms to European Low Voltage Directive health, safety, and environmental protection standards for industrial equipment sold within the EEA.',
    verification: 'LVD Compliant',
  },
  {
    id: 'rohs',
    code: 'RoHS Compliant',
    title: 'Hazardous Substance Restriction',
    scope: 'Environmental Safety',
    description:
      'Free from restricted hazardous substances including lead, mercury, and cadmium, ensuring environmental safety and recyclability.',
    verification: 'Material Verified',
  },
  {
    id: 'atex',
    code: 'ATEX / IECEx',
    title: 'Hazardous Area Certification',
    scope: 'Explosive Atmospheres',
    description:
      'Selected series (`TSS 4`, `TSS 16`, `TBC 50`) are certified for use in explosive atmospheres across oil, gas, and chemical industries.',
    verification: 'Ex Certified Series',
  },
];

export const TESTING_PROTOCOLS = [
  {
    title: 'Dielectric & Impulse Voltage Testing',
    detail: 'Verifies insulation coordination and creepage/clearance integrity up to rated 1000 V operational limits.',
  },
  {
    title: 'Mechanical Pull-Out & Vibration Proofing',
    detail: 'Validates conductor retention force across minimum and maximum mm² / AWG wire cross-sections.',
  },
  {
    title: 'Thermal Cycling & Temperature Rise',
    detail: 'Measures contact resistance stability under continuous rated current and repeated heat-cool cycles.',
  },
  {
    title: 'Material Excellence',
    detail: 'High-conductivity electrolytic copper current bars paired with UL 94 V-0 flame-retardant Polyamide 6.6 housings.',
  },
];

export const WHY_CHOOSE_PILLARS = [
  {
    number: '01',
    title: 'Global Expertise',
    description: 'Decades of experience in electrical connected solutions across international OEM standards.',
  },
  {
    number: '02',
    title: 'Superior Quality',
    description: 'High-grade electrolytic copper and flame-retardant polyamides tested for reliable performance in every application.',
  },
  {
    number: '03',
    title: 'Innovative Solutions',
    description: 'From Reakdyn anti-loosening yokes to spring-loaded clamps engineered for modern industrial panels.',
  },
  {
    number: '04',
    title: 'Dedicated Support',
    description: 'Technical guidance from specification and CAD selection through sampling and after-sales support.',
  },
];

export const CONTACT_INFO = {
  company: 'TermiCore',
  email: 'info@mainlinetech.com',
  phone: '+91 98765 43210',
  location: 'Mumbai, India',
};
