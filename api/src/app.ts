import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import mongoose from "mongoose";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware";
import { RegisterRoutes } from "./swagger/routes";
import swaggerDoc from "./swagger/swagger.json";
import swaggerUi from "swagger-ui-express";
import favicon from "serve-favicon";
var path = require("path");
import { ValidateError } from "tsoa";
import passportConfig from "./passport/passport-config";

class App {
  public app: express.Application;
  public port: string | number;
  public env: boolean;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.env = process.env.NODE_ENV === "production";
    // this.app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    if (this.env) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(morgan("combined"));
      this.app.use(cors({ origin: true, credentials: true }));
    } else {
      this.app.use(morgan("dev"));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    passportConfig(this.app);
    this.app.get("/api/api-json", (req, res)=>res.json(swaggerDoc));
    this.app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    // const assetFolder = path.resolve(__dirname, "public/");
    // this.app.use(express.static(assetFolder));

    RegisterRoutes(this.app);
    //     this.app.get("/*", (req, res) => {
    //   res.sendFile(path.resolve(__dirname, "public/", "index.html"));
    // });

    this.app.use(function errorHandler(
      err: unknown,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): express.Response | void {
      if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
          message: "Validation Failed",
          details: err?.fields,
        });
      }
      if (err instanceof Error) {
        return res.status(500).json({
          message: err.message,
        });
      }
      next();
    });

    this.app.use("/api", function notFoundHandler(_req, res: express.Response) {
      res.status(404).send({
        message: "Not Found",
      });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private connectToDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_CONNECTION_VERB, MONGO_BASE_DB } =
      process.env;
    if (this.env) {
      // production database
      mongoose.set("strictQuery", false);
      mongoose.connect(
        MONGO_CONNECTION_VERB +
        "://" +
        MONGO_USER +
        ":" +
        MONGO_PASSWORD +
        "@"+
        MONGO_PATH,
        {dbName: MONGO_BASE_DB}
      )  .then(() => console.log('Connected to database.'))
        .catch(err => console.error('Error connecting to database:', err.message));

    } else {
      mongoose.set("strictQuery", false);
      mongoose.connect(
        MONGO_CONNECTION_VERB +
          "://" +
          MONGO_USER +
          ":" +
          MONGO_PASSWORD +
        "@"+
          MONGO_PATH,
        {dbName: MONGO_BASE_DB}
      )  .then(() => console.log('Connected to database.'))
        .catch(err => console.error('Error connecting to database:', err.message));
    }
  }
}

export default App;
