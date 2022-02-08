const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const fakeUser = {
  email: 'broken@arrow.com',
  password: 'Nucflash'
};

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should add a new user', async () => {
    const response = await request(app).post('/api/v1/users').send(fakeUser);
    expect(response.body).toEqual({
      id: expect.any(String),
      email: 'broken@arrow.com',
    });
  });

  it('should allow user to log in', async () => {
    await request(app).post('/api/v1/users').send(fakeUser);
    const response = await request(app).post('/api/v1/users/sessions').send(fakeUser);
    expect(response.body).toEqual({
      message: 'signed in successful'
    });
  });

});
