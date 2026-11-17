import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATALOG_SEARCH_INDEX,
  QUANTITY_PRESETS,
  composeQuoteSubmissionNotes,
  isPresetQuantity,
  searchCatalogProducts,
  searchCountries,
  splitHighlightParts,
} from './quoteAutocomplete';

test('catalog index derives exclusively from real TermiCore SKUs and accessories', () => {
  assert.ok(CATALOG_SEARCH_INDEX.length >= 50);
  const tsc25 = CATALOG_SEARCH_INDEX.find((item) => item.model === 'TSC 2.5');
  assert.ok(tsc25);
  assert.equal(tsc25.name, 'TSC 2.5 Feed-Through Block');
  assert.match(tsc25.category, /Spring Cage Connection/);

  const endPlates = CATALOG_SEARCH_INDEX.find((item) => item.name === 'End Plates');
  assert.ok(endPlates);
  assert.equal(endPlates.model, 'EP Series');
});

test('searchCatalogProducts ranks exact and prefix model/category/name matches accurately', () => {
  const tscResults = searchCatalogProducts('TSC 4');
  assert.equal(tscResults[0].model, 'TSC 4');

  const boltResults = searchCatalogProducts('Bolt Connection');
  assert.ok(boltResults.length > 0);
  assert.ok(boltResults.every((item) => item.category.includes('Bolt Connection')));

  const accessoryResults = searchCatalogProducts('Jumper');
  assert.ok(accessoryResults.some((item) => item.name === 'Insulated Cross Jumpers'));

  const pcbBlockResults = searchCatalogProducts('TPC 5.08-SC');
  assert.equal(pcbBlockResults[0].model, 'TPC 5.08-SC');
  assert.match(pcbBlockResults[0].category, /PCB Terminal Blocks/);

  const pcbLeverResults = searchCatalogProducts('TPS 2.5-LV');
  assert.equal(pcbLeverResults[0].model, 'TPS 2.5-LV');

  const pcbHighCurrentResults = searchCatalogProducts('TPH 10.16-HC');
  assert.equal(pcbHighCurrentResults[0].model, 'TPH 10.16-HC');

  const pcbConnResults = searchCatalogProducts('TPL 5.08-FL');
  assert.equal(pcbConnResults[0].model, 'TPL 5.08-FL');
  assert.match(pcbConnResults[0].category, /PCB Connectors/);

  const noMatch = searchCatalogProducts('xyznonexistent999');
  assert.equal(noMatch.length, 0);
});

test('searchCountries supports prefix, substring, and alias matching', () => {
  const indiaMatches = searchCountries('ind');
  assert.equal(indiaMatches[0].name, 'India');
  assert.ok(indiaMatches.some((c) => c.name === 'Indonesia'));

  const usaMatches = searchCountries('usa');
  assert.equal(usaMatches[0].name, 'United States');

  const ukMatches = searchCountries('uk');
  assert.equal(ukMatches[0].name, 'United Kingdom');
});

test('splitHighlightParts marks matching segments case-insensitively', () => {
  const parts = splitHighlightParts('TSC 2.5 Feed-Through Block', 'tsc');
  assert.deepEqual(parts, [
    { text: 'TSC', match: true },
    { text: ' 2.5 Feed-Through Block', match: false },
  ]);

  const specialChars = splitHighlightParts('TSC-R 4 Universal Screw Block', 'tsc-r');
  assert.equal(specialChars[0].match, true);
  assert.equal(specialChars[0].text, 'TSC-R');
});

test('quantity presets expose expected tiers and custom detection', () => {
  assert.deepEqual([...QUANTITY_PRESETS], [50, 100, 500, 1000, 5000]);
  assert.equal(isPresetQuantity(500), true);
  assert.equal(isPresetQuantity(750), false);
});

test('composeQuoteSubmissionNotes includes description, country, and selected quantity', () => {
  const result = composeQuoteSubmissionNotes({
    notes: 'I need a quotation for bulk terminal blocks.',
    country: 'Germany',
    quantity: 1000,
  });
  assert.match(result, /I need a quotation for bulk terminal blocks\./);
  assert.match(result, /Country \/ Delivery Region: Germany/);
  assert.match(result, /Selected Order Quantity: 1,000 pcs/);
});
