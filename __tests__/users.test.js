const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const fakeUser = {
  email: 'broken@arrow.com',
  password: 'Nucflash'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? fakeUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...fakeUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
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
      message: 'you signed in, great job!'
    });
  });

  it('should sign out a user', async () => {
    const [agent, user] = await registerAndLogin();
    await agent.delete('/api/v1/users/sessions');
    expect(user).toEqual(null);
  });

});
