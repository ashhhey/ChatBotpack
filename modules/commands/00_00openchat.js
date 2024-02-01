const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

module.exports.config = {
	name: 'openchat',
	version: '1.2.4',
	hasPermssion: 0,
	credits: 'Yan Maglinte',
	description: 'An AI command that you can utilize by prompting through OpenChat!',
	usePrefix: false,
	commandCategory: 'chatbots',
	usages: 'OpenChat [prompt]',
	cooldowns: 5,
};

const convos = 'modules/commands/cache/chats/';

async function conversationHistory(conversation, event) {
	try {
		await fs.writeFile(path.join(convos, `${event.senderID}.json`), JSON.stringify(conversation.slice(-5), null, 2));
	} catch (error) {
		console.error('Error saving conversation to file:', error);
	}
}

async function loadConversation(event) {
	try {
		const filePath = path.join(convos, `${event.senderID}.json`);
		const data = await fs.readFile(filePath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		if (error.code === 'ENOENT') {
			const yan = [];
			await conversationHistory(yan, event);
			return yan;
		} else {
			console.error('Error loading conversation from file:', error);
			return [];
		}
	}
}

module.exports.run = async function ({ api, event, args }) {
	let conversation = await loadConversation(event);

	if (args.length > 0) {
		api.setMessageReaction('⏱️', event.messageID, () => {}, true);
		conversation.push({ role: 'user', content: args.join(' ') });
	} else {
		api.sendMessage('Please specify a message!', event.threadID, event.messageID);
		api.setMessageReaction('❓', event.messageID, () => {}, true);
		return;
	}

	try {
		const res = await axios.post('https://openchat-ai.onrender.com/chat', {
			prompt: args.join(' '),
			system: 'From now on you are Openchat, that will be your name, developed by Yan Maglinte a male who loves to code. Add some emojis to your contents to make it adorable.',
			conversation,
		});

		const output = res.data.result;
		conversation.push({ role: 'assistant', content: output });

		api.sendMessage(output, event.threadID, event.messageID);
		api.setMessageReaction('', event.messageID, () => {}, true);

		await conversationHistory(conversation, event);
	} catch (error) {
		api.sendMessage('⚠️ Something went wrong: ' + error, event.threadID, event.messageID);
		api.setMessageReaction('⚠️', event.messageID, () => {}, true);
	}
};