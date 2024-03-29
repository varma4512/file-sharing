const dev = {
    PORT: process.env.PORT || 3000,
    FILE_SHARE_DB_URL: process.env.FILE_SHARE_DB_URL,
    FILE_SHARE_DB_POOLSIZE: process.env.FILE_SHARE_DB_POOLSIZE || 10,
    NODE_ENV: process.env.NODE_ENV || 'dev',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET || 'ADMIN&&&###FiLeShArInG',
    JWT_SECRET_USER: process.env.JWT_SECRET || 'bHaViN@1289&&&###UsEr',
    JWT_VALIDITY: process.env.JWT_VALIDITY || '5m'
}

module.exports = dev
