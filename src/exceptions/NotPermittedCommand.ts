export default class NotPermittedCommand extends Error {
	constructor() {
		super('Tu n\'as pas la permission d\'exécuter cette commande !');
	}
}
