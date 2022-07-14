import {Client, Collection, Guild, GuildMember, Intents, Permissions, Snowflake} from 'discord.js';
import Command from './interactions/Command';
import {Loaders} from './Loaders';

export default abstract class CustomClient extends Client {
	
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
			Loaders.loadCommands(this);
			Loaders.loadEvents(this);
			Loaders.loadStaff(this);
			this.onLogin();
		}).catch(e => {
			console.error(`Error while instantiating CustomClient: ${e}`);
			process.exit(1);
		});
	}

	isStaff = (member: GuildMember) => member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) && member.roles.cache.some(r => this.staff.rolesID.includes(r.id)) || this.staff.usersID.includes(member.id);

	addStaff = (type: 'rolesID' | 'usersID', id: Snowflake) => {
		if (this.staff[type].includes(id)) return;
		this.staff[type].push(id);
	}

	protected abstract onLogin();
}
