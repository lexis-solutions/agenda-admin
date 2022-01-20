import path from 'path';
import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.join(__dirname, `../.env.${env}`) });
