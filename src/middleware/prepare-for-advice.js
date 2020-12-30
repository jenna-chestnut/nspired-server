const GoalsService = require('../Services/goals-service.js');

function prepareForAdvice(req, res, next) {
  const goal_id  = req.params.goalId;
  const user_id = req.user.id;

  try {
    // find goal
    GoalsService.getGoal(req.app.get('db'), goal_id)
      .then((goal) => { 

        // if goal is private & does not belong to user, 401
        if (goal.user_id !== user_id 
          && goal.is_public === false) {
          return res.status(401).json({
            error: { 
              message: `Unauthorized request`
            }
          });
        }

        // if goal belongs to user, make public
        if (goal.user_id === user_id) {
          return GoalsService.makeGoalPublic(req.app.get('db'), user_id, goal.id)
            .then((res) => {
              if (!res) {
                throw new Error('Goal not made public. Advice cannot be posted or retrieved.');
              }

              next();
            });
        }

        next();
      }).catch(err => {

        console.error(err);

        next(err);

      });
  } catch(error) {
    return res.status(404).json({
      error: 'Goal doesn\'t exist'
    });
  }
}
  
module.exports = {
  prepareForAdvice,
};