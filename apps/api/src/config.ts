import dotenv from "dotenv";

dotenv.config();

export const config = {
  postgres: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  mongo: {
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    database: process.env.MONGO_INITDB_DATABASE,
    port: parseInt(process.env.MONGO_PORT || "27017", 10),
  },
  jwt: {
    secret: process.env.SECRET_KEY,
  },
};
