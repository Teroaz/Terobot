import CustomClient from './CustomClient';
import * as path from 'path';
import {glob} from 'glob';
import Command from './interactions/Command';
import {Snowflake} from 'discord.js';

export namespace Loaders {
	
	export const loadCommands = (client: CustomClient) => {
		console.info(`Loading commands...`);
		
		const commandsFiles = glob.sync(path.join(__dirname, `/**/commands/**/*.js`)).concat(glob.sync(path.join(process.cwd(), `/**/commands/**/*.js`), {ignore: `**/node_modules/**`}));
		console.info(`Found ${commandsFiles.length} command${commandsFiles.length > 1 ? 's' : ''} in the corresponding dir.`);
		
		commandsFiles.forEach(file => {
			const command: Command = new (require(file).default)(client);
			if (!command?.info?.name) {
				console.error(`Command ${file} has no name.`);
				return;
			}
			
			console.info(`Loaded command ${command.info.name} ✅`);
			client.commands.set(command.info.name, command);
		});
		
		if (client.commands.size > 0) {
			client.baseGuild?.commands.set(client.commands.map(c => c.info)).then(r => {
				console.info(`${r.size} command${r.size > 1 ? 's' : ''} registered as slash commands.`);
			}).catch(e => {
				console.error(`Failed to register commands as slash commands.`, e);
			});
		}
	};
	
	export const loadStaff = (client: CustomClient) => {
		console.info(`Loading staff...`);
		
		const staffFiles = glob.sync(path.join(process.cwd(), `/**/staffs.json`), {ignore: `**/node_modules/**`});
		const staffFile = staffFiles[0];
		
		if (!staffFile) {
			console.info(`No staff file found`);
			return;
		}
		
		const staffsID = require(staffFile) as { [key in 'rolesID' | 'usersID']: Array<Snowflake> };
		if (!Array.isArray(staffsID.rolesID)) staffsID.rolesID = [];
		if (!Array.isArray(staffsID.usersID)) staffsID.usersID = [];
		
		console.info(`Found ${staffsID.rolesID.length} role${staffsID.rolesID.length > 1 ? 's' : ''} and ${staffsID.usersID.length} user${staffsID.usersID.length > 1 ? 's' : ''} as staff.`);
		
		Object.entries(staffsID).forEach(([key, value]) => {
			if (!['rolesID', 'usersID'].includes(key)) {
				console.error(`Staff file has an invalid key: ${key}`);
				return;
			}
			if (value.length > 1) {
				console.log(`Loaded ${value.length} ${key} ✅ : ${value.join(', ')}`);
				client.staff[key] = [...new Set([...client.staff[key], ...value])];
			}
		});
		
	};
	
	export const loadEvents = (client: CustomClient) => {
		console.info(`Loading events...`);
		
		const eventsFiles = glob.sync(path.join(__dirname, `/**/events/**/*.js`)).concat(glob.sync(path.join(process.cwd(), `/**/events/**/*.js`), {ignore: `**/node_modules/**`}));
		console.info(`Found ${eventsFiles.length} event${eventsFiles.length > 1 ? 's' : ''} in the corresponding dir.`);
		
		eventsFiles.forEach(file => {
			const event = require(file);
			const eventName = file.split('/')?.at(-1)?.split('.')?.[0];
			
			if (!eventName) {
				console.error(`Event ${file} has no name.`);
				return;
			}
			
			client.on(eventName, event.bind(null, client));
			console.info(`Loaded event ${eventName} ✅`);
			delete require.cache[require.resolve(file)];
		});
	};
	
}
