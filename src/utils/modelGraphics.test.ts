import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_CATEGORIES } from '../data/termicoreData';
import {
  buildModelCadSvgMarkup,
  buildModelCircuitSvgMarkup,
  getCadGeometrySpec,
  getCircuitVariant,
} from './modelGraphics';

test('getCircuitVariant identifies PE ground, disconnect, double-level, and splitter models', () => {
  const spring = PRODUCT_CATEGORIES.find((c) => c.id === 'spring-cage');
  assert.ok(spring);

  const peSku = spring.skus.find((s) => s.model === 'TSC 4-PE');
  const doubleSku = spring.skus.find((s) => s.model === 'TSC 2.5-D');
  const baseSku = spring.skus.find((s) => s.model === 'TSC 2.5');
  assert.ok(peSku && doubleSku && baseSku);

  assert.equal(getCircuitVariant(peSku, spring), 'earth');
  assert.equal(getCircuitVariant(doubleSku, spring), 'double');
  assert.equal(getCircuitVariant(baseSku, spring), 'single');

  const nutCat = PRODUCT_CATEGORIES.find((c) => c.id === 'nut-connection');
  assert.ok(nutCat);
  assert.equal(getCircuitVariant(nutCat.skus[0], nutCat), 'splitter');
});

test('CAD and circuit SVG generators output valid dimensional markup for every category', () => {
  for (const cat of PRODUCT_CATEGORIES) {
    const sku = cat.skus[0];
    const geo = getCadGeometrySpec(sku, cat);
    const cadSvg = buildModelCadSvgMarkup(sku, cat);
    const circuitSvg = buildModelCircuitSvgMarkup(sku, cat);

    assert.ok(cadSvg.includes('<svg'), `Missing CAD <svg> root for ${sku.model}`);
    assert.ok(cadSvg.includes(`(${geo.lengthMm})`), `Missing CAD length label for ${sku.model}`);
    assert.ok(cadSvg.includes(String(geo.heightMm)), `Missing CAD height label for ${sku.model}`);
    assert.ok(circuitSvg.includes('<svg'), `Missing Circuit <svg> root for ${sku.model}`);
    assert.ok(circuitSvg.includes(sku.model), `Missing SKU label in circuit SVG for ${sku.model}`);
  }
});
