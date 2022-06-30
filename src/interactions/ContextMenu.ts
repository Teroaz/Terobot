import CustomClient from '../CustomClient';
import {ContextMenuInteraction} from 'discord.js';
import {ContextMenuCommandType} from '@discordjs/builders';

export type ContextMenuInfo = {
	name: string,
	type: ContextMenuCommandType,
	description: string,
	cooldown?: number,
	staff?: boolean
};

abstract class ContextMenu {

	readonly client: CustomClient;
	readonly config: ContextMenuInfo;

	protected constructor(client: CustomClient, config: ContextMenuInfo) {
		this.client = client;
		this.config = config;
	}

	abstract onExecute(interaction: ContextMenuInteraction): void;

}
