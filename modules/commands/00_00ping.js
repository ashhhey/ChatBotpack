module.exports.config = {
		name: 'ping',
		version: '69.69',
		credits: "cliff",
		hasPermission: 0,
		usePrefix: false,
		commandCategory: 'System',
		description: "Displays the current ping of the bot's system.",
		usages: 'Use {p}ping to check the current ping of the bot\'s system.',
		cooldown: 5
};

module.exports.run = async function ({ api, event, args }) {
		const timeStart = Date.now();
		await api.sendMessage("Checking Bot's ping", event.threadID);
		const ping = Date.now() - timeStart;
		api.sendMessage(`The current ping is ${ping}ms.`, event.threadID);
};
