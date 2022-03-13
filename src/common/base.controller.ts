import { Router, Response } from 'express';
import { ExpressReturnType, IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send(res, 200, message);
	}

	public send<T>(res: Response, statusCode: number, message: T): ExpressReturnType {
		res.type('application/json');

		return res.status(statusCode).json(message);
	}

	public created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		routes.forEach(({ path, method, func, middlewares }) => {
			this.logger.log(`[${method}] ${path}`);

			const bindMiddleware = middlewares?.map((m) => m.execute.bind(m));
			const bindHandler = func.bind(this);

			const pipeline = bindMiddleware ? [...bindMiddleware, bindHandler] : bindHandler;

			this.router[method](path, pipeline);
		});
	}
}
