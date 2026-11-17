export interface NoteItemContext {
  model: string;
  quantity: number;
}

export interface NoteSuggestion {
  id: string;
  label: string;
  text: string;
  mode: 'starter' | 'append';
  keywords: string[];
}

const STARTER_POOL: Omit<NoteSuggestion, 'mode'>[] = [
  {
    id: 'i-have-bulk',
    label: 'I have to order bulk blocks',
    text: 'I have to order DIN-rail terminal blocks for a new control panel project (wire size: 0.2–4.0 mm², qty: ).',
    keywords: ['i have', 'have to', 'order', 'bulk', 'panel', 'control', 'wire', 'mm'],
  },
  {
    id: 'i-have-vibration',
    label: 'I have a high-vibration application',
    text: 'I have to specify vibration-proof Spring Cage or Spring-Support terminals for machinery / railway panels.',
    keywords: ['i have', 'have to', 'vibration', 'spring', 'machinery', 'tsc', 'tss'],
  },
  {
    id: 'i-have-power',
    label: 'I have high-current feeder needs',
    text: 'I have to terminate heavy power feeders (35–120 mm², up to 300 A) using Bolt Stud or 1-Nut distribution blocks.',
    keywords: ['i have', 'have to', 'power', 'amp', '300', 'tbc', 'tbh', 'tnc', 'bolt', 'busbar'],
  },
  {
    id: 'i-had-cross-ref',
    label: 'I had another brand / need equivalent',
    text: 'I had previously specified another terminal block brand and need an equivalent TermiCore cross-reference.',
    keywords: ['i had', 'had', 'previous', 'equiv', 'cross', 'replace', 'alternative'],
  },
  {
    id: 'i-had-loosening',
    label: 'I had screw loosening issues',
    text: 'I had terminal screw loosening in field panels and need Reakdyn anti-loosening or Spring Cage alternatives.',
    keywords: ['i had', 'had', 'loose', 'screw', 'vibration', 'reakdyn'],
  },
  {
    id: 'i-had-existing-quote',
    label: 'I had requested an earlier quote',
    text: 'I had submitted an inquiry earlier and want to update our BOM quantities and delivery schedule.',
    keywords: ['i had', 'had', 'earlier', 'update', 'bom', 'quote', 'schedule'],
  },
  {
    id: 'i-need-docs',
    label: 'I need datasheets & CAD / certs',
    text: 'I need 3D STEP/CAD drawings, datasheets, and UL 1059 / IEC 60947-7-1 / RoHS compliance certificates.',
    keywords: ['i need', 'need', 'cad', 'step', 'datasheet', 'ul', 'iec', 'rohs', 'atex', 'cert'],
  },
  {
    id: 'we-require-samples',
    label: 'We require a sample kit & MOQ',
    text: 'We require an evaluation sample kit along with MOQ pricing and factory lead time.',
    keywords: ['we', 'require', 'sample', 'moq', 'price', 'cost', 'lead', 'time'],
  },
  {
    id: 'please-quote-accessories',
    label: 'Please quote blocks + accessories',
    text: 'Please quote the terminal blocks together with matching end plates, partition plates, cross jumpers, and TS 35 DIN rails.',
    keywords: ['please', 'quote', 'accessor', 'end plate', 'jumper', 'din', 'rail', 'tag', 'marker'],
  },
];

const FOLLOWUP_SNIPPETS: Omit<NoteSuggestion, 'mode'>[] = [
  {
    id: 'append-certs',
    label: '+ UL 1059 / IEC 60947-7-1 certs',
    text: 'Required certifications: UL 1059, IEC 60947-7-1, CE, and RoHS compliance documentation.',
    keywords: ['ul', 'iec', 'cert', 'rohs', 'atex', 'ce'],
  },
  {
    id: 'append-accessories',
    label: '+ End plates & cross jumpers',
    text: 'Please also include compatible end plates, partition plates, 2/4/10-way cross jumpers, and marking tags.',
    keywords: ['accessor', 'plate', 'jumper', 'marker', 'rail'],
  },
  {
    id: 'append-timeline',
    label: '+ Delivery timeline & MOQ',
    text: 'Please share factory lead time, MOQ, and tiered volume pricing.',
    keywords: ['deliver', 'time', 'moq', 'price', 'lead'],
  },
  {
    id: 'append-samples',
    label: '+ Request sample kit',
    text: 'We would also like to request 5–10 evaluation sample pieces before our bulk purchase order.',
    keywords: ['sample', 'eval', 'test', 'po'],
  },
];

