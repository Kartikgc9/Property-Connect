import request from 'supertest';
import app from '../src/server';

describe('Auth API', () => {
  const email = `test${Date.now()}@example.com`;
  const password = 'Passw0rd!';

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password,
        firstName: 'Test',
        lastName: 'User',
        role: 'BUYER',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe(email);
  });

  it('should login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});