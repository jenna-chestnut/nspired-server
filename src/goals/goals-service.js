const GoalsService = {
  doesGoalExist(db, id) {
    return db
      .from('nspired_goals')
      .where({ id })
      .first();
  },
  getPublicGoal(db, id) {
    return db
      .from('nspired_goals')
      .where({ id })
      .where({is_public: true})
      .first();
  },
  getPrivateGoal(db, id, user_id) {
    return db
      .from('nspired_goals')
      .join('nspired_user_goals', 'nspired_goals.id', 'nspired_user_goals.goal_id')
      .select ('nspired_user_goals.*', 'nspired_goals.goal_name')
      .where({ 'nspired_user_goals.user_id' : user_id })
      .where({ 'nspired_goals.id' : id })
      .first();
  },
  getUserGoals(db, user_id) {
    return db
      .from('nspired_goals')
      .join('nspired_user_goals', 'nspired_goals.id', 'nspired_user_goals.goal_id')
      .select ('nspired_user_goals.*', 'nspired_goals.goal_name')
      .where({ 'nspired_user_goals.user_id' : user_id });
  },
  createGoal(db, newGoal) {
    return db
      .insert(newGoal)
      .into('nspired_goals')
      .returning('*')
      .then(([goal]) => goal);
  },
  createUserGoal(db, userGoal) {
    return db
      .insert(userGoal)
      .into('nspired_user_goals')
      .returning('*');
  },
  deleteUserGoal(db, user_id, goal_id) {
    return db
      .from('nspired_user_goals')
      .where({ user_id })
      .where({ goal_id })
      .delete();
  }
};

module.exports = GoalsService;