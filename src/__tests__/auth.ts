import app from '../app';
import supertest from 'supertest';

const appTest = supertest(app);

describe('Register with unique email', () => {
  it('POST register', async () => {
    const res = await appTest
      .post('/auth/register')
      .send({
        email: `test${new Date().getTime()}@test.com`,
        password: 'veryTestPassword',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(res.status).toEqual(201);
  });
});

describe('Register 2 times with same email', () => {
  it('POST register', async () => {
    const email = `test${new Date().getTime()}@test.com`;
    const res1 = await appTest
      .post('/auth/register')
      .send({ email, password: 'veryTestPassword' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const res2 = await appTest
      .post('/auth/register')
      .send({ email, password: 'veryTestPassword' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(res1.status).toEqual(201);
    expect(res2.status).toEqual(409);
  });
});

describe('Register with no data', () => {
  it('POST register', async () => {
    const res = await appTest
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(res.status).toEqual(406);
  });
});

describe('Login with incorrect credentials', () => {
  it('POST login', async () => {
    const res = await appTest
      .post('/auth/login')
      .send({
        email: `test${new Date().getTime()}@test.com`,
        password: 'veryTestPassword',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(res.status).toEqual(404);
  });
});

describe('Login with no data', () => {
  it('POST login', async () => {
    const res = await appTest.post('/auth/login');
    expect(res.status).toEqual(406);
  });
});

describe('Register and login correct credentials', () => {
  it('POST login', async () => {
    const email = `test${new Date().getTime()}@test.com`;
    const res1 = await appTest
      .post('/auth/register')
      .send({ email, password: 'veryTestPassword' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const res2 = await appTest
      .post('/auth/login')
      .send({ email, password: 'veryTestPassword' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(res1.status).toEqual(201);
    expect(res2.status).toEqual(200);
  });
});
