const prod = {
    PORT: process.env.PORT || 1338,
    DEMO_DB_URL: process.env.STATISTICS_DB_URL || 'mongodb://localhost:27017/fantasy_statistics',
    DEMO_DB_POOLSIZE: process.env.STATISTICS_DB_POOLSIZE || 10,
    NODE_ENV: process.env.NODE_ENV || 'dev',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET || 'bHaViN@1289&&&###',  
}
module.exports = prod
  