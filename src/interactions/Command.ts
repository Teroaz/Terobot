import {
	ApplicationCommandData,
	ApplicationCommandOption,
	Collection,
	CommandInteraction,
	GuildMember
} from 'discord.js';
import CustomClient from '../CustomClient';

export type CommandInfo = {
		cooldown?: number,
		staff?: boolean
	}
	& ApplicationCommandData;

export default abstract class Command {

	readonly client: CustomClient;
	readonly info: CommandInfo;
	cooldowns: Collection<string, number> = new Collection();

	protected constructor(client: CustomClient, info: CommandInfo) {
		this.client = client;
		this.info = info;

		client.commands.set(info.name, this);
	}

	hasCooldown = (member: GuildMember): boolean => {
		if (this.client.isStaff(member) || !this.info.cooldown || !this.cooldowns.has(member.id)) return false;

		return Date.now() <= this.cooldowns.get(member.id)!;
	}

	abstract onExecute(interaction: CommandInteraction): void;
}
