const axios = require('axios');

module.exports.config = {
	name: 'bard',
	version: '69.69',
	credits: "cliff",
	hasPermission: 0,
	usePrefix: false,
	commandCategory: 'Ai-Chat',
	description: "Interact with the Bard, an AI Language Model created by Google. Free AI API from Cyni, please visit https://cyni-api-collection.onrender.com/",
	usages: '{pn}bard [query]',
	cooldown: 5
};

module.exports.run = async function ({ api, event, args, usersData }) {
	try {
		const query = args.join(" ") || "hello";
		const { name } = (await usersData.get(event.senderID));

		if (query) {
			api.setMessageReaction("⏳", event.messageID, (err) => console.log(err), true);
			const processingMessage = await api.sendMessage(
				`Asking ✨ Bard. Please wait a moment...`,
				event.threadID
			);

			const apiUrl = `https://lianeapi.onrender.com/@cyni-api/api/bard?key=j86bwkwo-8hako-12C&userName=${encodeURIComponent(name || "a user")}&query=${encodeURIComponent(query)}`;
			const response = await axios.get(apiUrl);

			if (response.data && response.data.message) {
				const trimmedMessage = response.data.message.trim();
				api.setMessageReaction("✅", event.messageID, (err) => console.log(err), true);
				await api.sendMessage({ body: trimmedMessage }, event.threadID, event.messageID);

				console.log(`Sent ✨ Bard's response to the user`);
			} else {
				throw new Error(`Invalid or missing response from ✨ Bard API`);
			}

			await api.unsendMessage(processingMessage.messageID);
		}
	} catch (error) {
		console.error(`❌ | Failed to get ✨ Bard's response: ${error.message}`);
		const errorMessage = `❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.`;
		api.sendMessage(errorMessage, event.threadID);
	}
};
