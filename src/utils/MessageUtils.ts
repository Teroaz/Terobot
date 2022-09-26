import {Message} from 'discord.js';

export namespace MessageUtils {
	
	export const deletedMessagesID = new Set<string>();
	
	export const isDeletedMessage = (message: Message): boolean => deletedMessagesID.has(message.id);
	
	export const addDeletedMessage = (message: Message) => deletedMessagesID.add(message.id);
	
}
