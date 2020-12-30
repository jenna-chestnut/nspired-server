/* eslint-disable no-useless-escape */
const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const Fixtures = require("./nSpired.fixtures");

// this endpoint is to view goals
// used for the dashboard, personal goal page or public win page
// this is a protected endpoint and requires authorization

describe("Goals endpoints", () => {
  
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

  describe("GET /goals/:goalId", () => {
    
    beforeEach("insert stuff", () => {
      return Fixtures.seedNSpiredTables(
        db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
      );
    });

    context(`Given an invalid goal id`, () => {
      it(`responds with 404 not found if invalid id`, () => {
        return supertest(app).get("/api/goals/0000")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(404,{
            error: {
              message: `Goal does not exist`
            }
          });
      });

      it(`responds with 400 error if goal Id is string`, () => {
        return supertest(app).get("/api/goals/test")
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

      it("responds with 200 and the goal if goal is public", () => {
        return supertest(app).get(`/api/goals/${goal.id}`)
          .set('Authorization', Fixtures.makeAuthHeader(user))
          .expect(200)
          .then(res => {
            expect(res.body.id).to.eql(goal.id);
            expect(res.body.user_id).to.eql(goal.user_id);
            expect(res.body.is_public).to.eql(true);
            expect(res.body.date_created).to.eql(goal.date_created.toISOString());
          });
      });

      it("responds with 401 unauthorized if goal is private and username does not match", () => {
        return supertest(app).get(`/api/goals/${privateGoal.id}`)
          .set('Authorization', Fixtures.makeAuthHeader(badUser))
          .expect(401, {
            error: {message: 'Unauthorized request'}
          });
      });

      it("responds with 200 and the goal if goal is private and username matches", () => {
        
        return supertest(app)
          .get(`/api/goals/${privateGoal.id}`)
          .set('Authorization', Fixtures.makeAuthHeader(user))
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('expiration');
            expect(res.body).to.have.property('date_created');
            expect(res.body.goal_id).to.eql(privateGoal.id);
            expect(res.body.user_id).to.eql(user.id);
          });
      });
    });
  });

  describe("GET /goals", () => {

    context('Given there are goals', () => {
      beforeEach("insert stuff", () => {
        return Fixtures.seedNSpiredTables(
          db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
        );
      });

      it('returns 200 and the list of specific user goals if user has goals', () => {
        return supertest(app)
          .get(`/api/goals`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body[0].user_id).to.eql(testUsers[0].id);
          });
      });
    });
    
  });

  describe("POST /goals", () => {

    beforeEach("insert stuff", () => {
      return Fixtures.seedNSpiredTables(
        db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
      );
    });

    it('for a newly created goal, adds goal to goal table and user_goals table -> then returns 201 and the posted user goal', () => {
      const newGoal = Fixtures.makeNewGoal(testUsers[0]);
      return supertest(app)
        .post(`/api/goals`)
        .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
        .send(newGoal)
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id');
          expect(res.body.is_creator).to.eql(true);
          expect(res.body.goal_name).to.eql(newGoal.goal_name);
          expect(res.body.user_id).to.eql(testUsers[0].id);
          expect(res.body.expiration).to.eql(newGoal.expiration.toISOString());
          expect(res.body.personal_note).to.eql(newGoal.personal_note);
        });
    });
  });

  describe("POST /goals/:goalId", () => {

    beforeEach("insert stuff", () => {
      return Fixtures.seedNSpiredTables(
        db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
      );
    });

    it('for a cloned goal, adds goal user_goals table -> then returns 201 and the posted user goal', () => {
      const newClone = Fixtures.makeClone(testGoals[0]);
      return supertest(app)
        .post(`/api/goals/${testGoals[0].id}`)
        .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
        .send(newClone)
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id');
          expect(res.body.is_creator).to.eql(false);
          expect(res.body.goal_name).to.eql(testGoals[0].goal_name);
          expect(res.body.user_id).to.eql(testUsers[0].id);
          expect(res.body.expiration).to.eql(newClone.expiration.toISOString());
          expect(res.body.personal_note).to.eql(newClone.personal_note);
        });
    });
  });
  describe("DELETE /goals/:goalId", () => {
    context("Given there are goals/upvotes in the database", () => {
      
      const goal_id = testGoals[0].id;

      beforeEach("insert stuff", () => {
        return Fixtures.seedNSpiredTables(
          db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
        );
      });
      
      
      it(`responds with 404 goal not found if invalid link`, () => {
        return supertest(app).delete("/api/goals/00000")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(404, {
            error: { message: 'Goal does not exist'}
          });
      });

      it(`responds with 401 unauthorized if user does not have goal`, () => {
        return supertest(app).delete(`/api/goals/${goal_id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(401, {
            error: { message: 'Unauthorized request'}
          });
      });
  

      it("responds with 204 and successfully deletes user goal, making it unavailable for deletion", () => {
        return supertest(app).delete(`/api/goals/${goal_id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[1]))
          .expect(204)
          .then(() => {
            return supertest(app).delete(`/api/goals/${goal_id}`)
              .set('Authorization', Fixtures.makeAuthHeader(testUsers[1]))
              .expect(401, {
                error: { message: 'Unauthorized request'}
              });
          });
      });

      it("if user owns original goal, responds with 204, deletes original goal & deletes user goal, making it entirely unavailable", () => {

        return supertest(app).delete(`/api/goals/${testGoals[4].id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(() => {
            return supertest(app).delete(`/api/goals/${testGoals[4].id}`)
              .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
              .expect(404, {
                error: { message: 'Goal does not exist'}
              });
          });
      });
    });
  });
  describe("PATCH /goals/:goalId", () => {
    context("Given there are goals in the database", () => {
      const data = {
        completed: true
      };
      
      const goal_id = testGoals[0].id;

      beforeEach("insert stuff", () => {
        return Fixtures.seedNSpiredTables(
          db, testUsers, testGoals, testUpVotes, testUserGoals, testAdvice
        );
      });
      
      
      it(`responds with 404 goal not found if invalid link`, () => {
        return supertest(app).patch("/api/goals/00000")
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .expect(404, {
            error: { message: 'Goal does not exist'}
          });
      });

      it(`responds with 401 unauthorized if user does not have goal`, () => {
        return supertest(app).patch(`/api/goals/${goal_id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[0]))
          .send(data)
          .expect(401, {
            error: { message: 'Unauthorized request'}
          });
      });

      it("responds with 201 and and successfully patched user goal", () => {
        return supertest(app).patch(`/api/goals/${goal_id}`)
          .set('Authorization', Fixtures.makeAuthHeader(testUsers[1]))
          .send(data)
          .expect(201)
          .then(() => {
            return supertest(app).get(`/api/goals/${goal_id}`)
              .set('Authorization', Fixtures.makeAuthHeader(testUsers[1]))
              .expect(200)
              .then(res => {
                expect(res.body.completed).to.eql(true);
              });
          });
      });
    });
  });
});
