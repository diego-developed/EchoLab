/**
 * @file config/redisConfig.js
 * @description Settings file that connects application to Redis
 */

import dotenv from 'dotenv';
dotenv.config()

export const redisConfig = {
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_SOCKET_HOST,
        port: process.env.REDIS_SOCKET_PORT
    }
};
