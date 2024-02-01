const axios = require("axios");

const monitoredURLs = new Set();

module.exports.config = {
	name: "monitor",
	version: "1.0.0",
	hasPermission: 0,
	credits: "cliff",
	description: "Monitor URLs_Monitor URLs and check their uptime",
	usages: "{p}{n} [url]",
	usePrefix: false,
	commandCategory: "utility",
	cooldowns: 5,
};

module. exports. run = async function ({ api, event }) {
	const args = event.body.split(/\s+/);
	args.shift();

	if (args.length < 1) {
		api.sendMessage("🗨️ Usage: {p}monitor [url]", event.threadID);
		return;
	}

	const url = args[0];

	if (monitoredURLs.has(url)) {
		api.sendMessage(`⚠️ ${url} is already being monitored.`, event.threadID);
		return;
	}

	try {
		monitoredURLs.add(url);
		api.sendMessage(`🕟 Adding ${url} to the monitoring list...`, event.threadID);

		setTimeout(async () => {
			try {
				const response = await axios.post("https://api.render.com/deploy/srv-cmrsr5n109ks73fk7f90?key=y4rjxNVchSA", {
					url: url,
					apiKey: "uk1_6nYdUsdSsQs3lwjaviyVjPRZUhoxLysgNGkfl2Gc"
				});

				if (response.data && response.data.success === false) {
					api.sendMessage(response.data.msg, event.threadID);
					return;
				}

				api.sendMessage(`🟢 ${url} is successfully added to monitoring.`, event.threadID);
			} catch (error) {
				api.sendMessage("🔴 An error occurred while adding the URL to monitoring.", event.threadID);
				console.error(error);
			} finally {
				monitoredURLs.delete(url);
			}
		}, 3000);
	} catch (error) {
		api.sendMessage("🔴 An error occurred while starting the monitoring process.", event.threadID);
		console.error(error);
	}
};