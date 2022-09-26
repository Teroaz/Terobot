import CustomClient from '../CustomClient';
import {MessageUtils} from '../utils';
import {Message} from 'discord.js';
import addDeletedMessage = MessageUtils.addDeletedMessage;

export = async (client: CustomClient, message: Message) => {
	
	addDeletedMessage(message);
	
};
