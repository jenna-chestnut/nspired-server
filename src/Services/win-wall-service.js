const WinWallService = {
  getWinWall(db) {
    return db
      .from('nspired_goals')
      .leftOuterJoin('nspired_upvotes', 'nspired_goals.id', 'nspired_upvotes.goal_id')
      .leftOuterJoin('nspired_users', 'nspired_goals.user_id', 'nspired_users.id')
      .count('nspired_upvotes as upvote_count')
      .select('nspired_goals.*', 'nspired_users.user_name')
      .where({is_public: true})
      .groupBy('nspired_goals.id', 'nspired_users.user_name')
      .orderBy('upvote_count', 'desc');
  },
  getHomeWinWall(db) {
    return db
      .from('nspired_goals')
      .leftOuterJoin('nspired_upvotes', 'nspired_goals.id', 'nspired_upvotes.goal_id')
      .leftOuterJoin('nspired_users', 'nspired_goals.user_id', 'nspired_users.id')
      .count('nspired_upvotes as upvote_count')
      .select('nspired_goals.*', 'nspired_users.user_name')
      .where({is_public: true})
      .groupBy('nspired_goals.id', 'nspired_users.user_name')
      .orderBy('upvote_count', 'desc')
      .limit(5);
  },
  getTotalClones(db, goal_id) {
    return db
      .from('nspired_user_goals')
      .count('id')
      .where({ goal_id })
      .then(([{ count }]) => count);
  },
  getTotalCompleted(db, goal_id) {
    return db
      .from('nspired_user_goals')
      .count('id')
      .where({ goal_id })
      .where({ completed: true })
      .then(([{ count }]) => count);
  },
  getInspo(db) {
    return db
      .from('nspired_inspo')
      .select('*');
  }
};

module.exports = WinWallService;