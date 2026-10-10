import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { app } from '../src/app';

test('GET /health returns ok', async () => {
  const response = await request(app).get('/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
  assert.equal(response.body.service, 'safelink-api');
});

test('GET /api/emergency/services returns a directory', async () => {
  const response = await request(app).get('/api/emergency/services');
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.data.services));
  assert.ok(response.body.data.services.length > 0);
});

test('protected routes reject missing tokens', async () => {
  const response = await request(app).get('/api/contacts');
  assert.equal(response.status, 401);
});
