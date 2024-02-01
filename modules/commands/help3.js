const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: "help3",
	version: "1.0.0",
	hasPermission: 0,
	credits: "Yenzy",
	usePrefix: true,
	description: "all available commands by category.",
	commandCategory: "GUIDE",
	cooldowns: 5,
	envConfig: {
		autoUnsend: false,
		delayUnsend: 2000
	}
};

module.exports.run = async ({ api, event }) => {
	const commandsPath = path.join(__dirname, '..', 'commands');

	try {
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		if (commandFiles.length === 0) {
			api.sendMessage("There are no commands available.", event.threadID);
			return;
		}

		const categories = {};
		let totalCommandList = 0; // Added to keep track of the total number of commands

		commandFiles.forEach(file => {
			const commandName = path.basename(file, '.js');
			const filePath = path.join(commandsPath, file);
			const commandModule = require(filePath);
			const commandConfig = commandModule.config;

			if (!categories[commandConfig.commandCategory]) {
				categories[commandConfig.commandCategory] = [];
			}

			categories[commandConfig.commandCategory].push(commandConfig.name);
			totalCommandList++; // Increment totalCommandList for each command
		});

		let message = '';
		for (const category in categories) {
			const commandList = categories[category].map(command => `.${command}`).join(' │');
			message += `╭────────────❍\n│  ${category}\n├───✦\n│${commandList}\n├───✦\n╰───────────⧕\n\n`;
		}

		message += `╭────────────❍\n│ » ${global.config.BOTNAME} has ${totalCommandList} cmds\n│ » Type .help <cmd>\n│ to show the command information\n╰────────────❍`;
		api.sendMessage(message, event.threadID);    
	} catch (error) {
		console.error('Error listing commands:', error);
		api.sendMessage("An error occurred while listing commands.", event.threadID);
	}
};