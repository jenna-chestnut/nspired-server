module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL || 'postgresql://jchestnut@localhost/nspired',
  JWT_SECRET: process.env.JWT_SECRET || 'this-is-a-FAKE-secret-hehe'
};
