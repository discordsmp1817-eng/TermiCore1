import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCESSORIES,
  PRODUCT_CATEGORIES,
  PRODUCT_NAV_GROUPS,
} from '../data/termicoreData';
import { searchCatalogProducts } from './quoteAutocomplete';

test('PRODUCT_NAV_GROUPS defines all 3 TermiCore product families with original labels and valid images', () => {
  assert.equal(PRODUCT_NAV_GROUPS.length, 3);
  assert.deepEqual(
    PRODUCT_NAV_GROUPS.map((g) => g.title),
    ['PCB Terminal Blocks', 'DIN Rail Terminal Blocks', 'Barrier Terminal Blocks']
  );

  for (const group of PRODUCT_NAV_GROUPS) {
    assert.ok(group.image.endsWith('.jpg'));
    assert.ok(!group.image.includes('nav_'));
    assert.ok(group.seriesBadge.length > 0);
    assert.ok(group.summary.length > 0);
    assert.ok(group.items.length >= 5);
  }

  const dinGroup = PRODUCT_NAV_GROUPS.find((g) => g.id === 'din-rail');
  assert.ok(dinGroup);
  assert.deepEqual(
    dinGroup.items.map((i) => i.label),
    [
      'Spring Cage Connection',
      'Screw Clamp Connection',
      'Spring Support Connection',
      'Bolt Connection',
      '1-Nut Distribution',
    ]
  );
});

test('Barrier Terminal Blocks category includes all 6 TermiCore structural variants and searchable SKUs', () => {
  const barrierCat = PRODUCT_CATEGORIES.find((c) => c.id === 'barrier-terminal-blocks');
  assert.ok(barrierCat);
  assert.equal(barrierCat.slug, '/barrier-terminal-blocks');

  const types = new Set(barrierCat.skus.map((s) => s.connectionType));
  for (const requiredType of [
    'Single-Tier',
    'Dual-Tier',
    'Pluggable',
    'Through-Wall',
    'Chassis Flange',
    'High-Current Lug',
  ]) {
    assert.ok(types.has(requiredType), `Missing Barrier SKU type: ${requiredType}`);
  }

  const results = searchCatalogProducts('TBB 9.5-SR');
  assert.equal(results[0].model, 'TBB 9.5-SR');
});

test('All navigation sub-item filter hints match existing SKU connectionTypes or accessory categories', () => {
  for (const group of PRODUCT_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.filter?.typeFilter && item.filter.typeFilter !== 'All') {
        const cat = PRODUCT_CATEGORIES.find((c) => c.slug === item.route);
        assert.ok(cat, `Category route missing for ${item.label}`);
        const hasMatchingType = cat.skus.some(
          (s) => s.connectionType === item.filter?.typeFilter
        );
        assert.ok(
          hasMatchingType,
          `Filter ${item.filter.typeFilter} not found in ${cat.slug}`
        );
      }
      if (item.filter?.accessoryCategory) {
        const hasCat = ACCESSORIES.some(
          (a) => a.category === item.filter?.accessoryCategory
        );
        assert.ok(hasCat, `Accessory category missing: ${item.filter.accessoryCategory}`);
      }
    }
  }
});
