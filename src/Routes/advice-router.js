const express = require("express");
const AdviceService = require("../Services/advice-service");
const GoalsService = require("../Services/goals-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { checkForGoal } = require("../middleware/check-goal");
const { prepareForAdvice } = require("../middleware/prepare-for-advice");
const xss = require("xss");

const adviceRouter = express.Router();

adviceRouter
  .route("/:goalId")
  .all(requireAuth)
  .all(checkForGoal)
  .get((req, res, next) => {
    const goal_id  = req.params.goalId;

    // check if goal is public - must be public to view advice
    GoalsService.getPublicGoal(req.app.get('db'), goal_id)
      .then(goal => {

        // if goal is public, res w/ advice for goal
        if (goal) {
          return AdviceService.getGoalAdvice(req.app.get('db'), goal_id)
            .then(advice => {
              advice = advice.map(a => {
                const user_advice = req.user.id === a.user_id;
                return {
                  id: a.id,
                  advice_text: xss(a.advice_text),
                  date_created: a.date_created,
                  goal_id: a.goal_id,
                  user_id: a.user_id,
                  user_name: xss(a.user_name),
                  user_advice
                };
              });
              res.status(200).json(advice);
            });
        }

        // otherwise, mark as unauthroized request
        else {
          return res.status(401).json({
            error: { message: `Unauthorized request` }
          });
        }
      }) 
      .catch(next);
  })
  .post(prepareForAdvice, (req, res, next) => {
    const { advice_text } = req.body;
    const user_id = req.user.id;
    const goal_id = req.params.goalId;

    // validate
    if (!advice_text) {
      return res.status(400).json({
        error: { message: 'Advice text is required.' }
      });
    }

    // create user goal then insert into user_advice table
    const userAdvice = {
      advice_text: xss(advice_text),
      goal_id,
      user_id
    };

    AdviceService.createAdvice(req.app.get('db'), userAdvice)
      .then((advice) => {
        return res.status(201).json(advice);
      })
      .catch(next);

  })
  .delete((req, res, next) => {
    const user_id = req.user.id;
    const goal_id = req.params.goalId;
 
    AdviceService.deleteUserAdvice(
      req.app.get('db'),
      user_id,
      goal_id
    )
      .then((deleted) => {
           
        if (!deleted) {
          return res.status(404).json({
            error: { message: 'User advice not found' }
          });
        }
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = adviceRouter;
