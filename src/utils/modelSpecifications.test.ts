import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_CATEGORIES } from '../data/termicoreData';
import {
  buildModelSpecificationSections,
  DEFAULT_ACCESSORIES_PAGE_SIZE,
  filterCatalogAccessories,
  findModelByRoute,
  getAccessoriesForModel,
  getAllCatalogAccessories,
  getCompatibleAccessories,
  getModelDrawingDimensions,
  getModelRoute,
  getPaginationRange,
  paginateItems,
} from './modelSpecifications';

test('every catalog SKU maps uniquely 1-to-1 to a /model/:slug route', () => {
  const seenRoutes = new Set<string>();
  for (const cat of PRODUCT_CATEGORIES) {
    for (const sku of cat.skus) {
      const route = getModelRoute(sku.model);
      assert.ok(route.startsWith('/model/'), `Expected /model/ route for ${sku.model}`);
      assert.equal(seenRoutes.has(route), false, `Duplicate route slug detected: ${route}`);
      seenRoutes.add(route);

      const resolved = findModelByRoute(route);
      assert.ok(resolved, `Route ${route} failed to resolve`);
      assert.equal(resolved.sku.model, sku.model);
      assert.equal(resolved.category.id, cat.id);
    }
  }
});

test('findModelByRoute returns null for unknown or non-model routes', () => {
  assert.equal(findModelByRoute('/products'), null);
  assert.equal(findModelByRoute('/model/nonexistent-part-999'), null);
});

test('buildModelSpecificationSections builds all 6 engineering specification sections cleanly', () => {
  const pcb = PRODUCT_CATEGORIES.find((c) => c.id === 'pcb-terminal-blocks');
  assert.ok(pcb);
  const thrSku = pcb.skus.find((s) => s.model === 'TPC 5.08-THR');
  assert.ok(thrSku);

  const sections = buildModelSpecificationSections(thrSku, pcb);
  assert.equal(sections.length, 6);
  assert.equal(sections[0].id, 'general-info');
  assert.ok(sections[0].rows.some((r) => r.value === 'TPC 5.08-THR'));
  // High-temp LCP material accurately reflected for THR reflow models
  const material = sections.find((s) => s.id === 'material-info');
  assert.ok(material?.rows.some((r) => r.value.includes('LCP')));
  assert.ok(sections.some((s) => s.id === 'mechanical-info'));

  const dims = getModelDrawingDimensions(thrSku, pcb);
  assert.equal(dims.widthMm, 5.08);
  assert.equal(dims.isPcbOrBarrier, true);
});

test('getCompatibleAccessories maps cable lugs for high-current bolt terminals and jumpers for DIN rails', () => {
  const boltAcc = getCompatibleAccessories('bolt-connection');
  assert.ok(boltAcc.some((a) => a.id === 'lug-series'));

  const springAcc = getCompatibleAccessories('spring-cage');
  assert.ok(springAcc.some((a) => a.id === 'jumper-series'));
  assert.ok(springAcc.some((a) => a.id === 'ep-series'));
});

test('getAccessoriesForModel tailors required accessories specifically per SKU model', () => {
  const spring = PRODUCT_CATEGORIES.find((c) => c.id === 'spring-cage');
  assert.ok(spring);
  const tsc25 = spring.skus.find((s) => s.model === 'TSC 2.5');
  const tsc4Pe = spring.skus.find((s) => s.model === 'TSC 4-PE');
  assert.ok(tsc25 && tsc4Pe);

  const tsc25Acc = getAccessoriesForModel(tsc25, spring);
  assert.equal(tsc25Acc.length, 6);
  assert.ok(tsc25Acc.some((a) => a.partNumber === 'EP-TSC-2.5' && a.necessity === 'Essential'));
  assert.ok(tsc25Acc.some((a) => a.partNumber === 'CJ-5.2-10P'));

  const peAcc = getAccessoriesForModel(tsc4Pe, spring);
  assert.ok(!peAcc.some((a) => a.partNumber.startsWith('CJ-')), 'PE ground block should not include potential cross jumpers');

  const pcbConn = PRODUCT_CATEGORIES.find((c) => c.id === 'pcb-connectors');
  assert.ok(pcbConn);
  const plugAcc = getAccessoriesForModel(pcbConn.skus[0], pcbConn);
  assert.ok(plugAcc.some((a) => a.category === 'Mating Interface' && a.necessity === 'Essential'));
});

