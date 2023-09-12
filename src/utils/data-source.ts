import { User } from "../entity/User";
require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "config";

interface IDbConfig {
  database: string;
  username: string;
  password: string;
  type: "postgres" | "mysql" | "mariadb" | "sqlite" | undefined;
  port: number;
  host: string;
  logging: boolean;
}
const DbConfig: IDbConfig = config.get("database");
const { database, username, password, type, host, port } = DbConfig;
export const AppDataSource = new DataSource({
  database : process.env.NODE_ENV === "production" ? process.env.POSTGRES_DB : database,
  username: process.env.NODE_ENV === "production" ? process.env.POSTGRES_USER : username,
  password : process.env.NODE_ENV === "production" ? process.env.POSTGRES_PASSWORD : password,
  host : process.env.NODE_ENV === "production" ? process.env.POSTGRES_HOST : host,
  port,
  type: "postgres",
  logging: process.env.NODE_ENV === "production" ? true : false,
  synchronize: process.env.NODE_ENV === "production" ? false : true,
  entities: ["src/entity/**/*{.ts,.js}"],
  migrations: ["src/migrations/**/*{.ts,.js}"],
  subscribers: ["src/subscribers/**/*{.ts,.js}"],
});
