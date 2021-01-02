module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://jchestnut@localhost/nspired',
  JWT_SECRET: process.env.JWT_SECRET || 'this-is-a-FAKE-secret-hehe'
};
