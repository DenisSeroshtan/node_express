import { NextFunction, Response, Request } from 'express';

export class IExeptionFilter {
	catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}
