import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './user.service.interface';
import { TYPES } from '../types';
import { UserService } from './user.service';
import { UserModel } from '@prisma/client';
import { User } from './user.entity';

const configServiceMock = {
	get: jest.fn(),
};

const userRepositoryMock = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUsersRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(userRepositoryMock);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);

	userService = container.get<IUserService>(TYPES.UserService);
	configService = container.get<IConfigService>(TYPES.ConfigService);
	userRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

let createdUser: UserModel | null;

describe('user.service', () => {
	it('create user', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');

		userRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				id: 1,
				name: user.name,
				password: user.password,
				email: user.email,
			}),
		);

		createdUser = await userService.createUser({
			name: 'name',
			password: '2222',
			email: 'test@test.ru',
		});

		expect(createdUser?.id).toBe(1);
		expect(createdUser?.password).not.toBe('1');
	});

	it('validate user - success', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await userService.validateUser({
			password: '2222',
			email: 'test@test.ru',
		});

		expect(res).toBeTruthy();
	});

	it('validate user - wrong password', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await userService.validateUser({
			password: '222',
			email: 'test@test.ru',
		});

		expect(res).toBeFalsy();
	});

	it('validate user - wrong email', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);

		const res = await userService.validateUser({
			password: '222',
			email: 'test@tes.ru',
		});

		expect(res).toBeFalsy();
	});
});
