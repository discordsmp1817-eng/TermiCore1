import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_CATEGORIES } from '../data/termicoreData';
import {
  filterCategorySkus,
  getCategoryFilterOptions,
} from './categoryFilters';

test('getCategoryFilterOptions extracts sorted wire ranges and voltages for PCB terminal blocks', () => {
  const pcb = PRODUCT_CATEGORIES.find((c) => c.id === 'pcb-terminal-blocks');
  assert.ok(pcb, 'pcb-terminal-blocks category exists');

  const options = getCategoryFilterOptions(pcb.skus);
  assert.deepEqual(options.voltages, ['160 V', '320 V', '400 V', '630 V', '800 V', '1000 V']);
  assert.equal(options.wireRanges[0], '0.14 - 0.5 mm²');
  assert.equal(options.wireRanges[options.wireRanges.length - 1], '10 - 95 mm²');
  assert.ok(options.connectionTypes.includes('Push-In Spring'));
  assert.ok(options.connectionTypes.includes('Transformer Terminal'));
});

test('getCategoryFilterOptions puts PCB header pin specs after conductor cross sections', () => {
  const connectors = PRODUCT_CATEGORIES.find((c) => c.id === 'pcb-connectors');
  assert.ok(connectors, 'pcb-connectors category exists');

  const options = getCategoryFilterOptions(connectors.skus);
  assert.equal(options.wireRanges[0], '0.14 - 1.5 mm²');
  assert.ok(options.wireRanges.slice(-2).every((v) => v.startsWith('Header Pin')));
});

test('filterCategorySkus combines category, conductor cross section, and voltage filters', () => {
  const pcb = PRODUCT_CATEGORIES.find((c) => c.id === 'pcb-terminal-blocks');
  assert.ok(pcb);

  const byCategory = filterCategorySkus(pcb.skus, {
    typeFilter: 'Push-In Spring',
    wireRangeFilter: 'All',
    voltageFilter: 'All',
    isPcbCategory: true,
  });
  assert.ok(byCategory.length > 0);
  assert.ok(byCategory.every((s) => s.connectionType === 'Push-In Spring'));

  const byWireAndVoltage = filterCategorySkus(pcb.skus, {
    typeFilter: 'All',
    wireRangeFilter: '0.2 - 2.5 mm²',
    voltageFilter: '320 V',
    isPcbCategory: true,
  });
  assert.ok(byWireAndVoltage.length > 0);
  assert.ok(
    byWireAndVoltage.every(
      (s) => s.wireRangeIec === '0.2 - 2.5 mm²' && s.voltageRating === '320 V'
    )
  );
});

test('filterCategorySkus preserves mega-menu processFilter for THR tape-on-reel models', () => {
  const pcb = PRODUCT_CATEGORIES.find((c) => c.id === 'pcb-terminal-blocks');
  assert.ok(pcb);

  const thrModels = filterCategorySkus(pcb.skus, {
    typeFilter: 'All',
    wireRangeFilter: 'All',
    voltageFilter: 'All',
    processFilter: 'thr',
    isPcbCategory: true,
  });
  assert.deepEqual(
    thrModels.map((m) => m.model),
    ['TPC 5.08-THR', 'TPC 3.5-TR']
  );
});
