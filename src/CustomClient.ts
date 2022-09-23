import {Client, Collection, GatewayIntentBits, Guild, GuildMember, Partials, PermissionsBitField, Snowflake} from 'discord.js';
import Command from './interactions/Command';
import {Loaders} from './Loaders';

export default class CustomClient extends Client {
	
	staff: Record<'rolesID' | 'usersID', Array<Snowflake>> = {
		rolesID: [],
		usersID: []
	};

	readonly commands: Collection<string, Command> = new Collection();

	get baseGuild(): Guild | null {
		if (!process.env.BASE_GUILD_ID) {
			console.error('No base guild ID specified in environment file.');
			process.exit(1);
		}
		
		return this.guilds.cache.get(process.env.BASE_GUILD_ID) ?? null;
	}

	constructor() {
		super({
			intents: [
				GatewayIntentBits.DirectMessageReactions,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.DirectMessageTyping,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildIntegrations,
				GatewayIntentBits.GuildInvites,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildWebhooks,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMessageTyping,
				GatewayIntentBits.GuildScheduledEvents
			],
			allowedMentions: {parse: ['roles', 'users', 'everyone'], repliedUser: false},
			partials: [Partials.Channel, Partials.Reaction, Partials.Message, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.ThreadMember, Partials.User]
		});

		this.login(process.env.TOKEN).then(() => {
			Loaders.loadCommands(this);
			Loaders.loadEvents(this);
			Loaders.loadStaff(this);
			console.info(`Logged in as ${this.user?.tag ?? 'Unknown#XXXX'}.`);
		}).catch(e => {
			console.error(`Error while instantiating CustomClient: ${e}`);
			process.exit(1);
		});
	}

	isStaff = (member: GuildMember) => [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.Administrator].some(f => member.permissions.has(f)) || member.roles.cache.some(r => this.staff.rolesID.includes(r.id)) || this.staff.usersID.includes(member.id);

	addStaff = (type: 'rolesID' | 'usersID', id: Snowflake) => {
		if (this.staff[type].includes(id)) return;
		this.staff[type].push(id);
	}
}
