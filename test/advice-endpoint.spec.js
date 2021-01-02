/* eslint-disable no-useless-escape */
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const Fixtures = require("./nSpired.fixtures");

// this endpoint is to view advice attached to each public goal
// used for the personal goal page or public win page
// this is a protected endpoint and requires authorization

describe("Advice endpoints", () => {
  
  let db;

  const {
    testUsers,
    testGoals,
    testUpVotes,
    testAdvice, 
    testUserGoals
  } = Fixtures.makeNSpiredFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  before("clean the table", () => Fixtures.cleanTables(db));

  after("disconnect from db", () => db.destroy());

  afterEach("cleanup", () => Fixtures.cleanTables(db));

  describe("GET /advice/:goalId", () => {
    
    beforeEach("insert stuff", () => {
      return Fixtures.seedNSpiredTables(
        db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
      );
    });

    context(`Given an invalid goal id`, () => {
      it(`responds with 404 not found if invalid id`, () => {
        return supertest(app).get("/api/advice/0000")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(404,{
            error: {
              message: `Goal does not exist`
            }
          });
      });

      it(`responds with 400 error if goal Id is string`, () => {
        return supertest(app).get("/api/advice/test")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(400,{
            error: {
              message: `Goal id must be a number`
            }
          });
      });
    });

    context("Given a correct goal endpoint", () => {
      const goal = testGoals[0];
      const privateGoal = testGoals[3];
      const user = testUsers[(privateGoal.user_id) - 1];
      const badUser = testUsers[goal.user_id];

      it("responds with 200 and the advice array if goal is public", () => {
        return supertest(app).get(`/api/advice/${goal.id}`)
          .set('Authorization', Fixtures.makeAuthHeader(user))
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array');
          });
      });

      it("responds with 401 unauthorized if goal is private", () => {
        return supertest(app).get(`/api/advice/${privateGoal.id}`)
          .set('Authorization', Fixtures.makeAuthHeader(badUser))
          .expect(401, {
            error: {message: 'Unauthorized request'}
          });
      });
    });
  });

  describe("POST /advice/:goalId", () => {

    beforeEach("insert stuff", () => {
      return Fixtures.seedNSpiredTables(
        db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
      );
    });

    it('for a goal owned by the user and currently private, make goal public, add advice blurb, & returns 201 and the newly posted advice', () => {
      const randomUser = testUsers[0];
      const privateGoal = testGoals[3];
      const goalCreator = testUsers[3];
      const advice = Fixtures.makeAdvice();

      return supertest(app)
        .post(`/api/advice/${privateGoal.id}`)
        .set('Authorization', Fixtures.makeAuthHeader(goalCreator))
        .send(advice)
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id');
          expect(res.body.goal_id).to.eql(privateGoal.id);
          expect(res.body.user_id).to.eql(goalCreator.id);
          expect(res.body.advice_text).to.eql(advice.advice_text);
          return res.body;
        })
        .then(res => {
          const adviceId = res.id;
          const adviceText = res.advice_text;
          return supertest(app).get(`/api/advice/${privateGoal.id}`)
            .set('Authorization', Fixtures.makeAuthHeader(randomUser))
            .then(res => {
              expect(res.body).to.be.an('array');
              const newAdvice = res.body.find(el => el.id === adviceId);
              expect(newAdvice.advice_text).to.eql(adviceText);
            });
        });
    });

    it('for a public goal, endpoint adds advice blurb, & returns 201 and the newly posted advice', () => {
      const publicGoal = testGoals[0];
      const randomUser = testUsers[0];
      const advice = Fixtures.makeAdvice();

      return supertest(app)
        .post(`/api/advice/${publicGoal.id}`)
        .set('Authorization', Fixtures.makeAuthHeader(randomUser))
        .send(advice)
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id');
          expect(res.body.goal_id).to.eql(publicGoal.id);
          expect(res.body.user_id).to.eql(randomUser.id);
          expect(res.body.advice_text).to.eql(advice.advice_text);
          return res.body;
        })
        .then(res => {
          const adviceId = res.id;
          const adviceText = res.advice_text;
          return supertest(app).get(`/api/advice/${publicGoal.id}`)
            .set('Authorization', Fixtures.makeAuthHeader(randomUser))
            .then(res => {
              expect(res.body).to.be.an('array');
              const newAdvice = res.body.find(el => el.id === adviceId);
              expect(newAdvice.advice_text).to.eql(adviceText);
            });
        });
    });
  });

  describe("DELETE /advice/:goalId", () => {
    context("Given there are goals/advice in the database", () => { 

      beforeEach("insert stuff", () => {
        return Fixtures.seedNSpiredTables(
          db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
        );
      });
      
      
      it(`responds with 404 goal not found if invalid goal link`, () => {
        return supertest(app).delete("/api/advice/00000")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(404, {
            error: { message: 'Goal does not exist'}
          });
      });

      it(`responds with 404 advice not found if user does not have advice for specified goal`, () => {
        return supertest(app).delete(`/api/advice/${testGoals[0].id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(404, {
            error: { message: 'User advice not found'}
          }); 
      });

      it("responds with 204 and successfully deletes advice, making it unavailable for deletion", () => {
        return supertest(app).delete(`/api/advice/${testGoals[0].id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[2]))
          .expect(204)
          .then(() => {
            return supertest(app).delete(`/api/advice/${testGoals[0].id}`)
              .set('Authorization', Fixtures.makeAuthHeader(testUsers[2]))
              .expect(404, {
                error: { message: 'User advice not found'}
              });
          });
      });
    });
  });
});
