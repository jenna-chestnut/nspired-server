const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const makeUsersArr = () => {
  return [
    {
      id: 1,
      user_name: 'User1',
      full_name: 'FullName1',
      password: 'Password1',
      date_created: new Date(),
    },
    {
      id: 2,
      user_name: 'User2',
      full_name: 'FullName2',
      password: 'Password2',
      date_created: new Date(),
    },
    {
      id: 3,
      user_name: 'User3',
      full_name: 'FullName3',
      password: 'Password3',
      date_created: new Date(),
    },
    {
      id: 4,
      user_name: 'User4',
      full_name: 'FullName4',
      password: 'Password4',
      date_created: new Date(),
    },
  ];
};

const makeGoalsArr = (users) => {
  return [
    {
      id: 1,
      goal_name: 'Test Goal!',
      date_created: new Date(),
      user_id: users[1].id,
      is_public: true
    },
    {
      id: 2,
      goal_name: 'Another test',
      date_created: new Date(),
      user_id: users[2].id,
      is_public: true
    },
    {
      id: 3,
      goal_name: 'Test goal again',
      date_created: new Date(),
      user_id: users[1].id,
      is_public: true
    },
    {
      id: 4,
      goal_name: 'I should be a private goal.',
      date_created: new Date(),
      user_id: users[3].id,
    },
    {
      id: 5,
      goal_name: 'Just gonna test here for a second',
      date_created: new Date(),
      user_id: users[0].id,
      is_public: true
    },
  ];
};

const makeUpVotesArr = (users, goals) => {
  return [
    { id: 1, user_id: users[0].id, goal_id: goals[0].id },
    { id: 2, user_id: users[1].id, goal_id: goals[0].id },
    { id: 3, user_id: users[2].id, goal_id: goals[1].id },
    { id: 4, user_id: users[3].id, goal_id: goals[2].id },
    { id: 5, user_id: users[2].id, goal_id: goals[0].id },
    { id: 6, user_id: users[2].id, goal_id: goals[1].id },
    { id: 7, user_id: users[0].id, goal_id: goals[2].id },
    { id: 8, user_id: users[2].id, goal_id: goals[3].id }
  ];
};

const makeAdviceArr = (users, goals) => {
  return [
    {  id: 1,
      advice_text:
				"If I can do it, you most certainly can, lol. Just divvy things up into chunks and you'll see yourself slowly but surely getting it done!",
      goal_id: goals[1].id,
      user_id: users[0].id,
    },
    {  id: 2,
      advice_text:
				"It's not all it's cracked up to, but not much tops the feeling of being onstage and singing Mary Poppins.",
      goal_id: goals[0].id,
      user_id: users[2].id
    },
    {  id: 3,
      advice_text: 'Not sure how I did this as I do not have a tail.',
      goal_id: goals[4].id,
      user_id: users[3].id
    },
    {  id: 4,
      advice_text: "We're almost there! We can do this! Bork!",
      goal_id: goals[2].id,
      user_id: users[3].id
    },
    {  id: 5,
      advice_text:
				'The trick is to just keep spinning as fast as you can and eventually you can catch it!!! PROMISE! Bork!',
      goal_id: goals[3].id,
      user_id: users[3].id,
    },
    {  id: 6,
      advice_text: "Press all the buttons. Don't look back.",
      goal_id: goals[0].id,
      user_id: users[1].id
    }
  ];
};

const date = new Date();
date.setDate(new Date().getDate() + 7);

const makeUserGoalsArr = (users, goals) => {
  return [ 
    {id: 1, goal_id: goals[2].id, user_id: users[3].id, is_creator: true, completed: false, expiration: date, personal_note: 'I always wanted to do this thing'},
  
    {id: 2, goal_id: goals[0].id, user_id: users[1].id, is_creator: false, completed: true, expiration: date, personal_note: 'I always wanted to do this thing'},
  
    {id: 3, goal_id: goals[2].id, user_id: users[2].id, is_creator: true, completed: true, expiration: date, personal_note: 'I always wanted to do this thing'},
  
    {id: 4, goal_id: goals[3].id, user_id: users[0].id, is_creator: false, completed: true, expiration: date, personal_note: 'I always wanted to do this thing'},
  
    {id: 5, goal_id: goals[4].id, user_id: users[0].id, is_creator: true, completed: false, expiration: date, personal_note: 'I always wanted to do this thing'},
  
    {id: 6, goal_id: goals[1].id, user_id: users[0].id, is_creator: true, completed: true, expiration: date, personal_note: 'I always wanted to do this thing'},
  
    {id: 7, goal_id: goals[2].id, user_id: users[1].id, is_creator: true, completed: true, expiration: date, personal_note: 'I always wanted to do this thing'},
  
    {id: 8, goal_id: goals[1].id, user_id: users[3].id, is_creator: false, completed: true, expiration: date, personal_note: 'I always wanted to do this thing'},
  
    {id: 9, goal_id: goals[4].id, user_id: users[0].id, is_creator: false, completed: false, expiration: date, personal_note: 'I always wanted to do this thing'},
  
    {id: 10, goal_id: goals[3].id, user_id: users[3].id, is_creator: true, completed: true, expiration: date, personal_note: 'I always wanted to do this thing'}

  ];
};

const makeNewGoal = () => {
  return {
    goal_name: 'Brand New Goal!',
    expiration: date,
    personal_note: "It's a lifelong dream! duh!!"
  };
};

const makeClone = () => {
  return { 
    expiration: date,
    personal_note: "I'm a clone, so It's a lifelong dream! duh!!"
  };
};

const makeAdvice = () => {
  return {
    advice_text:
        'This is brand new advice! Wowza!'
  };
};

const makeNewUser = () => {
  return {
    full_name: 'New User',
    user_name: 'brandNewUser',
    password: 'SOs0s3cr3t!'
  };
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
  const testUserGoals = makeUserGoalsArr(testUsers, testGoals);
  return { testUsers, testGoals, testUpVotes, testUserGoals, testAdvice };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      nspired_goals,
      nspired_users,
      nspired_upvotes,
      nspired_advice
      RESTART IDENTITY CASCADE`
  );
}

function seedNSpiredTables(db, users, goals, upvotes, userGoals = [], 
  advice = []) {
  return db.transaction(async (trx) => {
    await seedStuff(trx, users, 'users');
    await seedStuff(trx, goals, 'goals');
    await seedStuff(trx, upvotes, 'upvotes');
    await seedStuff(trx, userGoals, 'user_goals');
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
  makeNewGoal,
  makeClone,
  makeAdvice,
  makeNewUser
};
