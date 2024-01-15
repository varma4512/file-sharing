const dev = {
    PORT: process.env.PORT || 1338,
    FILE_SHARE_DB_URL: process.env.FILE_SHARE_DB_URL || 'mongodb+srv://kabepe7630:8lBhhgzjKqEbPBrl@file-sharing.6jppkkb.mongodb.net/file-sharing',
    FILE_SHARE_DB_POOLSIZE: process.env.FILE_SHARE_DB_POOLSIZE || 10,
    NODE_ENV: process.env.NODE_ENV || 'dev',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET || 'bHaViN@1289&&&###'
}

module.exports = dev
  