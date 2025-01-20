import "dotenv/config";

import validateEnv from "./common/utils/validateEnv";

validateEnv();

import App from "./app";

const app = new App();

app.listen();
