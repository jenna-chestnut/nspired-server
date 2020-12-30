const express = require("express");
const GoalsService = require("../Services/goals-service");
const xss = require('xss');
const { requireAuth } = require("../middleware/jwt-auth");
const { checkForGoal } = require("../middleware/check-goal");

const goalsRouter = express.Router();

const { getPublicGoal, getUserGoal }
= GoalsService;

goalsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const userId = req.user.id;

    GoalsService.getAllUserGoals(req.app.get('db'), userId)
      .then(goals => {
        if (!goals) {
          return res.status(404).json({
            error: {message: 'Goals not found.'}
          });
        } else {
          goals = goals.map(goal => {
            return {
              goal_name: xss(goal.goal_name),
              id: goal.id,
              goal_id: goal.goal_id,
              user_id: goal.user_id,
              is_creator: goal.is_creator,
              completed: goal.completed,
              date_created: goal.date_created,
              expiration: goal.expiration,
              personal_note: xss(goal.personal_note)
            };
          });
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
      goal_name: xss(goal_name), 
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
          personal_note: xss(personal_note)
        };
        goal_id = goal.id;
        return GoalsService.createUserGoal(req.app.get('db'), userGoal)
          .then(() => {

            // use getUserGoal db to curate response of full goal
            GoalsService.getUserGoal(req.app.get('db'), goal_id, user_id)
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
  .all(checkForGoal)
  .get((req, res, next) => {
    const goal_id  = req.params.goalId;
    const userId = req.user.id;

    // check if user is authorized to view private/user goal using jwt auth req.user.id attachment
    getUserGoal(req.app.get('db'), goal_id, userId)
      .then(goal => {

        // if goal does not belong to user
        if (!goal) {

          // check if goal is public
          getPublicGoal(req.app.get('db'), goal_id)
            .then(goal => {

              // if goal is public, res goal
              if (goal) {
                return res.status(200).json(goal);
              }

              // otherwise, mark as unauthroized request
              else {
                return res.status(401).json({
                  error: { message: `Unauthorized request` }
                });
              }
            });
        }
        else {
          return res.status(200).json(goal);
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
        error: { message: 'Expiration is required.' }
      });
    }

    // create user goal to insert into user_goals table
    const userGoal = {
      goal_id,
      user_id,
      expiration,
      personal_note: xss(personal_note)
    };

    GoalsService.createUserGoal(req.app.get('db'), userGoal)
      .then(() => {

        // use getUserGoal db to curate response of full goal
        GoalsService.getUserGoal(req.app.get('db'), goal_id, user_id)
          .then(goal => {
            return res.status(201).json(goal);
          });
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const user_id = req.user.id;
    const goal_id = req.params.goalId;
 
    GoalsService.getUserGoal(
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

        // otherwise, delete user goal
        GoalsService.deleteGoal(
          req.app.get('db'),
          user_id,
          goal_id,
          goal.is_creator
        )
          .then((deleted) => {
           
            if (!deleted) {
              return res.status(400).json({
                error: { message: 'User goal not deleted' }
              });
            }
            return res.status(204).end();
          });
      })
      .catch(next);
  })
  .patch((req, res, next) => {
    const user_id = req.user.id;
    const goal_id = req.params.goalId;
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        error: {
          message: 'Missing request body. Please include "completed" or "is public" fields to update goal.'
        }
      });
    }
 
    GoalsService.getUserGoal(
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

        return GoalsService.updateUserGoal(
          req.app.get('db'),
          user_id,
          goal_id,
          data
        )
          .then((updated) => {
            if (!updated) {
              return res.status(400).json({
                error: { message: 'User goal not marked as complete' }
              });
            }
            return res.status(201).json(updated);
          });
      })
      .catch(next);
  });

module.exports = goalsRouter;
