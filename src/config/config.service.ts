import { IConfigService } from './config.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.loggerService.error('[ConfigService] ошибка конфигурации окружения');
		} else {
			this.loggerService.log('[ConfigService] конфигурация загружена');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
