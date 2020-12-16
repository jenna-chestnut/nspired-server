const WinWallService = {
  getWinWall(db) {
    return db
      .from('nspired_goals')
      .join('nspired_upvotes', 'nspired_goals.id', 'nspired_upvotes.goal_id')
      .join('nspired_users', 'nspired_goals.user_id', 'nspired_users.id')
      .count('nspired_upvotes as upvote_count')
      .select('nspired_goals.*', 'nspired_users.user_name')
      .where({is_public: true})
      .groupBy('nspired_goals.id', 'nspired_users.user_name')
      .orderBy('upvote_count', 'desc');
  },
  getHomeWinWall(db) {
    return db
      .from('nspired_goals')
      .join('nspired_upvotes', 'nspired_goals.id', 'nspired_upvotes.goal_id')
      .join('nspired_users', 'nspired_goals.user_id', 'nspired_users.id')
      .count('nspired_upvotes as upvote_count')
      .select('nspired_goals.*', 'nspired_users.user_name')
      .where({is_public: true})
      .groupBy('nspired_goals.id', 'nspired_users.user_name')
      .orderBy('upvote_count', 'desc')
      .limit(5);
  }
};

module.exports = WinWallService;