import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';
import { ExeptionFilter } from './error/exeption.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './error/exeption.filter.interface';
import { IUserController } from './users/user.controller.interface';
import { UserService } from './users/user.service';
import { IUserService } from './users/user.service.interface';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UserRepository } from './users/user.repository';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UserRepository);
	bind<App>(TYPES.Application).to(App);
});

interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();

	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);

	await app.init().then((r) => r);

	return { appContainer, app };
}

export const boot = bootstrap();
