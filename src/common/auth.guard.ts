import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../error/http-error.class';

export class AuthGuard implements IMiddleware {
	execute({ user }: Request, res: Response, next: NextFunction): void {
		if (!user) {
			return next(new HTTPError(401, 'ошибка авторизации', 'auth'));
		}
		next();
	}
}
