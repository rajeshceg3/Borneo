const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
  it('should return 200 and API name', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Borneo Rainforest API');
  });
});

describe('Data endpoints', () => {
  it('returns attractions data', async () => {
    const res = await request(app).get('/attractions');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('coordinates');
  });

  it('returns wildlife data', async () => {
    const res = await request(app).get('/wildlife');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('species');
  });

  it('returns trails data', async () => {
    const res = await request(app).get('/trails');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('stops');
  });

  it('returns offline pack data bundle', async () => {
    const res = await request(app).get('/offline-pack');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('generatedAt');
    expect(Array.isArray(res.body.data.attractions)).toBe(true);
    expect(Array.isArray(res.body.data.wildlife)).toBe(true);
    expect(Array.isArray(res.body.data.trails)).toBe(true);
  });
});
