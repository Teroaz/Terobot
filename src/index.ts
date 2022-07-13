import * as fs from 'fs';
import * as dotenv from 'dotenv';

export * from './exceptions';
export * from './interactions';

export * from './utils';
export {default as CustomClient} from './CustomClient';

export {Loaders} from './Loaders';

const envFiles = fs.readdirSync(process.cwd()).filter(file => file.startsWith('.env') && !file.includes('example'));

if (envFiles.length === 0) {
	throw new Error('No .env file found');
}

if (envFiles.length === 1) {
	dotenv.config({path: `${process.cwd()}/${envFiles[0]}`});
} else {
	if (!process.env.NODE_ENV) {
		throw new Error('No NODE_ENV found');
	}
	dotenv.config({path: `${process.cwd()}/.env${process.env.NODE_ENV === 'production' ? '.prod' : '.dev'}`});
}

process.on('uncaughtException', (e: Error) => {
	console.warn(`Captured uncaught exception ${e.stack}`);
});

process.on('unhandledRejection', (e: Error) => {
	console.warn(`Captured unhandled rejection : ${e.stack}`);
});
