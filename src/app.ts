import express, { Application } from 'express';
import { connect, ConnectOptions } from 'mongoose';
import route from './routes/index';
import * as dotenv from 'dotenv';

dotenv.config();
const URL =
  process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/jwt-crud';

export default class App {
  public app: Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.app.use(express.json());
    this.connectToRoute();
    this.connectToMongo();
    this.staticAssets();
  }

  /* The `private connectToMongo()` method in the provided TypeScript code is responsible for
  establishing a connection to a MongoDB database using the `mongoose` library. It calls the
  `connect()` function from `mongoose` with the specified URL and connection options. The connection
  options include `useUnifiedTopology: true` and `useNewUrlParser: true` to ensure compatibility
  with the MongoDB driver. */
  private connectToMongo() {
    connect(`${URL}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    } as ConnectOptions)
      .then(() => {
        console.log('Connected to mongoDB....');
      })
      .catch((e) => {
        console.log('There was and error to connect to mongodb');
        console.log(e);
      });
  }

  /* The `private connectToRoute()` method in the provided TypeScript code is responsible for setting up
    the application to use the defined routes. Inside this method, the application instance (`this.app`)
    is configured to use the routes defined in the `route` module. This is achieved by calling
    `this.app.use(route)`, which effectively integrates the defined routes into the application's
    request handling pipeline. By invoking `connectToRoute()` within the constructor of the `App` class,
    the application is prepared to handle incoming requests based on the defined routes when the server
    is started. 
    */
  private connectToRoute() {
    this.app.use(express.json());
    this.app.use(route);
  }

  private staticAssets() {
    this.app.use(express.static('public'));
  }

  public listen() {
    this.app.listen(this.port, function () {
      console.log(`App listening on port ${this.port}`);
    });
  }
}
