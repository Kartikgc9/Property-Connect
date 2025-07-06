import request from 'supertest';
import app from '../src/server';

// helper to register & login agent
async function getAgentToken() {
  const email = `agent${Date.now()}@example.com`;
  const password = 'StrongP@ssw0rd';
  // register
  await request(app).post('/api/auth/register').send({
    email,
    password,
    firstName: 'Agent',
    lastName: 'Tester',
    role: 'AGENT'
  });
  // login
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.data.token as string;
}

describe('Property CRUD', () => {
  let token: string;
  let propertyId: string;

  beforeAll(async () => {
    token = await getAgentToken();
  });

  it('should create property', async () => {
    const payload = {
      title: 'Test Property',
      description: 'Nice place',
      type: 'HOUSE',
      price: 500000,
      area: 2000,
      address: '123 Main St',
      city: 'Testville',
      state: 'TS',
      zipCode: '12345',
      coordinates: { lat: 37.77, lng: -122.42 }
    };
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    expect(res.status).toBe(201);
    propertyId = res.body.data.id;
  });

  it('should update property', async () => {
    const res = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 550000 });
    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(550000);
  });

  it('should list properties', async () => {
    const res = await request(app).get('/api/properties');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should delete property', async () => {
    const res = await request(app)
      .delete(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});