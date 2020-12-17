const UpVotesService = {
  getUserUpvote(db, user_id, goal_id) {
    return db
      .select('*')
      .from('nspired_upvotes')
      .where({ goal_id })
      .where({ user_id });
  },
  getGoalUpvotes(db, goal_id) {
    return db
      .select('*')
      .from('nspired_upvotes')
      .where({ goal_id });
  },
  addUpvote(db, upvote) {
    return db
      .insert(upvote)
      .into('nspired_upvotes')
      .returning('*')
      .then(([up]) => up);
  },
  deleteUpvote(db, user_id, goal_id) {
    return db
      .from('nspired_upvotes')
      .where({ user_id })
      .where({ goal_id })
      .delete();
  }
};

module.exports = UpVotesService;