const request = require('supertest');
const app = require('./app');

describe('GET /metrics', () => {
  it('should return Prometheus metrics', async () => {
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.text).toContain('process_cpu_seconds_total');
  });
});
