import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldFallbackToStaticRelay } from './inquiryTransport.ts';

test('shouldFallbackToStaticRelay triggers for HTML SPA rewrites, plain text, or missing content-type on static hosts', () => {
  assert.equal(shouldFallbackToStaticRelay('text/html; charset=UTF-8'), true);
  assert.equal(shouldFallbackToStaticRelay('text/plain'), true);
  assert.equal(shouldFallbackToStaticRelay(''), true);
  assert.equal(shouldFallbackToStaticRelay(null), true);
  assert.equal(shouldFallbackToStaticRelay(undefined), true);
});

test('shouldFallbackToStaticRelay does NOT trigger when Express backend responds with application/json', () => {
  assert.equal(shouldFallbackToStaticRelay('application/json; charset=utf-8'), false);
  assert.equal(shouldFallbackToStaticRelay('APPLICATION/JSON'), false);
});
