const express = require("express");
const UpVotesService = require("../Services/upvotes-service");
const GoalsService = require('../Services/goals-service');
const { requireAuth, checkUserInfo } = require('../middleware/jwt-auth');

const upvotesRouter = express.Router();

upvotesRouter
  .route('/:goalId')
  .all((req, res, next) => {
    GoalsService.getGoal(
      req.app.get('db'),
      req.params.goalId
    )
      .then(goal => {
        if (!goal) {
          return res.status(404).json({
            error: { message: `Goal does not exist` }
          });
        };
        next();
      })
      .catch(next);
  })
  .get(checkUserInfo, (req, res, next) => {
    const user_id = req.user ? req.user.id : null;
    const goal_id = req.params.goalId;
    
    UpVotesService.getGoalUpvotes(req.app.get('db'), goal_id)
      .then(upvotes => {
        return UpVotesService.getUserUpvote(req.app.get('db'), user_id, goal_id)
          .then(upvote => {
            const upvoted = upvote.length !== 0 
              ? true : false;
            return res.status(200).json({ 
              upvotes: upvotes, 
              userUpvoted: upvoted
            });
          });
      })
      .catch(next);
  })
  .post(requireAuth, (req, res, next) => {
    const user_id = req.user.id;
    const goal_id = req.params.goalId;

    const upvote = {
      user_id, goal_id
    };

    UpVotesService.addUpvote(
      req.app.get('db'),
      upvote
    )
      .then((upvote) => {
        if (!upvote) {
          return res.status(400).json({
            error: { message: 'Upvote not added' }
          });
        }
        res.status(201).json(upvote);
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    const user_id = req.user.id;
    const goal_id = req.params.goalId;

    UpVotesService.deleteUpvote(
      req.app.get('db'),
      user_id,
      goal_id
    )
      .then((upvote) => {
        if (!upvote) {
          return res.status(400).json({
            error: { message: 'Upvote not deleted' }
          });
        }
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = upvotesRouter;
