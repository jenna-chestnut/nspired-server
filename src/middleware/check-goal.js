const GoalsService = require('../Services/goals-service.js');

function checkForGoal(req, res, next) {
  const goal_id  = req.params.goalId;

  if (isNaN(parseInt(goal_id))) {
    return res.status(400).json({
      error: {
        message: `Goal id must be a number`
      }
    });
  }

  try {
    GoalsService.getGoal(req.app.get('db'), goal_id)
      .then((goal) => {
        
        if (!goal) {
          return res.status(404).json({
            error: { 
              message: `Goal does not exist`
            }
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
  checkForGoal,
};