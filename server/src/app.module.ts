import express, { Express } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { LoginModule } from './modules/login/login.module';
import { UsersModule } from './modules/users/users.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { OvertimeModule } from './modules/overtime/overtime.module';
import { VacationsModule } from './modules/vacations/vacations.module';
import { QualityModule } from './modules/quality/quality.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ReportsModule } from './modules/reports/reports.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { WageseModule } from './modules/wages/wages.module';
import { TravelExpensesModule } from './modules/travelExpenses/travelExpenses.module';
import { MailModule } from './modules/mail/mail.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
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
    //origin and credentials to set cookies in the browser
    this.app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
    this.app.use(cookieParser());
  }

  private modules() {
    this.app.use('/v1/login', new LoginModule().router);
    this.app.use('/v1/users', Auth.user, new UsersModule().router);
    this.app.use('/v1/permissions', Auth.user, new PermissionsModule().router);
    this.app.use('/v1/overtime', Auth.user, new OvertimeModule().router);
    this.app.use('/v1/vacations', Auth.user, new VacationsModule().router);
    this.app.use('/v1/quality', new QualityModule().router);
    this.app.use('/v1/profile', Auth.user, new ProfilesModule().router);
    this.app.use('/v1/reports', Auth.user, new ReportsModule().router);
    this.app.use('/v1/tasks', Auth.user, new TasksModule().router);
    this.app.use('/v1/salary', Auth.user, new WageseModule().router);
    this.app.use('/v1/travel-expenses', Auth.user, new TravelExpensesModule().router);
    this.app.use('/v1/mail', Auth.user, new MailModule().router);
    this.app.use('/v1/dashboard', Auth.user, new DashboardModule().router);
  }
}

export default new AppModule();
