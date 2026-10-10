import assert from 'node:assert/strict';
import test from 'node:test';
import { applyLocationPrecision, buildSosMessage } from '../src/utils/sosMessage';

test('precise locations stay unchanged', () => {
  const point = applyLocationPrecision(6.927079, 79.861244, true);
  assert.equal(point.latitude, 6.927079);
  assert.equal(point.longitude, 79.861244);
});

test('approximate locations round to two decimal places', () => {
  const point = applyLocationPrecision(6.927079, 79.861244, false);
  assert.equal(point.latitude, 6.93);
  assert.equal(point.longitude, 79.86);
});

test('SOS message includes a map link and a live link', () => {
  const message = buildSosMessage({
    name: 'Asha',
    latitude: 6.93,
    longitude: 79.86,
    liveUrl: 'http://localhost:4000/track/abc',
  });

  assert.match(message, /Asha/);
  assert.match(message, /https:\/\/maps\.google\.com\/\?q=6\.93,79\.86/);
  assert.match(message, /http:\/\/localhost:4000\/track\/abc/);
});
