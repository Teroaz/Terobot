import {Client, Collection, Guild, GuildMember, Intents, Permissions, Snowflake} from 'discord.js';
import * as path from 'path';
import Command from './interactions/Command';

export type TableDataID = Record<string, Snowflake>;

export default abstract class CustomClient extends Client {
	
	readonly chansID: TableDataID = require(path.join(__dirname, 'datas/chansID.json'));
	readonly rolesID: TableDataID = require(path.join(__dirname, 'datas/rolesID.json'));
	
	staff: Record<'rolesID' | 'usersID', Array<Snowflake>> = {
		rolesID: [],
		usersID: []
	};
	
	readonly commands: Collection<string, Command> = new Collection();
	
	get baseGuild(): Guild | null {
		return this.guilds.cache.get(process.env.BASE_GUILD_ID!) || null;
	}
	
	protected constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_BANS,
				Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
				Intents.FLAGS.GUILD_INTEGRATIONS,
				Intents.FLAGS.GUILD_WEBHOOKS,
				Intents.FLAGS.GUILD_INVITES,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.GUILD_PRESENCES,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_MESSAGE_TYPING,
				Intents.FLAGS.DIRECT_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
				Intents.FLAGS.DIRECT_MESSAGE_TYPING,
				Intents.FLAGS.GUILD_SCHEDULED_EVENTS
			],
			allowedMentions: {parse: ['roles', 'users', 'everyone'], repliedUser: false},
			partials: ['MESSAGE', 'GUILD_SCHEDULED_EVENT', 'GUILD_MEMBER', 'CHANNEL', 'REACTION', 'USER']
		});
		
		this.login(process.env.TOKEN).then(() => {
			this.onLogin();
		});
	}
	
	isStaff = (member: GuildMember) => member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) && member.roles.cache.some(r => this.staff.rolesID.includes(r.id)) || this.staff.usersID.includes(member.id);
	
	addStaff = (type: 'rolesID' | 'usersID', id: Snowflake) => {
		if (this.staff[type].includes(id)) return;
		this.staff[type].push(id);
	}
	
	abstract onLogin();
}
