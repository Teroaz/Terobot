import {ApplicationCommandData, ApplicationCommandOption, GuildMember} from "discord.js";
import CustomClient from "./CustomClient";

export type CommandInfo = {
		cooldown?: number,
		staff?: boolean
	}
	& ApplicationCommandData
	& ApplicationCommandOption


export default abstract class Command {
	
	readonly client: CustomClient;
	readonly info: CommandInfo;
	
	protected constructor(client: CustomClient, info: CommandInfo) {
		this.client = client;
		this.info = info;
		
		client.commands.set(info.name, this);
	}
	
	hasCooldown = (member: GuildMember) => {
		
	}
}
