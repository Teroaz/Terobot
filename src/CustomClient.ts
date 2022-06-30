import {Client, Collection, Guild} from "discord.js";
import * as path from "path";
import Command from "./Command";

export default abstract class CustomClient extends Client {
	
	readonly chansID = require(path.join(__dirname, "datas/chansID.json"));
	readonly rolesID = require(path.join(__dirname, "datas/rolesID.json"));
	
	staff = {
		rolesID: [],
		usersID: []
	}
	
	readonly commands: Collection<string, Command> = new Collection();
	
	get gkorp(): Guild {
		return this.guilds.cache.get(process.env.BASE_GUILD_ID)
	}
	
	protected constructor() {
		super({
			intents: [
				'GUILDS',
				'GUILD_MEMBERS',
				'GUILD_BANS',
				'GUILD_EMOJIS_AND_STICKERS',
				'GUILD_INTEGRATIONS',
				'GUILD_WEBHOOKS',
				'GUILD_INVITES',
				'GUILD_VOICE_STATES',
				'GUILD_PRESENCES',
				'GUILD_MESSAGES',
				'GUILD_MESSAGE_REACTIONS',
				'GUILD_MESSAGE_TYPING',
				'DIRECT_MESSAGES',
				'DIRECT_MESSAGE_REACTIONS',
				'DIRECT_MESSAGE_TYPING',
				'GUILD_SCHEDULED_EVENTS'
			],
			allowedMentions: {parse: ["roles", "users", "everyone"], repliedUser: false},
			partials: ["MESSAGE", "GUILD_SCHEDULED_EVENT", "GUILD_MEMBER", "CHANNEL", "REACTION", "USER"]
		});
		
		this.login(process.env.TOKEN).then(() => this.onLogin())
	}
	
	abstract onLogin()
}
