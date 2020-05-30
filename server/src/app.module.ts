import express, { Express } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import { UsersModule } from './modules/users/users.module';
import { LoginModule } from './modules/login/login.module';
import Auth from './middleware/auth';

class AppModule {
  app: Express;

  constructor() {
    this.app = express();
    this.commonMiddleware();
    this.modules();
  }

  private commonMiddleware() {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cors());
  }

  private modules() {
    this.app.use('/v1/login', new LoginModule().router);
    this.app.use('/v1/users', Auth.user, new UsersModule().router);
  }
}

export default new AppModule();
