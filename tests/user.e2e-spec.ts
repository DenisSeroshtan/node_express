import { boot } from '../src/main';
import { App } from '../src/app';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('user', () => {
	it('register - error', async () => {
		const res = await request(application.app).post('/users/register').send({
			password: '1',
			email: 'test@test.ru',
		});

		expect(res.statusCode).toBe(422);
	});

	it('login - success', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'test@test.ru',
			password: '111111',
		});

		expect(res.body.token).not.toBeUndefined();
	});

	it('login - error', async () => {
		const res = await request(application.app).post('/users/login').send({
			password: '1',
			email: 'test@test.ru',
		});

		expect(res.statusCode).toBe(401);
	});

	it('info - success', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'test@test.ru',
			password: '111111',
		});

		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.token}`);

		expect(res.body.email).toBe('test@test.ru');
	});

	it('info - error', async () => {
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1`);

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
