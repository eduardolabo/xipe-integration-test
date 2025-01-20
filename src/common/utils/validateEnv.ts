import { cleanEnv, str } from "envalid";

function validateEnv() {
  cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    MONGO_BASE_DB: str(),
    SESSION_SECRET: str(),
  });
}

export default validateEnv;
