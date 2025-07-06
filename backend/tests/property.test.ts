import request from 'supertest';
import app from '../src/server';

describe('Property API', () => {
  it('should return properties array', async () => {
    const res = await request(app).get('/api/properties');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});