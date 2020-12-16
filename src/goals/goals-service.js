const GoalsService = {
  doesGoalExist(db, id) {
    return db
      .from('nspired_goals')
      .where({ id })
      .first();
  },
  isGoalPublic(db, id) {
    return db
      .from('nspired_goals')
      .where({ id })
      .where({is_public: true})
      .first();
  },
  getPrivateGoal(db, id, user_id) {
    return db
      .from('nspired_goals')
      .where({ id })
      .where({ user_id })
      .first();
  }
};

module.exports = GoalsService;