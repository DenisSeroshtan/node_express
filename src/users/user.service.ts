import { IUserService } from './user.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));

		const existUser = await this.usersRepository.find(email);

		if (existUser) {
			return null;
		}

		return await this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existUser = await this.usersRepository.find(email);

		if (!existUser) {
			return false;
		}

		const newUser = new User(existUser.email, existUser.name, existUser.password);

		return newUser.comparePassword(password);
	}

	async getInfo(email: string): Promise<UserModel | null> {
		return await this.usersRepository.find(email);
	}
}
