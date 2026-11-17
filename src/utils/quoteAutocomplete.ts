import { ACCESSORIES, PRODUCT_CATEGORIES } from '../data/termicoreData';

export interface CatalogSearchItem {
  id: string;
  model: string;
  name: string;
  category: string;
  seriesCode: string;
  specSummary: string;
  searchBlob: string;
}

export interface HighlightSegment {
  text: string;
  match: boolean;
}

export interface CountryEntry {
  name: string;
  code: string;
  aliases?: string[];
}

export const QUANTITY_PRESETS = [50, 100, 500, 1000, 5000] as const;

export function isPresetQuantity(quantity: number): boolean {
  return (QUANTITY_PRESETS as readonly number[]).includes(quantity);
}

export function buildCatalogIndex(): CatalogSearchItem[] {
  const skuItems: CatalogSearchItem[] = PRODUCT_CATEGORIES.flatMap((cat) =>
    cat.skus.map((sku) => {
      const specSummary = `${sku.wireRangeIec} · ${sku.currentRating} · ${sku.voltageRating}`;
      return {
        id: sku.model,
        model: sku.model,
        name: sku.name,
        category: `${cat.title} (${cat.seriesCode})`,
        seriesCode: cat.seriesCode,
        specSummary,
        searchBlob: [
          sku.model,
          sku.name,
          cat.title,
          cat.shortTitle,
          cat.seriesCode,
          sku.connectionType,
          sku.wireRangeIec,
          sku.currentRating,
        ]
          .join(' ')
          .toLowerCase(),
      };
    })
  );

  const accessoryItems: CatalogSearchItem[] = ACCESSORIES.map((acc) => {
    const specSummary = acc.specs.map((s) => `${s.label}: ${s.value}`).join(' · ');
    return {
      id: `acc-${acc.id}`,
      model: acc.series,
      name: acc.title,
      category: `DIN Rail Accessories · ${acc.category}`,
      seriesCode: acc.series,
      specSummary,
      searchBlob: [
        acc.series,
        acc.title,
        acc.category,
        acc.description,
        'accessories',
        'din rail',
      ]
        .join(' ')
        .toLowerCase(),
    };
  });

  return [...skuItems, ...accessoryItems];
}

export const CATALOG_SEARCH_INDEX: CatalogSearchItem[] = buildCatalogIndex();

export function searchCatalogProducts(
  query: string,
  limit = 10
): CatalogSearchItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    // Curated representative sample of real catalogue items across series & accessories
    const featuredIds = [
      'TSC 2.5',
      'TSC 4',
      'TSC-R 2.5',
      'TSC-R 4',
      'TSS 4',
      'TBC 50',
      'TNC1X4',
      'acc-ep-series',
    ];
    const featured = featuredIds
      .map((id) => CATALOG_SEARCH_INDEX.find((item) => item.id === id))
      .filter((item): item is CatalogSearchItem => Boolean(item));
    return featured.slice(0, limit);
  }

  const tokens = trimmed.split(/\s+/).filter(Boolean);

  const scored = CATALOG_SEARCH_INDEX.map((item) => {
    const modelLower = item.model.toLowerCase();
    const nameLower = item.name.toLowerCase();
    const categoryLower = item.category.toLowerCase();

    // Every typed token must appear somewhere in the item metadata
    const allTokensMatch = tokens.every((token) => item.searchBlob.includes(token));
    if (!allTokensMatch) {
      return { item, score: 0 };
    }

    let score = 20;
    if (modelLower === trimmed) score += 120;
    else if (modelLower.startsWith(trimmed)) score += 90;
    else if (modelLower.includes(trimmed)) score += 65;

    if (nameLower.startsWith(trimmed)) score += 55;
    else if (nameLower.includes(trimmed)) score += 40;

    if (categoryLower.startsWith(trimmed)) score += 35;
    else if (categoryLower.includes(trimmed)) score += 25;

    for (const token of tokens) {
      if (modelLower.startsWith(token)) score += 20;
      if (nameLower.includes(token)) score += 10;
    }

    return { item, score };
  })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.item.model.localeCompare(b.item.model, undefined, { numeric: true })
    );

  return scored.slice(0, limit).map((entry) => entry.item);
}

