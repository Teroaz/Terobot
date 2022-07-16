import CustomClient from '../CustomClient';
import {GuildMember, Interaction, MessageEmbed} from 'discord.js';
import {ColorUtils, TimeUtils} from '../utils';
import msToFormattedString = TimeUtils.msToFormattedString;

export = async (client: CustomClient, interaction: Interaction) => {

	if (interaction.user.bot) return;

	if (interaction.isCommand()) {
		const {commandName} = interaction;

		const command = client.commands.get(commandName);
		if (!command) return;

		const member = interaction.member as GuildMember;

		if (command.info.staff && !client.isStaff(member)) {
			const embed = new MessageEmbed({
				color: ColorUtils.values.ERROR,
				description: `⛔ • Tu n'as pas la permission d'exécuter cette commande !`
			});

			return interaction.reply({embeds: [embed], ephemeral: true});
		}

		if (command.hasCooldown(member)) {
			const remainingTime = command.cooldowns.get(member.id)! - Date.now();
			const embed = new MessageEmbed({
				color: ColorUtils.values.ERROR,
				description: `⌛ • Tu dois attendre ${msToFormattedString(remainingTime)} pour exécuter la commande \`${commandName}\``
			});

			return interaction.reply({embeds: [embed], ephemeral: true});
		}

		if (command.info.cooldown) {
			command.cooldowns.set(member.id, Date.now() + command.info.cooldown * 1000);
		}

		try {
			await command.onExecute(interaction);
		} catch (e) {
			const embed = new MessageEmbed({
				color: ColorUtils.values.ERROR,
				description: `❗ • ${e.message}`
			});
			
			if (interaction.deferred) {
				interaction.editReply({embeds: [embed]});
			} else {
				interaction.reply({embeds: [embed], ephemeral: true});
			}
			command.deleteCooldown(member);
		}
	} else if (interaction.isAutocomplete()) {
		const {commandName} = interaction;

		const command = client.commands.get(commandName);
		if (!command) return;

		const focusedOption = interaction.options.getFocused(true);
		if (!focusedOption || !command.info.options?.some(o => o.name === focusedOption.name)) return;

		const vals = command.onAutocomplete(focusedOption);
		if (!vals) return;

		await interaction.respond(vals);
	}
};
