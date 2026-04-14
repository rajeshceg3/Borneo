const request = require('supertest');
const app = require('./app');

describe('Borneo API', () => {
  it('GET / should return API status message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Borneo API is running');
  });

  it('GET /attractions should return attraction data', async () => {
    const res = await request(app).get('/attractions');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /wildlife should return wildlife data', async () => {
    const res = await request(app).get('/wildlife');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('species');
  });

  it('GET /trails should return trails data', async () => {
    const res = await request(app).get('/trails');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('stops');
  });

  it('GET /offline-pack should return combined payload', async () => {
    const res = await request(app).get('/offline-pack');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('generatedAt');
    expect(res.body.data.includes).toHaveProperty('attractions');
    expect(res.body.data.includes).toHaveProperty('wildlife');
    expect(res.body.data.includes).toHaveProperty('trails');
  });

  it('GET /offline-pack/download should return a zip file', async () => {
    const res = await request(app).get('/offline-pack/download');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toBe('application/zip');
    expect(res.headers['content-disposition']).toContain('attachment; filename=borneo-offline-pack.zip');
  });

  it('GET /metrics should return prometheus metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('http_requests_total');
  });
});
