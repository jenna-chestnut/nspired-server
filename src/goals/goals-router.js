const express = require("express");
const GoalsService = require("./goals-service");
const xss = require('xss');
const { requireAuth } = require("../middleware/jwt-auth");

const goalsRouter = express.Router();

const { doesGoalExist, isGoalPublic, getPrivateGoal }
= GoalsService;

goalsRouter
  .route("/:goalId")
  .get(requireAuth, (req, res, next) => {
    const id  = req.params.goalId;
    const userId = req.user.id || 65383023947;

    // if the id is an invalid type, 400
    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        error: `Goal id must be a number`
      });
    } else {

      // otherwise, check if goal exists
      doesGoalExist(req.app.get('db'), id)
        .then((goal) => {

          // if goal does not exist, 404
          if (!goal) {
            return res.status(404).json({
              error: `Goal does not exist`
            });
          }
          return goal;
        }).then(() => {

          // otherwise, check if goal is public
          isGoalPublic(req.app.get('db'), id)
            .then(goal => {

              // if goal is public, res goal
              if (goal) {
                return res.status(200).json(goal);
              } else {

                // otherwise, check is user is authorized to view private goal using jwt auth req.user.id attachment
                getPrivateGoal(req.app.get('db'), id, userId)
                  .then(goal => {

                    // if goal does not belong to user, 401
                    if (!goal) {
                      return res.status(401).json({
                        error: {message: `Unauthorized request`}
                      });
                    } else {

                      // otherwise, return goal!
                      return res.status(200).json(goal);
                    }
                  });
              }
            });
        })
        .catch(next);
    }
  });

module.exports = goalsRouter;
