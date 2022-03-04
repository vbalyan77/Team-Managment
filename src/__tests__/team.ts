import app from '../app';
import supertest from 'supertest';

const appTest = supertest(app);

describe('Create a new team', () => {
  it('POST new team', async () => {
    const email = `test${new Date().getTime()}@test.com`;
    await appTest
      .post('/auth/register')
      .send({ email, password: 'veryTestPassword' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const res2 = await appTest
      .post('/auth/login')
      .send({ email, password: 'veryTestPassword' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const { token } = res2.body;
    const res3 = await appTest
      .post('/team/')
      .send({
        title: 'Test',
      })
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res3.status).toEqual(201);
  });
});

describe('Deletes a team', () => {
  it('DELETE new team', async () => {
    const email = `test${new Date().getTime()}@test.com`;
    await appTest
      .post('/auth/register')
      .send({ email, password: 'veryTestPassword' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const res2 = await appTest
      .post('/auth/login')
      .send({ email, password: 'veryTestPassword' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const { token } = res2.body;
    const res3 = await appTest
      .post('/team/')
      .send({
        title: 'Test',
      })
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const teamId = res3.body.data._id;
    const res4 = await appTest
      .delete('/team/')
      .send({
        teamId,
      })
      .set('Authorization', `Bearer ${token}`)
      .set('Team_id', teamId)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res4.status).toEqual(200);
  });
});

describe('Create a new team with incorrect token', () => {
  it('POST new team', async () => {
    const res = await appTest
      .post('/team/')
      .send({
        title: 'Test',
      })
      .set('Authorization', `Bearer dsadsa`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(403);
  });
});
