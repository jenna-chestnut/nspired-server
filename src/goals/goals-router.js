const express = require("express");
const GoalsService = require("./goals-service");
const xss = require('xss');
const { requireAuth } = require("../middleware/jwt-auth");

const goalsRouter = express.Router();

const { doesGoalExist, getPublicGoal, getPrivateGoal }
= GoalsService;

goalsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const userId = req.user.id;

    GoalsService.getUserGoals(req.app.get('db'), userId)
      .then(goals => {
        if (!goals) {
          return res.status(404).json({
            error: {message: 'Goals not found.'}
          });
        } else {
          return res.status(200).json(goals);
        }
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const { goal_name, expiration, personal_note = '' } = req.body;
    const user_id = req.user.id;

    // validate fields
    if (!goal_name || !expiration) {
      return res.status(400).json({
        error: {message: 'Goal name and expiration are required.'}
      });
    }

    const newGoal = { 
      goal_name, 
      user_id
    };

    let goal_id; // to hold our new goal's id for retrieval

    // take general goal data to create new goal in goals table
    GoalsService.createGoal(req.app.get('db'), newGoal)
      .then(goal => {

        // use response from goal completed to create individual user goal
        const userGoal = {
          goal_id: goal.id,
          user_id,
          is_creator : true,
          expiration,
          personal_note
        };
        goal_id = goal.id;
        return GoalsService.createUserGoal(req.app.get('db'), userGoal)
          .then(() => {

            // use getPrivateGoal db to curate response of full goal
            GoalsService.getPrivateGoal(req.app.get('db'), goal_id, user_id)
              .then(goal => {
                return res.status(201).json(goal);
              });
          });
      })
      .catch(next);
  });

goalsRouter
  .route("/:goalId")
  .all(requireAuth)
  .all((req, res, next) => {
    const goal_id  = req.params.goalId;

    // if the id is an invalid type, 400
    if (isNaN(parseInt(goal_id))) {
      return res.status(400).json({
        error: `Goal id must be a number`
      });
    } else {

      // otherwise, check if goal exists
      doesGoalExist(req.app.get('db'), goal_id)
        .then((goal) => {

          // if goal does not exist, 404
          if (!goal) {
            return res.status(404).json({
              error: `Goal does not exist`
            });
          }
          next();
        });
    }
  })
  .get((req, res, next) => {
    const goal_id  = req.params.goalId;
    const userId = req.user.id;

    // check if goal is public
    getPublicGoal(req.app.get('db'), goal_id)
      .then(goal => {

        // if goal is public, res goal
        if (goal) {
          return res.status(200).json(goal);
        } else {

          // otherwise, check if user is authorized to view private goal using jwt auth req.user.id attachment
          getPrivateGoal(req.app.get('db'), goal_id, userId)
            .then(goal => {

              // if goal does not belong to user, 401
              if (!goal) {
                return res.status(401).json({
                  error: { message: `Unauthorized request` }
                });
              } else {

                // otherwise, return goal!
                return res.status(200).json(goal);
              }
            });
        }
      })
      .catch(next);
        
  })
  .post((req, res, next) => {
    const { expiration, personal_note } = req.body;
    const user_id = req.user.id;
    const goal_id = req.params.goalId;

    // validate
    if (!expiration) {
      return res.status(400).json({
        error: {message: 'Expiration is required.'}
      });
    }

    // create user goal to insert into user_goals table
    const userGoal = {
      goal_id,
      user_id,
      expiration,
      personal_note
    };

    GoalsService.createUserGoal(req.app.get('db'), userGoal)
      .then(() => {

        // use getPrivateGoal db to curate response of full goal
        GoalsService.getPrivateGoal(req.app.get('db'), goal_id, user_id)
          .then(goal => {
            return res.status(201).json(goal);
          });
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const user_id = req.user.id;
    const goal_id = req.params.goalId;
 
    GoalsService.getPrivateGoal(
      req.app.get('db'),
      goal_id,
      user_id
    )
      .then(goal => {

        // if goal does not belong to user, 401
        if (!goal) {
          return res.status(401).json({
            error: { message: `Unauthorized request` }
          });
        }
      })
      .catch(next);

    GoalsService.deleteUserGoal(
      req.app.get('db'),
      user_id,
      goal_id
    )
      .then((upvote) => {
        if (!upvote) {
          return res.status(400).json({
            error: { message: 'User goal not deleted' }
          });
        }
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = goalsRouter;