export function splitHighlightParts(
  text: string,
  query: string
): HighlightSegment[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [{ text, match: false }];
  }

  const tokens = Array.from(
    new Set(
      trimmed
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
  ).sort((a, b) => b.length - a.length);

  if (tokens.length === 0) {
    return [{ text, match: false }];
  }

  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const rawParts = text.split(regex);

  const tokenSet = new Set(tokens.map((t) => t.toLowerCase()));
  return rawParts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      match: tokenSet.has(part.toLowerCase()),
    }));
}

export const COUNTRIES: readonly CountryEntry[] = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Australia', code: 'AU', aliases: ['aus'] },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Brazil', code: 'BR', aliases: ['brasil'] },
  { name: 'Brunei', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA', aliases: ['can'] },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN', aliases: ['prc'] },
  { name: 'Colombia', code: 'CO' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ', aliases: ['czechia'] },
  { name: 'Denmark', code: 'DK' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE', aliases: ['deutschland'] },
  { name: 'Ghana', code: 'GH' },
  { name: 'Greece', code: 'GR' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN', aliases: ['bharat'] },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT', aliases: ['italia'] },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP', aliases: ['nippon'] },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Malta', code: 'MT' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Moldova', code: 'MD' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL', aliases: ['holland'] },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'North Macedonia', code: 'MK' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Panama', code: 'PA' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russia', code: 'RU' },
  { name: 'Saudi Arabia', code: 'SA', aliases: ['ksa'] },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia', code: 'RS' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Korea', code: 'KR', aliases: ['korea'] },
  { name: 'Spain', code: 'ES', aliases: ['espana'] },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH', aliases: ['schweiz'] },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Tanzania', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR', aliases: ['turkiye'] },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE', aliases: ['uae', 'dubai'] },
  { name: 'United Kingdom', code: 'GB', aliases: ['uk', 'britain', 'england'] },
  { name: 'United States', code: 'US', aliases: ['usa', 'us', 'america'] },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
];

const FEATURED_COUNTRY_CODES = ['IN', 'US', 'DE', 'GB', 'AE', 'SG', 'JP', 'AU'];

export function searchCountries(query: string, limit = 10): CountryEntry[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    const featured = FEATURED_COUNTRY_CODES.map((code) =>
      COUNTRIES.find((c) => c.code === code)
    ).filter((c): c is CountryEntry => Boolean(c));
    return featured.slice(0, limit);
  }

  const scored = COUNTRIES.map((country) => {
    const nameLower = country.name.toLowerCase();
    const codeLower = country.code.toLowerCase();
    const aliases = country.aliases ?? [];

    let score = 0;
    if (nameLower === trimmed || codeLower === trimmed || aliases.includes(trimmed)) {
      score = 120;
    } else if (nameLower.startsWith(trimmed)) {
      score = 90;
    } else if (aliases.some((a) => a.startsWith(trimmed))) {
      score = 75;
    } else if (nameLower.split(/\s+/).some((word) => word.startsWith(trimmed))) {
      score = 60;
    } else if (nameLower.includes(trimmed)) {
      score = 40;
    }

    return { country, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.country.name.localeCompare(b.country.name));

  return scored.slice(0, limit).map((entry) => entry.country);
}

export function composeQuoteSubmissionNotes(params: {
  notes: string;
  country: string;
  quantity: number;
}): string {
  const sections: string[] = [];
  const trimmedNotes = params.notes.trim();
  if (trimmedNotes) {
    sections.push(trimmedNotes);
  }
  const metaLines: string[] = [];
  if (params.country.trim()) {
    metaLines.push(`Country / Delivery Region: ${params.country.trim()}`);
  }
  if (params.quantity > 0) {
    metaLines.push(`Selected Order Quantity: ${params.quantity.toLocaleString()} pcs`);
  }
  if (metaLines.length > 0) {
    sections.push(metaLines.join('\n'));
  }
  return sections.join('\n\n');
}
