import { cleanEnv, str } from "envalid";

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    MONGO_USER: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    SESSION_SECRET: str(),
  });
}

export default validateEnv;