export function getQuoteNoteSuggestions(
  currentNotes: string,
  queuedItems: NoteItemContext[] = []
): NoteSuggestion[] {
  const trimmed = currentNotes.trim();
  const lower = trimmed.toLowerCase();

  const bomStarter: NoteSuggestion | null =
    queuedItems.length > 0
      ? {
          id: 'queued-bom',
          label: `Quote queued items (${queuedItems.length})`,
          text: `Please quote pricing, availability, and datasheets for: ${queuedItems
            .map((item) => `${item.model} (${item.quantity} pcs)`)
            .join(', ')}.`,
          mode: 'starter',
          keywords: queuedItems.map((i) => i.model.toLowerCase()),
        }
      : null;

  // Empty input -> show curated diverse starters (including "I have to...", "I had...", "I need...")
  if (!lower) {
    const defaults: NoteSuggestion[] = [
      ...(bomStarter ? [bomStarter] : []),
      { ...STARTER_POOL[0], mode: 'starter' },
      { ...STARTER_POOL[3], mode: 'starter' },
      { ...STARTER_POOL[6], mode: 'starter' },
      { ...STARTER_POOL[7], mode: 'starter' },
      { ...STARTER_POOL[8], mode: 'starter' },
    ];
    return defaults.slice(0, 5);
  }

  // User is still typing a short opening statement (< 32 chars and no period/newline)
  const isTypingOpening = trimmed.length <= 32 && !/[.\n]/.test(trimmed);

  if (isTypingOpening) {
    const tokens = lower.split(/\s+/).filter(Boolean);
    const candidates: NoteSuggestion[] = [
      ...(bomStarter ? [bomStarter] : []),
      ...STARTER_POOL.map((s) => ({ ...s, mode: 'starter' as const })),
    ];

    const scored = candidates
      .map((item) => {
        const textLower = item.text.toLowerCase();
        let score = 0;
        if (textLower.startsWith(lower)) score += 100;
        for (const kw of item.keywords) {
          if (lower.includes(kw)) score += 35;
          else if (kw.startsWith(lower)) score += 25;
        }
        for (const token of tokens) {
          if (token.length >= 2 && (textLower.includes(token) || item.label.toLowerCase().includes(token))) {
            score += 10;
          }
        }
        return { item, score };
      })
      .sort((a, b) => b.score - a.score);

    const matched = scored.filter((entry) => entry.score > 0).map((entry) => entry.item);
    if (matched.length >= 3) {
      return matched.slice(0, 5);
    }
    const fallback = candidates.filter((c) => !matched.some((m) => m.id === c.id));
    return [...matched, ...fallback].slice(0, 5);
  }

  // User already wrote/selected an opening sentence -> offer context-aware follow-up spec snippets
  const unusedFollowups = FOLLOWUP_SNIPPETS.filter(
    (s) => !lower.includes(s.text.slice(0, 22).toLowerCase())
  ).map((s) => ({ ...s, mode: 'append' as const }));

  if (unusedFollowups.length > 0) {
    return unusedFollowups.slice(0, 4);
  }

  return STARTER_POOL.slice(0, 3).map((s) => ({ ...s, mode: 'append' as const }));
}

export const DESCRIPTION_ASSISTANCE_CHIPS: readonly string[] = [
  'I need a quotation for bulk terminal blocks.',
  'I am interested in custom terminal block solutions.',
  'I require product samples for testing.',
  'Please provide pricing for DIN rail accessories.',
];

export function insertDescriptionChip(
  currentNotes: string,
  chipText: string
): string {
  const trimmed = currentNotes.trimEnd();
  if (!trimmed) {
    return chipText;
  }
  return `${trimmed}\n${chipText}`;
}

export function applyNoteSuggestion(
  currentNotes: string,
  suggestion: NoteSuggestion
): string {
  const trimmed = currentNotes.trim();
  if (!trimmed) {
    return suggestion.text;
  }

  if (suggestion.mode === 'starter') {
    const isShortOpening = trimmed.length <= 32 && !/[.\n]/.test(trimmed);
    if (isShortOpening && suggestion.text.toLowerCase().startsWith(trimmed.toLowerCase())) {
      return suggestion.text;
    }
  }

  return `${trimmed}\n${suggestion.text}`;
}
