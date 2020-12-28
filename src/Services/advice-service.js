const AdviceService = {
  getGoalAdvice(db, goal_id) {
    return db
      .from('nspired_advice')
      .where({ goal_id })
      .select('*');
  },
  createAdvice(db, userAdvice) {
    return db
      .insert(userAdvice)
      .into('nspired_advice')
      .returning('*')
      .then(([advice]) => advice);
  },
  deleteUserAdvice(db, user_id, goal_id) {
    return db
      .from('nspired_advice')
      .where({ user_id })
      .where({ goal_id })
      .delete();
  }
};

module.exports = AdviceService;