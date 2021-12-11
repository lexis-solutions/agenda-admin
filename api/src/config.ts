import dotenv from 'dotenv';
const env = process.env.ENV || 'development';
dotenv.config({ path: `.env.${env}` });
