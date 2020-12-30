const AdviceService = {
  getGoalAdvice(db, goal_id) {
    return db
      .from('nspired_advice')
      .join('nspired_users', 'nspired_advice.user_id', 'nspired_users.id')
      .where({ goal_id })
      .select('nspired_advice.*', 'nspired_users.user_name');
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