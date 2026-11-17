import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DESCRIPTION_ASSISTANCE_CHIPS,
  applyNoteSuggestion,
  getQuoteNoteSuggestions,
  insertDescriptionChip,
} from './noteSuggestions';

test('returns multiple starter suggestions including I have and I had when notes are empty', () => {
  const suggestions = getQuoteNoteSuggestions('', []);
  assert.ok(suggestions.length >= 4);
  assert.ok(suggestions.some((s) => s.text.startsWith('I have to')));
  assert.ok(suggestions.some((s) => s.text.startsWith('I had')));
});

test('prioritizes queued BOM suggestion when items are in RFQ queue', () => {
  const suggestions = getQuoteNoteSuggestions('', [{ model: 'TSC 4', quantity: 250 }]);
  assert.equal(suggestions[0].id, 'queued-bom');
  assert.match(suggestions[0].text, /TSC 4 \(250 pcs\)/);
});

test('adapts suggestions according to typed prefix like "i had"', () => {
  const suggestions = getQuoteNoteSuggestions('i had', []);
  assert.ok(suggestions.length >= 3);
  assert.ok(suggestions[0].text.toLowerCase().startsWith('i had'));
  assert.ok(suggestions.slice(0, 3).every((s) => s.text.toLowerCase().includes('i had')));
});

test('adapts suggestions according to typed topic like "cad"', () => {
  const suggestions = getQuoteNoteSuggestions('cad', []);
  assert.ok(suggestions[0].text.includes('CAD'));
});

test('offers follow-up append snippets once user has written a full sentence', () => {
  const longText =
    'I have to order DIN-rail terminal blocks for a control cabinet project with 4 mm2 wiring.';
  const suggestions = getQuoteNoteSuggestions(longText, []);
  assert.ok(suggestions.length >= 2);
  assert.equal(suggestions[0].mode, 'append');
});

test('applyNoteSuggestion replaces short partial prefix and appends after full sentence', () => {
  const starter = getQuoteNoteSuggestions('i have', [])[0];
  assert.equal(applyNoteSuggestion('i have', starter), starter.text);

  const followUp = {
    id: 'append-certs',
    label: '+ Certs',
    text: 'Required certifications: UL 1059.',
    mode: 'append' as const,
    keywords: [],
  };
  const combined = applyNoteSuggestion('Need 200 pcs of TSC 4.', followUp);
  assert.equal(combined, 'Need 200 pcs of TSC 4.\nRequired certifications: UL 1059.');
});

test('DESCRIPTION_ASSISTANCE_CHIPS includes all four required phrases and inserts without deleting existing text', () => {
  assert.deepEqual([...DESCRIPTION_ASSISTANCE_CHIPS], [
    'I need a quotation for bulk terminal blocks.',
    'I am interested in custom terminal block solutions.',
    'I require product samples for testing.',
    'Please provide pricing for DIN rail accessories.',
  ]);

  assert.equal(
    insertDescriptionChip('', DESCRIPTION_ASSISTANCE_CHIPS[0]),
    'I need a quotation for bulk terminal blocks.'
  );
  assert.equal(
    insertDescriptionChip('Existing panel specs:', DESCRIPTION_ASSISTANCE_CHIPS[2]),
    'Existing panel specs:\nI require product samples for testing.'
  );
});
