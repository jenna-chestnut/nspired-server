/* eslint-disable no-undef */
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const jwt = require('jsonwebtoken');
const Fixtures = require("./nSpired.fixtures");

describe('POST api/auth/login Endpoint', function() {
  let db;

  const {
    testUsers,
    testGoals,
    testUpVotes,
    testAdvice
  } = Fixtures.makeNSpiredFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => Fixtures.cleanTables(db));

  beforeEach('insert things', () =>
    Fixtures.seedNSpiredTables(
      db,
      testUsers,
      testGoals,
      testUpVotes,
      testAdvice
    )
  );

  afterEach('cleanup', () => Fixtures.cleanTables(db));

  const requiredFields = ['user_name', 'password'];

  requiredFields.forEach(field => {
    const loginAttemptBody = {
      user_name: testUsers[0].user_name,
      password: testUsers[0].password
    };

    it(`responds with 400 required error when ${field} is missing`, () => {
      delete loginAttemptBody[field];

      return supertest(app)
        .post('/api/auth/login')
        .send(loginAttemptBody)
        .expect(400, {
          error: `Missing '${field}' in request body`
        });
    });

    it(`responds with 400 'Invalid user_name or password' when bad ${field}`, () => {
      loginAttemptBody[field] = `invalid-${field}`;

      return supertest(app)
        .post('/api/auth/login')
        .send(loginAttemptBody)
        .expect(400, {
          error: 'Invalid user_name or password'
        });
    });
  });


  it('responds 200 and JWT auth token using secret when valid credentials', () => {
    const validUserCreds = {
      user_name: testUsers[0].user_name,
      password: testUsers[0].password
    };

    const expectedToken = jwt.sign(
      { user_id: testUsers[0].id }, //payload
      process.env.JWT_SECRET,
      {
        subject: testUsers[0].user_name,
        algorithm: 'HS256'
      }
    );

    return supertest(app)
      .post('/api/auth/login')
      .send(validUserCreds)
      .expect(200, {
        authToken: expectedToken
      });
  });
});