test('getAllCatalogAccessories aggregates unique accessories from every catalog product and supports filtering', () => {
  const all = getAllCatalogAccessories();
  assert.ok(all.length >= 60, `Expected full SKU accessory catalog, got ${all.length}`);

  const epTsc25 = all.find((a) => a.partNumber === 'EP-TSC-2.5');
  assert.ok(epTsc25);
  assert.equal(epTsc25.compatibleModels[0].model, 'TSC 2.5');
  assert.equal(epTsc25.compatibleModels[0].route, '/model/tsc-2.5');

  // Shared accessories aggregate multiple compatible models
  const ts35 = all.find((a) => a.partNumber === 'TS35-7.5-1000');
  assert.ok(ts35 && ts35.compatibleModels.length > 5);

  // Covers barrier, PCB mating interfaces, and bolt lugs
  assert.ok(all.some((a) => a.partNumber.startsWith('SC-TBB-')));
  assert.ok(all.some((a) => a.category === 'Mating Interface'));
  assert.ok(all.some((a) => a.partNumber.startsWith('TCL-M')));

  const filteredByModel = filterCatalogAccessories(all, {
    category: 'All',
    seriesId: 'All',
    searchQuery: 'TSC 2.5',
  });
  assert.ok(filteredByModel.some((a) => a.partNumber === 'EP-TSC-2.5'));
  assert.ok(filteredByModel.some((a) => a.partNumber === 'CJ-5.2-10P'));

  const filteredBySeries = filterCatalogAccessories(all, {
    category: 'Mating Interface',
    seriesId: 'pcb-connectors',
    searchQuery: '',
  });
  assert.ok(filteredBySeries.length >= 1);
  assert.ok(filteredBySeries.every((a) => a.category === 'Mating Interface'));

  const essentialOnly = filterCatalogAccessories(all, {
    category: 'All',
    seriesId: 'All',
    necessity: 'Essential',
    searchQuery: '',
  });
  assert.ok(essentialOnly.length > 0 && essentialOnly.length < all.length);
  assert.ok(essentialOnly.every((a) => a.necessity === 'Essential'));
});

test('paginateItems splits catalog accessories into equal 18-item pages and clamps bounds cleanly', () => {
  const all = getAllCatalogAccessories();
  assert.equal(DEFAULT_ACCESSORIES_PAGE_SIZE, 18);

  const page1 = paginateItems(all, 1, DEFAULT_ACCESSORIES_PAGE_SIZE);
  assert.equal(page1.items.length, 18);
  assert.equal(page1.currentPage, 1);
  assert.equal(page1.startIndex, 1);
  assert.equal(page1.endIndex, 18);
  assert.equal(page1.totalPages, Math.ceil(all.length / 18));

  const page1Images = new Set(page1.items.map((item) => item.image));
  const page1Categories = new Set(page1.items.map((item) => item.category));
  assert.ok(page1Images.size >= 8, `Expected at least 8 distinct accessory images on Page 1, got ${page1Images.size}`);
  assert.ok(page1Categories.size >= 6, `Expected at least 6 accessory categories on Page 1, got ${page1Categories.size}`);
  assert.notEqual(page1.items[0].image, page1.items[1].image);

  const page2 = paginateItems(all, 2, DEFAULT_ACCESSORIES_PAGE_SIZE);
  assert.equal(page2.items.length, 18);
  assert.equal(page2.startIndex, 19);
  assert.equal(page2.endIndex, 36);
  assert.notEqual(page2.items[0].partNumber, page1.items[0].partNumber);

  const outOfRange = paginateItems(all, 999, DEFAULT_ACCESSORIES_PAGE_SIZE);
  assert.equal(outOfRange.currentPage, page1.totalPages);
  assert.equal(outOfRange.endIndex, all.length);

  const empty = paginateItems([], 3, 18);
  assert.equal(empty.items.length, 0);
  assert.equal(empty.totalPages, 1);
  assert.equal(empty.startIndex, 0);
});

test('getPaginationRange computes clean compact page numbers and ellipsis tokens', () => {
  assert.deepEqual(getPaginationRange(1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(getPaginationRange(1, 10), [1, 2, 'ellipsis', 10]);
  assert.deepEqual(getPaginationRange(5, 10), [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  assert.deepEqual(getPaginationRange(10, 10), [1, 'ellipsis', 9, 10]);
});
