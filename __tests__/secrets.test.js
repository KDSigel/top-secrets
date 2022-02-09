const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const fakeSecret = {
  title: 'title',
  description: 'description',
};

const fakeUser = {
  email: 'broken@arrow.com',
  password: 'Nucflash',
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

  it('logged in user should be able to post a secret', async () => {
    const [agent] = await registerAndLogin();

    const response = await agent.post('/api/v1/secrets').send(fakeSecret);
    expect(response.body).toEqual({
      id: expect.any(String),
      title: 'title',
      description: 'description',
      createdAt: expect.any(String),
    });
  });

  it('logged in user can view all the secrets', async () => {
    const [agent] = await registerAndLogin();
    const response = await agent.get('/api/v1/secrets').send(fakeSecret);
    expect(response.body).toContainEqual([
      {
        id: expect.any(String),
        title: 'title',
        description: 'description',
        createdAt: expect.any(String),
      },
    ]);
  });
});
