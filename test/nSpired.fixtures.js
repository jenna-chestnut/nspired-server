const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const makeUsersArr = () => {
  return [
    {
      id: 1,
      user_name: 'User1',
      full_name: 'FullName1',
      password: 'Password1',
      date_created: new Date().toISOString,
    },
    {
      id: 2,
      user_name: 'User2',
      full_name: 'FullName2',
      password: 'Password2',
      date_created: new Date().toISOString,
    },
    {
      id: 3,
      user_name: 'User3',
      full_name: 'FullName3',
      password: 'Password3',
      date_created: new Date().toISOString,
    },
    {
      id: 4,
      user_name: 'User4',
      full_name: 'FullName4',
      password: 'Password4',
      date_created: new Date().toISOString,
    },
  ];
};

const makeGoalsArr = (users) => {
  [
    {
      goal_name: 'Test Goal!',
      date_created: new Date().toISOString,
      user_id: users[1].id,
    },
    {
      goal_name: 'Another test',
      date_created: new Date().toISOString,
      user_id: users[2].id,
    },
    {
      goal_name: 'Test goal again',
      date_created: new Date().toISOString,
      user_id: users[1].id,
    },
    {
      goal_name: 'Testing! TESTING!',
      date_created: new Date().toISOString,
      user_id: users[3].id,
    },
    {
      goal_name: 'Just gonna test here for a second',
      date_created: new Date().toISOString,
      user_id: users[0].id,
    },
  ];
};

const makeUpVotesArr = (users, goals) => {
  return [
    { user_id: users[0].id, goal_id: goals[1].id },
    { user_id: users[1].id, goal_id: goals[0].id },
    { user_id: users[2].id, goal_id: goals[1].id },
    { user_id: users[3].id, goal_id: goals[2].id },
    { user_id: users[2].id, goal_id: goals[3].id },
    { user_id: users[2].id, goal_id: goals[3].id },
    { user_id: users[2].id, goal_id: goals[3].id },
    { user_id: users[2].id, goal_id: goals[3].id }
  ];
};

const makeAdviceArr = (users, goals) => {
  return [
    {
      advice_text:
				"If I can do it, you most certainly can, lol. Just divvy things up into chunks and you'll see yourself slowly but surely getting it done!",
      goal_id: 9,
      user_id: 1,
    },
    {
      advice_text:
				"It's not all it's cracked up to, but not much tops the feeling of being onstage and singing Mary Poppins.",
      goal_id: 6,
      user_id: 1,
    },
    {
      advice_text: 'Not sure how I did this as I do not have a tail.',
      goal_id: 4,
      user_id: 4,
    },
    {
      advice_text: "We're almost there! We can do this! Bork!",
      goal_id: 10,
      user_id: 2,
    },
    {
      advice_text:
				'The trick is to just keep spinning as fast as you can and eventually you can catch it!!! PROMISE! Bork!',
      goal_id: 4,
      user_id: 2,
    },
    {
      advice_text: "Press all the buttons. Don't look back.",
      goal_id: 1,
      user_id: 3,
    },
    {
      advice_text:
				"I didn't actually accomplish this but it is nice to pretend. :-{advice_text: ",
      goal_id: 8,
      user_id: 5,
    },
    {
      advice_text:
				"I'm already pretty tall so this wasn't as impressive as I thought it'd be. But if you're short, you'll have a great time.",
      goal_id: 2,
      user_id: 3,
    },
    {
      advice_text: '2020 is only as tough as you let it be.',
      goal_id: 10,
      user_id: 3,
    },
    { advice_text: 'Wait, what year is it????', goal_id: 10, user_id: 4 },
    {
      advice_text:
				'I did it! Bring a lot of water and remember to take breaks. The views when you get to the top are absolutrely worth it!!',
      goal_id: 2,
      user_id: 5,
    },
  ];
};

function seedStuff(db, data, key) {
  if (key === 'users') {
    data = data.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1),
    }));
  }

  return db
    .into(`nspired_${key}`)
    .insert(data)
    .then(() =>
    // update the auto sequence to stay in sync
      db.raw(`SELECT setval('nspired_${key}_id_seq', ?)`, [
        data[data.length - 1].id,
      ])
    );
}

function makeNSpiredFixtures() {
  const testUsers = makeUsersArr();
  const testGoals = makeGoalsArr(testUsers);
  const testUpVotes = makeUpVotesArr(testUsers, testGoals);
  const testAdvice = makeAdviceArr(testUsers, testGoals);
  return { testUsers, testGoals, testUpVotes, testAdvice };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      nspired_goals,
      nspired_users,
      nspired_upvotes
      RESTART IDENTITY CASCADE`
  );
}

function seedNSpiredTables(db, users, goals, advice = []) {
  return db.transaction(async (trx) => {
    await seedStuff(trx, users, 'users');
    await seedStuff(trx, goals, 'goals');
    advice.length && (await seedStuff(trx, advice, 'advice'));
  });
}

function seedMaliciousGoal(db, user, goal) {
  return seedStuff(db, [user], 'users').then(() =>
    seedStuff(db, [goal], 'goals')
  );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeGoalsArr,
  makeUsersArr,
  seedStuff,
  cleanTables,
  makeNSpiredFixtures,
  seedNSpiredTables,
  seedMaliciousGoal,
  makeAuthHeader,
  makeUpVotesArr,
  makeAdviceArr,
};
