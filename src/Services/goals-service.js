const GoalsService = {
  getGoal(db, id) {
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
  getUserGoal(db, id, user_id) {
    return db
      .from('nspired_goals')
      .join('nspired_user_goals', 'nspired_goals.id', 'nspired_user_goals.goal_id')
      .select ('nspired_user_goals.*', 'nspired_goals.goal_name')
      .where({ 'nspired_user_goals.user_id' : user_id })
      .where({ 'nspired_goals.id' : id })
      .first();
  },
  getAllUserGoals(db, user_id) {
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
  deletePublicGoal(db, goal_id) {
    return db
      .from('nspired_goals')
      .where({ id: goal_id})
      .delete();
  },
  deleteGoal(db, user_id, goal_id, is_creator) {
    if (is_creator) {
      return this.deletePublicGoal(db, goal_id);
    }

    return db
      .from('nspired_user_goals')
      .where({ user_id })
      .where({ goal_id })
      .delete();
  },
  updateUserGoal(db, user_id, goal_id, data) {
    return db
      .from('nspired_user_goals')
      .update(data)
      .where({ user_id })
      .where({ goal_id });
  },
  makeGoalPublic(db, user_id, goal_id) {
    return db
      .from('nspired_goals')
      .update({ is_public: true })
      .where({ user_id })
      .where({ id : goal_id });
  }
};

module.exports = GoalsService;